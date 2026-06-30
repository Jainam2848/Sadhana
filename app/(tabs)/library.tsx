import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useRoutines, useProfile } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Display, Caption, Micro, Heading, Body } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { LibrarySkeleton } from '@/components/ui/Skeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Search, ChevronRight, Lock, Play, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NEED_CATEGORIES = [
  { id: 'sleep', label: 'Sleep', icon: '🌙', desc: 'Wind down and ease into restorative rest' },
  { id: 'stress', label: 'Stress', icon: '🍃', desc: 'Calm the nervous system and release anxiety' },
  { id: 'mobility', label: 'Mobility', icon: '🧘', desc: 'Release stiffness and open the body' },
  { id: 'focus', label: 'Focus', icon: '🎯', desc: 'Sharpen attention and clear mental chatter' },
  { id: 'energy', label: 'Energy', icon: '⚡', desc: 'Awaken body heat and vital energy' },
  { id: 'philosophy', label: 'Philosophy', icon: '📖', desc: 'Contemplative wisdom and traditional teachings' },
  { id: 'breathwork', label: 'Breathwork', icon: '💨', desc: 'Prana regulation and box breathing' },
  { id: 'mantra', label: 'Mantra', icon: '🔔', desc: 'Vibrational chanting and seed sounds' }
];

const getRoutinesByNeed = (routines: any[], categoryId: string) => {
  if (!routines) return [];
  
  return routines.filter((routine) => {
    const title = (routine.title || '').toLowerCase();
    const desc = (routine.description || '').toLowerCase();
    const goals = Array.isArray(routine.goals) ? routine.goals : [];
    const cat = (routine.category || '').toLowerCase();

    switch (categoryId) {
      case 'sleep':
        return goals.includes('sleep') || desc.includes('sleep') || desc.includes('restorative');
      case 'stress':
        return goals.includes('stress') || desc.includes('calm') || desc.includes('anxiety') || desc.includes('soothe');
      case 'mobility':
        return goals.includes('mobility') || cat === 'asana';
      case 'focus':
        return goals.includes('focus') || cat === 'dhyana' || title.includes('concentration') || title.includes('gazing');
      case 'energy':
        return goals.includes('energy') || title.includes('solar') || title.includes('vinyasa') || title.includes('fire') || title.includes('awaken') || goals.includes('strength');
      case 'philosophy':
        return cat === 'philosophy' || title.includes('wisdom') || title.includes('contemplation') || title.includes('metta') || desc.includes('wisdom') || desc.includes('traditional');
      case 'breathwork':
        return cat === 'pranayama' || title.includes('breath');
      case 'mantra':
        return title.includes('mantra') || title.includes('chant') || title.includes('beeja') || title.includes('humming') || desc.includes('sound');
      default:
        return true;
    }
  });
};

interface CuratedCardProps {
  routine: any;
  isLocked: boolean;
  accentColor: string;
  onPress: () => void;
}

function CuratedCard({ routine, isLocked, accentColor, onPress }: CuratedCardProps) {
  const goals = routine.goals || [];
  const cat = routine.category || '';

  // Premium card styling based on need/goal for a crafted visual identity
  const cardStyle = useMemo(() => {
    if (goals.includes('sleep') || routine.title.toLowerCase().includes('nidra')) {
      return {
        bgClass: 'bg-[#EFF3FA] dark:bg-[#1C202B]',
        borderClass: 'border-[#DFE5F3] dark:border-[#2A3043]',
        textClass: 'text-indigo-600 dark:text-indigo-300',
        badge: 'Sleep 🌙'
      };
    }
    if (goals.includes('stress') || goals.includes('mobility')) {
      return {
        bgClass: 'bg-[#EBF7F2] dark:bg-[#14231C]',
        borderClass: 'border-[#D9EFE5] dark:border-[#21372C]',
        textClass: 'text-teal-700 dark:text-teal-300',
        badge: goals.includes('stress') ? 'Calm 🍃' : 'Flex 🧘'
      };
    }
    if (goals.includes('energy') || cat === 'asana') {
      return {
        bgClass: 'bg-[#FFF7F0] dark:bg-[#2A1C13]',
        borderClass: 'border-[#FFE7D6] dark:border-[#3C271A]',
        textClass: 'text-amber-700 dark:text-amber-300',
        badge: 'Energy ⚡'
      };
    }
    return {
      bgClass: 'bg-[#FAF8F5] dark:bg-[#1B1713]',
      borderClass: 'border-[#F0EBE4] dark:border-[#2B241F]',
      textClass: 'text-accent-terracotta',
      badge: routine.category.toUpperCase()
    };
  }, [goals, cat, routine.title]);

  return (
    <PressableAnimated
      haptic="light"
      className={`w-[185px] p-4.5 rounded-2xl border justify-between min-h-[140px] ${cardStyle.bgClass} ${cardStyle.borderClass}`}
      onPress={onPress}
      scaleTo={0.96}
      accessibilityLabel={`${routine.title}, ${routine.category}, ${routine.duration_minutes} minutes`}
    >
      <View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className={`text-[10px] font-sans font-bold uppercase tracking-widest ${cardStyle.textClass}`}>
            {cardStyle.badge}
          </Text>
          {isLocked && <Lock size={12} color="#C44B22" />}
        </View>
        
        <Text className="font-serif text-sm font-bold text-primary-text leading-snug" numberOfLines={2}>
          {routine.title}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center mt-3 pt-2.5 border-t border-surface-border/10">
        <Caption className="text-[11px] text-secondary-text font-mono">
          {routine.duration_minutes} min • {routine.experience_level}
        </Caption>
        <Play size={12} color={accentColor} fill={accentColor} />
      </View>
    </PressableAnimated>
  );
}

export default function LibraryScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const timeOfDay = useThemeStore((state) => state.timeOfDay);

  const { data: profile } = useProfile(user?.id);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all routines from DB / Mock catalog
  const { data: allRoutines, isLoading, isError, refetch } = useRoutines();

  const handleRoutineSelect = (routineId: string) => {
    router.push({
      pathname: '/course-detail',
      params: { routineId },
    });
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
  };

  // Time-of-day personalized recommendations ("Just for You")
  const recommendedRoutines = useMemo(() => {
    if (!allRoutines) return [];
    if (timeOfDay === 'morning') {
      return allRoutines.filter(r => 
        r.goals?.includes('energy') || 
        r.goals?.includes('mobility') || 
        r.category === 'asana'
      ).slice(0, 3);
    } else {
      return allRoutines.filter(r => 
        r.goals?.includes('sleep') || 
        r.goals?.includes('stress') || 
        r.category === 'dhyana'
      ).slice(0, 3);
    }
  }, [allRoutines, timeOfDay]);

  // Need categories filtered lists
  const sleepRoutines = useMemo(() => getRoutinesByNeed(allRoutines || [], 'sleep').slice(0, 4), [allRoutines]);
  const stressRoutines = useMemo(() => getRoutinesByNeed(allRoutines || [], 'stress').slice(0, 4), [allRoutines]);
  const mobilityRoutines = useMemo(() => getRoutinesByNeed(allRoutines || [], 'mobility').slice(0, 4), [allRoutines]);
  const breathworkRoutines = useMemo(() => getRoutinesByNeed(allRoutines || [], 'breathwork').slice(0, 4), [allRoutines]);

  // Spotlight routine of the day
  const featuredRoutine = useMemo(() => {
    return allRoutines?.find(r => r.title.toLowerCase().includes('breath of fire')) || allRoutines?.[0];
  }, [allRoutines]);
  
  const isFeaturedLocked = featuredRoutine?.is_premium && !profile?.premium;

  // Search/Filter dynamic results
  const isSearchActive = searchQuery.length > 0 || activeCategory !== null;

  const filteredRoutines = useMemo(() => {
    if (!allRoutines) return [];
    let result = allRoutines;
    
    if (activeCategory !== null) {
      result = getRoutinesByNeed(allRoutines, activeCategory);
    }
    
    if (searchQuery.length > 0) {
      result = result.filter((routine) => 
        routine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [allRoutines, activeCategory, searchQuery]);

  return (
    <View className="flex-1 bg-transparent relative">
      <MandalaThread />

      {/* Top Header */}
      <View className="pt-16 pb-4 px-6 z-40 bg-transparent">
        <Micro className="text-secondary-text mb-1 font-sans font-semibold">Sanctuary</Micro>
        <Display className="mb-6 font-serif">Sadhana Library</Display>

        {/* Search Bar */}
        <View 
          className="flex-row items-center bg-surface border border-surface-border rounded-xl px-4 py-2.5 mb-6"
          accessibilityRole="search"
        >
          <Search size={18} color={colors.secondaryText} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-primary-text font-sans text-sm p-0 h-5"
            placeholder="Search sleep, stress, mobility, or breathwork..."
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
                : 'bg-surface border-surface-border/40'
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

          {NEED_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <PressableAnimated
                key={cat.id}
                haptic="light"
                className={`px-4 py-2 rounded-full border flex-row items-center gap-1 ${
                  isSelected
                    ? 'bg-accent-terracotta border-accent-terracotta'
                    : 'bg-surface border-surface-border/40'
                }`}
                onPress={() => setActiveCategory(isSelected ? null : cat.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Category ${cat.label}`}
              >
                <Text className="text-xs">{cat.icon}</Text>
                <Text
                  className={`font-sans text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-primary-text'
                  }`}
                >
                  {cat.label}
                </Text>
              </PressableAnimated>
            );
          })}
        </ScrollView>
      </View>

      {/* Main content area */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <LibrarySkeleton />
      ) : isSearchActive ? (
        /* Need-filtered and search results layout */
        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            {filteredRoutines && filteredRoutines.length > 0 ? (
              filteredRoutines.map((routine, index) => {
                const isLocked = routine.is_premium && !profile?.premium;
                return (
                  <Animated.View
                    entering={FadeInDown.delay(index * 30)}
                    key={routine.id}
                  >
                    <PressableAnimated
                      haptic="light"
                      className="bg-surface border border-surface-border p-4 rounded-xl flex-row justify-between items-center active:bg-surface-border/10"
                      onPress={() => handleRoutineSelect(routine.id)}
                      accessibilityLabel={`${routine.title}, ${routine.category}, ${routine.duration_minutes} minutes`}
                    >
                      <View className="flex-1 pr-4">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Heading style={{ fontSize: 15 }} className="font-sans font-bold text-primary-text truncate">
                            {routine.title}
                          </Heading>
                          {isLocked && <Lock size={12} color="#C44B22" />}
                        </View>
                        <Caption className="text-xs text-secondary-text font-mono uppercase">
                          {routine.category} • {routine.duration_minutes} min • {routine.experience_level}
                        </Caption>
                      </View>
                      <ChevronRight size={16} color={colors.accent} />
                    </PressableAnimated>
                  </Animated.View>
                );
              })
            ) : (
              <EmptyState
                title="Your Path Awaits"
                description="Every moment is a fresh start. Clear these filters and let the natural flow of practices return."
                ctaText="Clear Filters"
                onCtaPress={handleClearFilters}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        /* Curated Wellness Editorial Layout */
        <ScrollView
          className="flex-1 pt-2"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Featured Daily Spotlight ── */}
          {featuredRoutine && (
            <View className="px-6 mb-8">
              <PressableAnimated
                haptic="medium"
                className="bg-[#FFF8F2] dark:bg-[#231710] border border-accent-terracotta/25 p-5 rounded-2xl overflow-hidden relative"
                onPress={() => handleRoutineSelect(featuredRoutine.id)}
                scaleTo={0.99}
              >
                {/* Sparkle details */}
                <View className="absolute top-4 right-4 flex-row items-center gap-1 bg-accent-terracotta/10 border border-accent-terracotta/20 px-2.5 py-1 rounded-full">
                  <Sparkles size={12} color="#C44B22" />
                  <Micro className="text-accent-terracotta text-[9px] font-bold tracking-wider">
                    DAILY SPOTLIGHT
                  </Micro>
                </View>

                <Micro className="text-secondary-text mb-1 uppercase tracking-widest font-sans font-medium">
                  {featuredRoutine.category.toUpperCase()} • {featuredRoutine.duration_minutes} MIN
                </Micro>
                <Heading className="text-xl font-bold font-serif text-primary-text mb-2 pr-28">
                  {featuredRoutine.title}
                </Heading>
                <Body className="text-secondary-text text-sm leading-relaxed mb-4" numberOfLines={2}>
                  {featuredRoutine.description}
                </Body>
                
                <View className="flex-row justify-between items-center pt-3 border-t border-surface-border/15">
                  <Caption className="text-xs text-secondary-text uppercase font-mono">
                    LEVEL: {featuredRoutine.experience_level}
                  </Caption>
                  <View className="flex-row items-center gap-1.5">
                    {isFeaturedLocked && <Lock size={12} color="#C44B22" style={{ marginRight: 2 }} />}
                    <Text className="text-accent-terracotta font-sans font-bold text-xs">
                      Enter Practice Sanctuary →
                    </Text>
                  </View>
                </View>
              </PressableAnimated>
            </View>
          )}

          {/* ── Personalized "Just For You" Section ── */}
          {recommendedRoutines && recommendedRoutines.length > 0 && (
            <View className="mb-8">
              <View className="px-6 mb-3 flex-row justify-between items-center">
                <Heading style={{ fontSize: 16 }} className="font-serif font-bold text-primary-text">
                  {timeOfDay === 'morning' ? 'Awaken Your Energy 🌅' : 'Restore Your Calm 🌌'}
                </Heading>
                <Micro className="text-accent-terracotta uppercase tracking-wider font-semibold">Just for you</Micro>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
              >
                {recommendedRoutines.map((routine) => (
                  <CuratedCard
                    key={routine.id}
                    routine={routine}
                    isLocked={routine.is_premium && !profile?.premium}
                    accentColor={colors.accent}
                    onPress={() => handleRoutineSelect(routine.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Curated Section: Sleep Wind-Down ── */}
          {sleepRoutines && sleepRoutines.length > 0 && (
            <View className="mb-8">
              <Heading style={{ fontSize: 16 }} className="font-serif font-bold text-primary-text px-6 mb-3">
                Restorative Sleep & Wind-Down 🌙
              </Heading>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
              >
                {sleepRoutines.map((routine) => (
                  <CuratedCard
                    key={routine.id}
                    routine={routine}
                    isLocked={routine.is_premium && !profile?.premium}
                    accentColor={colors.accent}
                    onPress={() => handleRoutineSelect(routine.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Curated Section: Stress Relief ── */}
          {stressRoutines && stressRoutines.length > 0 && (
            <View className="mb-8">
              <Heading style={{ fontSize: 16 }} className="font-serif font-bold text-primary-text px-6 mb-3">
                Soothe Your Mind & Ease Stress 🍃
              </Heading>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
              >
                {stressRoutines.map((routine) => (
                  <CuratedCard
                    key={routine.id}
                    routine={routine}
                    isLocked={routine.is_premium && !profile?.premium}
                    accentColor={colors.accent}
                    onPress={() => handleRoutineSelect(routine.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Curated Section: Deep Mobility ── */}
          {mobilityRoutines && mobilityRoutines.length > 0 && (
            <View className="mb-8">
              <Heading style={{ fontSize: 16 }} className="font-serif font-bold text-primary-text px-6 mb-3">
                Open & Mobilize Your Body 🧘
              </Heading>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
              >
                {mobilityRoutines.map((routine) => (
                  <CuratedCard
                    key={routine.id}
                    routine={routine}
                    isLocked={routine.is_premium && !profile?.premium}
                    accentColor={colors.accent}
                    onPress={() => handleRoutineSelect(routine.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Curated Section: Breathwork ── */}
          {breathworkRoutines && breathworkRoutines.length > 0 && (
            <View className="mb-4">
              <Heading style={{ fontSize: 16 }} className="font-serif font-bold text-primary-text px-6 mb-3">
                Prana Control & Deep Breathwork 💨
              </Heading>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
              >
                {breathworkRoutines.map((routine) => (
                  <CuratedCard
                    key={routine.id}
                    routine={routine}
                    isLocked={routine.is_premium && !profile?.premium}
                    accentColor={colors.accent}
                    onPress={() => handleRoutineSelect(routine.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
