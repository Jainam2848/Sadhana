import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

const quotes = [
  "Breathe in. Let the ground support you.",
  "Take this moment to find your center.",
  "In quietness, energy is restored.",
  "Return to the natural rhythm of your breath.",
  "A steady mind shines like a quiet flame.",
  "Feel the stillness around each breath.",
];

export function PremiumLoading({ label }: { label?: string }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Sync state with OS reduced motion
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      rotation.value = 0;
      return;
    }

    // 8-second breathing loop: 4s expand, 4s contract
    scale.value = withRepeat(
      withTiming(1.22, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Continuous slow rotation (360 deg over 32 seconds)
    rotation.value = withRepeat(
      withTiming(360, { duration: 32000, easing: Easing.linear }),
      -1,
      false
    );

    // Quote fading loop: fade out/in every 8s
    const quoteInterval = setInterval(() => {
      textOpacity.value = withTiming(0, { duration: 1500 }, (finished) => {
        if (finished) {
          runOnJS(setQuoteIndex)((prev) => (prev + 1) % quotes.length);
        }
      });
    }, 8000);

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
      clearInterval(quoteInterval);
    };
  }, [reduceMotion]);

  // Sync quote index change with opacity fade-in
  useEffect(() => {
    textOpacity.value = withTiming(0.85, { duration: 1500 });
    return () => {
      cancelAnimation(textOpacity);
    };
  }, [quoteIndex]);

  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Breathing Lotus Mandala Svg */}
        <Animated.View style={[styles.mandalaWrapper, animatedMandalaStyle]}>
          <Svg width="140" height="140" viewBox="0 0 100 100">
            <G stroke={colors.accent} strokeWidth="0.5" fill="none" opacity="0.35">
              <Circle cx="50" cy="50" r="42" strokeDasharray="2,2" />
              <Circle cx="50" cy="50" r="30" />
              <Circle cx="50" cy="50" r="18" strokeDasharray="1,1" />
              
              {/* Petal structures rotated cleanly via standard G components */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <G key={angle} rotation={angle} origin="50, 50">
                  <Path
                    d="M50 50 C55 35, 55 20, 50 10 C45 20, 45 35, 50 50 Z"
                    opacity="0.55"
                  />
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>

        {/* Informative breathing guide prompt */}
        <Typography variant="body" style={[styles.loadingLabel, { color: colors.secondaryText }]}>
          {label || "aligning sanctuary"}
        </Typography>

        {/* Beautiful Comforting Quote */}
        <Animated.View style={[styles.quoteContainer, animatedTextStyle]}>
          <Typography variant="subheading" style={[styles.quoteText, { color: colors.primaryText }]}>
            “ {quotes[quoteIndex]} ”
          </Typography>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mandalaWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  loadingLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.5,
    marginBottom: 16,
  },
  quoteContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
