import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useProfile } from '@/hooks/api';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Settings, LogOut, Lock, Award } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Fetch profile details dynamically
  const { data: profile, isLoading } = useProfile(user?.id);

  const stats = [
    { value: '18', label: 'Sessions' },
    { value: '4.5', label: 'Hours' },
    { value: '12', label: 'Day Streak' },
  ];

  // Helper to generate a 6x7 practice heatmap grid (42 cells)
  const renderHeatmap = () => {
    const cols = 6;
    const rows = 7;
    const columns = [];

    // Seed visual tiers (0 = empty, 1 = low, 2 = medium, 3 = high)
    const seedTiers = [
      [1, 0, 2, 0, 1, 0, 0],
      [0, 1, 0, 3, 0, 2, 1],
      [1, 2, 0, 1, 0, 0, 2],
      [0, 0, 1, 0, 2, 3, 0],
      [2, 1, 0, 1, 0, 0, 1],
      [0, 0, 2, 1, 3, 0, 0],
    ];

    for (let c = 0; c < cols; c++) {
      const cells = [];
      for (let r = 0; r < rows; r++) {
        const tier = seedTiers[c]?.[r] || 0;
        let cellColor = 'bg-surface-border/20'; // tier 0
        if (tier === 1) cellColor = 'bg-accent-terracotta/20';
        if (tier === 2) cellColor = 'bg-accent-terracotta/55';
        if (tier === 3) cellColor = 'bg-accent-terracotta';

        cells.push(
          <View
            key={r}
            className={`w-4 h-4 rounded-sm m-0.5 ${cellColor}`}
          />
        );
      }
      columns.push(
        <View key={c} className="flex-col">
          {cells}
        </View>
      );
    }

    return columns;
  };

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top App Bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <Heading className="text-primary font-serif">Profile</Heading>
        <Pressable
          className="w-10 h-10 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color={colors.primaryText} />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* User Meta Card */}
          <View className="items-center justify-center text-center mb-8 gap-3">
            <View className="w-24 h-24 rounded-full border border-accent-terracotta p-1">
              <Image
                className="w-full h-full rounded-full object-cover"
                source={{ uri: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU4rze07XFKfWs--9lYl1SLu5Dwc9f2i9OLbeYHxVWjKNMJgDSbYLbTjvbtDdl-u0TK4G9LWRTLwlJslNDoWIl-XBKG9lMbZT4Bljdyxaz2jGHmhuhViqSeMjfF1sjArH_JeXL-ceHWb7SJfs5meuUorPJeidxYInXadeCVlQGNpcSg0RjcGCcyYX6mCCoB54vHDQCq0r_ToC6Y_Mp7Rh1N5CPC6qW7ozUcJGeQ7QQF0lRZbdFvOwR1EFtmMkBkLALfcdt9_XKCA' }}
              />
            </View>
            <View className="items-center">
              <Heading className="text-xl font-bold text-primary-text">
                {profile?.username || user?.name || 'Asha Devi'}
              </Heading>
              <Caption className="text-accent-terracotta font-sans text-xs font-bold uppercase tracking-wider mt-1">
                {profile?.premium ? 'Creator+ Member' : 'Free Tier Seeker'}
              </Caption>
            </View>
          </View>

          {/* Stats Bar */}
          <View className="flex-row justify-around border-t border-b border-surface-border py-6 mb-8 bg-surface/30 rounded-xl">
            {stats.map((stat, idx) => (
              <View key={idx} className="items-center justify-center flex-1">
                <Text className="font-serif text-3xl font-bold text-primary-text">{stat.value}</Text>
                <Caption className="text-secondary-text font-sans mt-1">{stat.label}</Caption>
              </View>
            ))}
          </View>

          {/* Heatmap Container */}
          <View className="mb-8 gap-4">
            <Subheading className="text-primary-text font-serif text-base">
              Practice Heatmap
            </Subheading>
            <View className="bg-surface rounded-xl border border-surface-border p-5 items-center justify-center">
              <View className="flex-row justify-center gap-1">
                {renderHeatmap()}
              </View>
            </View>
          </View>

          {/* Upgrade Banner for Free Users */}
          {!profile?.premium && (
            <Pressable
              className="bg-accent-terracotta/10 border border-accent-terracotta/20 rounded-xl p-5 flex-row items-center justify-between"
              onPress={() => router.push('/(auth)/paywall')}
            >
              <View className="flex-1 pr-4">
                <Text className="font-sans font-bold text-sm text-accent-terracotta">
                  Unlock Personalized Plans
                </Text>
                <Caption className="text-secondary-text text-xs mt-1">
                  Start your 7-day free trial to get customized Asana, Pranayama, and Dhyana routines.
                </Caption>
              </View>
              <Award size={20} color={colors.accent} />
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}
