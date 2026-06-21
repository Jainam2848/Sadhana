import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useRoutines, useProfile } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Subheading, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { LibrarySkeleton } from '@/components/ui/Skeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Search, ChevronRight, Lock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CATEGORIES = ['Asana', 'Pranayama', 'Dhyana', 'Philosophy'];

export default function LibraryScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  const { data: profile } = useProfile(user?.id);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch routines using React Query
  const { data: routines, isLoading, isError, refetch } = useRoutines(activeCategory?.toLowerCase() || undefined);
  const handleRoutineSelect = (routineId: string) => {
    const routineObj = routines?.find(r => r.id === routineId);
    console.log(`[LibraryScreen] Navigating to /course-detail. Params: routineId=${routineId}, title="${routineObj?.title || 'unknown'}"`);
    router.push({
      pathname: '/course-detail',
      params: { routineId },
    });
  };
  // Local client side filtering for search
  const filteredRoutines = routines?.filter((routine) =>
    routine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    routine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
  };

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top Header */}
      <View className="pt-16 pb-4 px-6 z-40 bg-background/80">
        <Micro className="text-secondary-text mb-1">Explore</Micro>
        <Display className="mb-6">Sadhana Library</Display>

        {/* Search Bar */}
        <View 
          className="flex-row items-center bg-surface border border-surface-border rounded-xl px-4 py-2.5 mb-6"
          accessibilityRole="search"
        >
          <Search size={18} color={colors.secondaryText} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-primary-text font-sans text-sm p-0 h-5"
            placeholder="Search posture, breathing, philosophy..."
            placeholderTextColor="#A69580"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search routines"
          />
        </View>

        {/* Category Chips Horizontal Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-6 px-6"
          contentContainerStyle={{ gap: 8, paddingRight: 32 }}
          accessibilityRole="tablist"
        >
          <PressableAnimated
            haptic="light"
            className={`px-4 py-2 rounded-full border ${
              activeCategory === null
                ? 'bg-accent-terracotta border-accent-terracotta'
                : 'bg-surface border-surface-border'
            }`}
            onPress={() => setActiveCategory(null)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === null }}
            accessibilityLabel="Show all categories"
          >
            <Text
              className={`font-sans text-xs font-bold ${
                activeCategory === null ? 'text-white' : 'text-primary-text'
              }`}
            >
              All
            </Text>
          </PressableAnimated>

          {CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <PressableAnimated
                key={category}
                haptic="light"
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? 'bg-accent-terracotta border-accent-terracotta'
                    : 'bg-surface border-surface-border'
                }`}
                onPress={() => setActiveCategory(isSelected ? null : category)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Category ${category}`}
              >
                <Text
                  className={`font-sans text-xs font-medium ${
                    isSelected ? 'text-white' : 'text-primary-text'
                  }`}
                >
                  {category}
                </Text>
              </PressableAnimated>
            );
          })}
        </ScrollView>
      </View>

      {/* Routines Grid/List */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <LibrarySkeleton />
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="gap-4">
            {filteredRoutines && filteredRoutines.length > 0 ? (
              filteredRoutines.map((routine, index) => {
                const isLocked = routine.is_premium && !profile?.premium;
                return (
                  <Animated.View
                    entering={FadeInDown.delay(index * 60)}
                    key={routine.id}
                  >
                    <PressableAnimated
                      haptic="light"
                      className="bg-surface border border-surface-border p-4 rounded-xl flex-row justify-between items-center active:bg-surface-border/10"
                      onPress={() => handleRoutineSelect(routine.id)}
                      accessibilityLabel={`${routine.title}, ${routine.category}, ${routine.duration_minutes} minutes. ${isLocked ? 'Locked Premium' : 'Unlocked'}`}
                    >
                      <View className="flex-1 pr-4">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Subheading className="text-[15px] font-sans font-bold text-primary-text truncate">
                            {routine.title}
                          </Subheading>
                          {isLocked && (
                            <Lock size={12} color={colors.secondaryText} />
                          )}
                        </View>
                        <Caption className="text-xs text-secondary-text">
                          {routine.category.toUpperCase()} • {routine.duration_minutes} min
                        </Caption>
                      </View>
                      <ChevronRight size={18} color={colors.accent} />
                    </PressableAnimated>
                  </Animated.View>
                );
              })
            ) : (
              <EmptyState
                title="No Practices Found"
                description="We couldn't find any routines right now. Breathe in, clear your search, or try another category."
                ctaText="Reset All Filters"
                onCtaPress={handleClearFilters}
              />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
