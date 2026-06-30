import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, AppState, Platform } from 'react-native';
import Svg, { Circle, Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedG = Animated.createAnimatedComponent(G) as any;

function LotusPetal({ style, color }: { style: any; color: string }) {
  return (
    <Animated.View style={[styles.lotusPetal, style]} pointerEvents="none">
      <Svg width="16" height="24" viewBox="0 0 10 20">
        <Path
          d="M5 0 C7.5 5, 7.5 15, 5 20 C2.5 15, 2.5 5, 5 0 Z"
          fill={color}
          opacity={0.35}
        />
      </Svg>
    </Animated.View>
  );
}

function Particle({ style, color }: { style: any; color: string }) {
  return (
    <Animated.View
      style={[
        styles.particleDot,
        style,
        { backgroundColor: color }
      ]}
      pointerEvents="none"
    />
  );
}

export function HeroBackground({
  timeOfDay,
  hours,
  reduceMotion = false,
}: {
  timeOfDay: 'morning' | 'midday' | 'evening';
  hours: number;
  reduceMotion?: boolean;
}) {
  const { colors } = useTheme();
  const isNight = hours >= 21 || hours < 5;

  const config = useMemo(() => {
    if (timeOfDay === 'morning') {
      return {
        gradStart: '#FFEBE0', // Sunrise peach
        gradEnd: colors.background,
        sunColor: '#FFD2B8',
        sunOpacity: 0.65,
        mountainColor1: 'rgba(212, 140, 112, 0.05)',
        mountainColor2: 'rgba(212, 140, 112, 0.12)',
        lightRayOpacity: 0.1,
        showStars: false,
        petalColor1: '#FFD2B8',
        petalColor2: '#D48C70',
        particleColor1: '#FFF0E6',
        particleColor2: '#FFD2B8',
      };
    } else if (timeOfDay === 'midday') {
      return {
        gradStart: '#E5EEFC', // Midday soft blue
        gradEnd: colors.background,
        sunColor: '#FFFDE8',
        sunOpacity: 0.5,
        mountainColor1: 'rgba(122, 111, 104, 0.03)',
        mountainColor2: 'rgba(122, 111, 104, 0.08)',
        lightRayOpacity: 0.05,
        showStars: false,
        petalColor1: '#E29B7A',
        petalColor2: '#C95B32',
        particleColor1: '#FFFDE8',
        particleColor2: '#DCE8FA',
      };
    } else if (isNight) {
      return {
        gradStart: '#080811', // Deep night violet
        gradEnd: colors.background,
        sunColor: '#E6E4FA', // Silver moon
        sunOpacity: 0.3,
        mountainColor1: 'rgba(245, 239, 235, 0.02)',
        mountainColor2: 'rgba(245, 239, 235, 0.06)',
        lightRayOpacity: 0,
        showStars: true,
        petalColor1: '#8A82C7', // Lilac
        petalColor2: '#534E7C', // Volcanic violet
        particleColor1: '#E6E4FA', // Silver moondust
        particleColor2: '#413A6B',
      };
    } else {
      // Evening
      return {
        gradStart: '#2A1814', // Sunset terracotta
        gradEnd: colors.background,
        sunColor: '#E27E57', // Dusk sun
        sunOpacity: 0.4,
        mountainColor1: 'rgba(226, 126, 87, 0.04)',
        mountainColor2: 'rgba(226, 126, 87, 0.10)',
        lightRayOpacity: 0.08,
        showStars: false,
        petalColor1: '#E27E57',
        petalColor2: '#B85834',
        particleColor1: '#FFE6D9',
        particleColor2: '#E27E57',
      };
    }
  }, [timeOfDay, isNight, colors.background]);

  const mistOffset1 = useSharedValue(0);
  const mistOffset2 = useSharedValue(0);
  const lightRayPulse = useSharedValue(0.8);

  const petal1Progress = useSharedValue(0);
  const petal2Progress = useSharedValue(0);
  const petal3Progress = useSharedValue(0);

  const part1Progress = useSharedValue(0);
  const part2Progress = useSharedValue(0);
  const part3Progress = useSharedValue(0);
  const part4Progress = useSharedValue(0);

  const [appActive, setAppActive] = useState(true);

  useEffect(() => {
    const handleStateChange = (nextStatus: string) => {
      setAppActive(nextStatus === 'active');
    };
    const subscription = AppState.addEventListener('change', handleStateChange);
    setAppActive(AppState.currentState === 'active');
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || !appActive) {
      mistOffset1.value = 0;
      mistOffset2.value = 0;
      lightRayPulse.value = 0.8;
      petal1Progress.value = 0;
      petal2Progress.value = 0;
      petal3Progress.value = 0;
      part1Progress.value = 0;
      part2Progress.value = 0;
      part3Progress.value = 0;
      part4Progress.value = 0;

      cancelAnimation(mistOffset1);
      cancelAnimation(mistOffset2);
      cancelAnimation(lightRayPulse);
      cancelAnimation(petal1Progress);
      cancelAnimation(petal2Progress);
      cancelAnimation(petal3Progress);
      cancelAnimation(part1Progress);
      cancelAnimation(part2Progress);
      cancelAnimation(part3Progress);
      cancelAnimation(part4Progress);
      return;
    }

    mistOffset1.value = withRepeat(
      withTiming(40, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    mistOffset2.value = withRepeat(
      withTiming(-30, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    lightRayPulse.value = withRepeat(
      withTiming(1.2, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    petal1Progress.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.linear }), -1, false);
    petal2Progress.value = withRepeat(withTiming(1, { duration: 22000, easing: Easing.linear }), -1, false);
    petal3Progress.value = withRepeat(withTiming(1, { duration: 18000, easing: Easing.linear }), -1, false);

    part1Progress.value = withRepeat(withTiming(1, { duration: 11000, easing: Easing.linear }), -1, false);
    part2Progress.value = withRepeat(withTiming(1, { duration: 15000, easing: Easing.linear }), -1, false);
    part3Progress.value = withRepeat(withTiming(1, { duration: 13000, easing: Easing.linear }), -1, false);
    part4Progress.value = withRepeat(withTiming(1, { duration: 17000, easing: Easing.linear }), -1, false);

    return () => {
      cancelAnimation(mistOffset1);
      cancelAnimation(mistOffset2);
      cancelAnimation(lightRayPulse);
      cancelAnimation(petal1Progress);
      cancelAnimation(petal2Progress);
      cancelAnimation(petal3Progress);
      cancelAnimation(part1Progress);
      cancelAnimation(part2Progress);
      cancelAnimation(part3Progress);
      cancelAnimation(part4Progress);
    };
  }, [reduceMotion, appActive]);

  const animatedMist1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: mistOffset1.value }],
  }));

  const animatedMist2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: mistOffset2.value }],
  }));

  const animatedRayStyle = useAnimatedStyle(() => ({
    opacity: lightRayPulse.value * config.lightRayOpacity,
  }));

  const animatedPetal1 = useAnimatedStyle(() => {
    const x = 30 + petal1Progress.value * 90;
    const y = -20 + petal1Progress.value * 200;
    const rot = petal1Progress.value * 360;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal1Progress.value * Math.PI) * 0.45,
    };
  });

  const animatedPetal2 = useAnimatedStyle(() => {
    const x = 280 - petal2Progress.value * 120;
    const y = 10 + petal2Progress.value * 210;
    const rot = petal2Progress.value * -240;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal2Progress.value * Math.PI) * 0.35,
    };
  });

  const animatedPetal3 = useAnimatedStyle(() => {
    const x = 110 + petal3Progress.value * 80;
    const y = 60 + petal3Progress.value * 180;
    const rot = petal3Progress.value * 180;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal3Progress.value * Math.PI) * 0.3,
    };
  });

  const animatedPart1 = useAnimatedStyle(() => {
    const y = 200 - part1Progress.value * 150;
    return {
      transform: [{ translateX: 60 }, { translateY: y }],
      opacity: Math.sin(part1Progress.value * Math.PI) * 0.4,
    };
  });

  const animatedPart2 = useAnimatedStyle(() => {
    const y = 220 - part2Progress.value * 180;
    return {
      transform: [{ translateX: 150 + Math.sin(part2Progress.value * Math.PI * 2) * 15 }, { translateY: y }],
      opacity: Math.sin(part2Progress.value * Math.PI) * 0.35,
    };
  });

  const animatedPart3 = useAnimatedStyle(() => {
    const y = 240 - part3Progress.value * 160;
    return {
      transform: [{ translateX: 290 }, { translateY: y }],
      opacity: Math.sin(part3Progress.value * Math.PI) * 0.4,
    };
  });

  const animatedPart4 = useAnimatedStyle(() => {
    const y = 180 - part4Progress.value * 140;
    return {
      transform: [{ translateX: 220 + Math.cos(part4Progress.value * Math.PI * 2) * 10 }, { translateY: y }],
      opacity: Math.sin(part4Progress.value * Math.PI) * 0.3,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="heroBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={config.gradStart} />
            <Stop offset="0.6" stopColor={config.gradStart} stopOpacity={0.8} />
            <Stop offset="1" stopColor={config.gradEnd} />
          </LinearGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#heroBgGrad)" />

        {config.showStars && (
          <G opacity={0.6}>
            <Circle cx="45" cy="50" r="0.8" fill="#FFF" opacity={0.8} />
            <Circle cx="120" cy="30" r="0.6" fill="#FFF" opacity={0.6} />
            <Circle cx="280" cy="70" r="1.0" fill="#FFF" opacity={0.9} />
            <Circle cx="320" cy="25" r="0.5" fill="#FFF" opacity={0.5} />
            <Circle cx="190" cy="80" r="0.6" fill="#FFF" opacity={0.7} />
            <Circle cx="80" cy="95" r="0.8" fill="#FFF" opacity={0.7} />
          </G>
        )}

        {!reduceMotion && config.lightRayOpacity > 0 && (
          <AnimatedG style={animatedRayStyle}>
            <Path d="M120 0 L150 200 L180 200 Z" fill={config.sunColor} opacity={0.2} />
            <Path d="M220 0 L200 220 L250 220 Z" fill={config.sunColor} opacity={0.15} />
            <Path d="M80 0 L40 180 L100 180 Z" fill={config.sunColor} opacity={0.15} />
          </AnimatedG>
        )}

        <Circle cx="200" cy="95" r="48" fill={config.sunColor} opacity={config.sunOpacity} />

        <Path
          d="M-50 200 L30 110 L110 170 L190 80 L270 160 L360 70 L460 200 Z"
          fill={config.mountainColor1}
        />

        <Path
          d="M-50 220 L70 140 L150 190 L240 120 L320 170 L400 110 L490 220 Z"
          fill={config.mountainColor2}
        />
      </Svg>

      {!reduceMotion && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.mistLayer, { bottom: 15 }, animatedMist1Style]}>
            <Svg width="500" height="50" viewBox="0 0 500 50">
              <Path
                d="M0 25 Q125 10 250 25 T500 25 L500 50 L0 50 Z"
                fill={timeOfDay === 'midday' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'}
                opacity={0.5}
              />
            </Svg>
          </Animated.View>
          <Animated.View style={[styles.mistLayer, { bottom: 0 }, animatedMist2Style]}>
            <Svg width="500" height="50" viewBox="0 0 500 50">
              <Path
                d="M0 25 Q125 40 250 25 T500 25 L500 50 L0 50 Z"
                fill={timeOfDay === 'midday' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.15)'}
                opacity={0.4}
              />
            </Svg>
          </Animated.View>

          {/* Floating Lotus Petals */}
          <LotusPetal style={animatedPetal1} color={config.petalColor1} />
          {Platform.OS !== 'android' && (
            <>
              <LotusPetal style={animatedPetal2} color={config.petalColor2} />
              <LotusPetal style={animatedPetal3} color={config.petalColor2} />
            </>
          )}

          {/* Drifting Ambient Particles */}
          <Particle style={animatedPart1} color={config.particleColor1} />
          <Particle style={animatedPart2} color={config.particleColor2} />
          {Platform.OS !== 'android' && (
            <>
              <Particle style={animatedPart3} color={config.particleColor1} />
              <Particle style={animatedPart4} color={config.particleColor2} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lotusPetal: {
    position: 'absolute',
  },
  particleDot: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
  },
  mistLayer: {
    position: 'absolute',
    left: -50,
    right: -50,
  },
});
