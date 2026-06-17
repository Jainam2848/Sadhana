import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRoutine, useProfile } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { CourseDetailSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { ChevronLeft, Lock, CheckCircle, PlayCircle, BookOpen, Clock, Layers } from 'lucide-react-native';
import { Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function CourseDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  // Fetch routine details
  const { data: routine, isLoading, isError, refetch } = useRoutine(routineId);

  // Fetch profile to verify premium tier
  const { data: profile } = useProfile(user?.id);
  const isPremium = profile?.premium || user?.premium || false;

  const handlePlayLesson = (lessonIndex: number, isLessonLocked: boolean) => {
    if (isLessonLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Practice Locked',
        'This session is exclusive to Creator+ members. Would you like to explore subscription options?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/(auth)/paywall') },
        ]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Pass information to single-player
    router.push({
      pathname: '/single-player',
      params: {
        routineId: routine?.id,
        title: routine?.title,
        lessonTitle: lessonIndex === 0 ? 'Introduction & Origins' : routine?.title,
        mediaUrl: routine?.media_url,
        duration: lessonIndex === 0 ? '10' : routine?.duration_minutes?.toString(),
        category: routine?.category,
      },
    });
  };

  const handleBeginCourse = () => {
    if (!routine) return;
    // Play the first available active session (Session 2, the core practice)
    const isLocked = routine.is_premium && !isPremium;
    handlePlayLesson(1, isLocked);
  };

  if (isError) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!routine) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <Heading className="text-center mb-4">Practice Not Found</Heading>
        <PressableAnimated
          haptic="light"
          className="px-6 py-2.5 bg-accent-terracotta rounded-full active:opacity-90"
          onPress={() => router.back()}
          accessibilityLabel="Return to library"
        >
          <Text className="text-white font-sans font-bold text-sm">Return to Library</Text>
        </PressableAnimated>
      </View>
    );
  }

  // Generate mocked syllabus sessions for course structure
  const sessions = [
    {
      title: 'Introduction & Origins',
      duration: '10 min',
      type: 'Philosophy',
      isCompleted: true,
      isLocked: false,
    },
    {
      title: routine.title,
      duration: `${routine.duration_minutes} min`,
      type: routine.category.charAt(0).toUpperCase() + routine.category.slice(1),
      isCompleted: false,
      isLocked: routine.is_premium && !isPremium,
    },
    {
      title: `${routine.title} - Deepening`,
      duration: `${Math.round(routine.duration_minutes * 1.2)} min`,
      type: 'Advanced Practice',
      isCompleted: false,
      isLocked: routine.is_premium && !isPremium,
    },
    {
      title: 'Integration & Pratyahara',
      duration: '20 min',
      type: 'Integration',
      isCompleted: false,
      isLocked: !isPremium, // Session 4 is always locked for free users
    },
  ];

  return (
    <View className="flex-1 bg-background relative justify-between">
      <MandalaThread />

      {/* Floating Back Button */}
      <PressableAnimated
        haptic="light"
        className="absolute top-12 left-6 z-50 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-surface-border shadow active:scale-95 transition-transform duration-200"
        onPress={() => router.back()}
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={20} color={colors.primaryText} />
      </PressableAnimated>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Area */}
        <View 
          className="h-[240px] bg-warm-highlight/50 relative overflow-hidden flex items-center justify-center w-full border-b border-surface-border"
          accessibilityLabel="Course hero background"
        >
          <Layers size={64} color={colors.accent} strokeWidth={1} />
        </View>

        {/* Main Content Canvas */}
        <View className="bg-background rounded-t-[24px] -mt-6 pt-6 px-6 relative z-20">
          {/* Metadata Section */}
          <View className="flex-col gap-3 pt-2">
            <Micro className="text-accent-terracotta">{routine.category.toUpperCase()}</Micro>
            <Display className="text-3xl font-serif">{routine.title}</Display>
            
            <View className="flex-row items-center gap-3 mt-2" accessibilityLabel="Lead Instructor: Swami Vidyadhishananda">
              <Image
                className="w-10 h-10 rounded-full border border-surface-border object-cover bg-surface"
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_7gevYX4494t40AF-j9TtqTlakeUrDqCWOojwNVkDi3XojhrvINqqTp3krO1PjlfWcfdlO18tbKoC322zSA6vetJxLDvrlM2Fzw-cfho8FTZIb9oV10z5VG28FYABFTBD_06XVds6bWcHhj6nQvT0ZrxsLT_aQ8MXGknt2JzKZSE14sZdPgeTa5comz-OAVI5qc8itbBTASamXQXygcK4-dyfGIzSOYtZc0ThaBufY1Mo5j0mYRyXxarBU0ZaFxg5evBiZG7FlA',
                }}
                accessibilityLabel="Swami Vidyadhishananda profile picture"
              />
              <View className="flex-col">
                <Text className="font-sans font-bold text-sm text-primary-text">Swami Vidyadhishananda</Text>
                <Caption className="text-secondary-text">Lead Instructor</Caption>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2 mt-4" accessibilityLabel="Course details summary">
              <View className="px-3 py-1 rounded-full border border-surface-border bg-surface">
                <Caption className="text-primary-text font-bold">
                  {routine.is_premium ? 'Premium' : 'Free Tier'}
                </Caption>
              </View>
              <View className="px-3 py-1 rounded-full border border-surface-border bg-surface flex-row items-center gap-1">
                <Clock size={12} color={colors.secondaryText} />
                <Caption className="text-secondary-text">
                  {routine.duration_minutes} min
                </Caption>
              </View>
              <View className="px-3 py-1 rounded-full border border-surface-border bg-surface flex-row items-center gap-1">
                <BookOpen size={12} color={colors.secondaryText} />
                <Caption className="text-secondary-text">
                  {sessions.length} Sessions
                </Caption>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="my-6">
            <Body className="text-primary-text leading-relaxed font-sans text-[15px]">
              {routine.description || 'Embark on a sacred journey of physical alignment, conscious breath control, and inner stillness designed to harmonize the mind and body.'}
            </Body>
          </View>

          {/* Editorial Divider */}
          <View className="w-full h-[1px] bg-surface-border/60 my-6" />

          {/* Syllabus Section */}
          <View className="pb-8">
            <Micro className="text-secondary-text tracking-[0.1em] uppercase mb-4">Course Sessions</Micro>
            
            <View className="gap-3">
              {sessions.map((session, index) => {
                const formattedNum = (index + 1).toString().padStart(2, '0');
                const isLocked = session.isLocked;
                
                return (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 60)}
                  >
                    <PressableAnimated
                      haptic={isLocked ? 'warning' : 'medium'}
                      className={`flex-row items-center gap-4 py-4 px-4 rounded-xl border border-transparent active:scale-[0.99] transition-transform ${
                        session.isCompleted
                          ? 'bg-surface/40'
                          : isLocked
                          ? 'opacity-60 bg-surface/30'
                          : 'bg-surface border-surface-border shadow-[0_2px_8px_rgba(42,29,10,0.02)]'
                      }`}
                      onPress={() => handlePlayLesson(index, isLocked)}
                      accessibilityLabel={`Session ${formattedNum}: ${session.title}, ${session.duration}. ${isLocked ? 'Locked Premium' : session.isCompleted ? 'Completed' : 'Play Session'}`}
                    >
                      <Text
                        className={`font-sans font-bold text-sm w-6 text-center ${
                          isLocked
                            ? 'text-secondary-text'
                            : session.isCompleted
                            ? 'text-growth-green'
                            : 'text-accent-terracotta'
                        }`}
                      >
                        {formattedNum}
                      </Text>

                      <View className="flex-1">
                        <Text
                          className={`font-sans text-[15px] ${
                            isLocked
                              ? 'text-secondary-text font-medium'
                              : 'text-primary-text font-bold'
                          }`}
                        >
                          {session.title}
                        </Text>
                        <Caption className="text-secondary-text mt-0.5">
                          {session.duration} • {session.type}
                        </Caption>
                      </View>

                      {session.isCompleted ? (
                        <CheckCircle size={18} color={colors.growth} />
                      ) : isLocked ? (
                        <Lock size={16} color={colors.secondaryText} />
                      ) : (
                        <PlayCircle size={18} color={colors.accent} />
                      )}
                    </PressableAnimated>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 w-full bg-surface/95 border-t border-surface-border px-6 py-4 z-50 flex items-center pb-8">
        <PressableAnimated
          haptic="medium"
          className="w-full max-w-sm h-12 bg-accent-terracotta rounded-full flex-row items-center justify-center gap-2 active:opacity-90 shadow"
          onPress={handleBeginCourse}
          accessibilityLabel="Begin practice course now"
        >
          <Text className="text-white font-sans font-bold text-sm">Begin Practice</Text>
          <PlayCircle size={16} color="#FFFFFF" />
        </PressableAnimated>
      </View>
    </View>
  );
}
