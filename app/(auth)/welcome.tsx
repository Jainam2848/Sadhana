import React, { useEffect, useState, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Display, Body, Caption } from '@/components/ui/Typography';
import { Svg, Path } from '@/components/ui/Compat';
import { Animated } from 'react-native';

const testimonials = [
  "A grounding start to every day.",
  "Finally, space to breathe.",
  "Editorial minimalism at its best.",
  "The ritual I didn't know I needed.",
];

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-rotate testimonials with a smooth cross-fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View className="flex-1 bg-background justify-between px-6 py-12 relative">
      {/* Decorative Background Arc */}
      <MandalaThread />

      {/* Top Brand Block */}
      <View className="flex-1 justify-center items-center mt-12">
        {/* Lotus Glyph SVG */}
        <View className="w-20 h-20 mb-8 items-center justify-center">
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Center Petal */}
            <Path
              d="M50 25 C55 40 55 60 50 75 C45 60 45 40 50 25 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            {/* Inner Petals */}
            <Path
              d="M50 75 C40 65 30 50 35 35 C40 45 45 65 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            <Path
              d="M50 75 C60 65 70 50 65 35 C60 45 55 65 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            {/* Mid Petals */}
            <Path
              d="M50 75 C30 70 20 55 25 45 C30 55 40 65 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            <Path
              d="M50 75 C70 70 80 55 75 45 C70 55 60 65 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            {/* Outer Petals */}
            <Path
              d="M50 75 C20 75 10 65 15 60 C20 65 35 70 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
            <Path
              d="M50 75 C80 75 90 65 85 60 C80 65 65 70 50 75 Z"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
            />
          </Svg>
        </View>

        {/* Title */}
        <Display className="text-center mb-4 px-4">
          Your Morning Begins Here
        </Display>

        {/* Description */}
        <Body className="text-secondary-text text-center px-6 leading-relaxed max-w-sm">
          A sanctuary for daily rituals, grounded in mindfulness and gentle observation.
        </Body>
      </View>

      {/* Mid Section: Testimonial Marquee (Cross-Fade Rotation) */}
      <View className="w-full py-6 my-6 border-t border-b border-surface-border items-center justify-center min-h-[72px]">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="font-sans text-sm italic text-secondary-text text-center px-4">
            "{testimonials[activeTestimonialIdx]}"
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Button Panel */}
      <View className="w-full items-center mb-4">
        <Pressable
          className="w-full max-w-[320px] bg-accent-terracotta py-4 rounded-xl items-center mb-6 active:opacity-90"
          onPress={() => router.push('/(auth)/personalize')}
        >
          <Text className="text-white font-sans font-bold text-base tracking-wide">
            Begin Your Journey
          </Text>
        </Pressable>

        <Pressable
          className="py-2"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-secondary-text font-sans text-sm underline underline-offset-4">
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
