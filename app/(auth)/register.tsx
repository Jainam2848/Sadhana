import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Display, Subheading } from '@/components/ui/Typography';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Alert } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { tier } = useLocalSearchParams<{ tier: string }>();
  const setSession = useAuthStore((state) => state.setSession);
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please fill in both email and password.');
      return;
    }

    if (isSignUp && !username) {
      Alert.alert('Required Field', 'Please enter a username.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // 1. Sign Up via GoTrue
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('User creation failed.');

        const userId = signUpData.user.id;
        const isPremiumRequested = tier === 'premium';

        // 2. If Premium was selected on the paywall, update the database profile row
        if (isPremiumRequested) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ premium: true })
            .eq('id', userId);
          
          if (profileUpdateError) {
            console.warn('Failed to update premium profile status', profileUpdateError);
          }
        }

        // 3. Write onboarding responses to trigger personalization plan generation
        const { error: onboardingError } = await supabase
          .from('onboarding_responses')
          .insert({
            user_id: userId,
            goals: onboardingAnswers.goal ? [onboardingAnswers.goal] : ['stress'],
            tightness: onboardingAnswers.goal === 'mobility' 
              ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
              : ['lower_back', 'shoulders'],
            experience_level: onboardingAnswers.experience || 'beginner',
            habit_anchor: onboardingAnswers.schedule 
              ? `After my ${onboardingAnswers.schedule} routine` 
              : 'After my morning tea'
          });

        if (onboardingError) {
          console.warn('Failed to insert onboarding responses', onboardingError);
        }

        // 3. Save session in Zustand and SecureStore
        const mockUser = {
          id: userId,
          email: email.trim(),
          name: username.trim(),
          premium: isPremiumRequested,
          onboardingCompleted: true,
        };
        await setSession(mockUser, signUpData.session?.access_token || 'temp-token');

      } else {
        // Sign In via GoTrue
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;
        if (!signInData.user) throw new Error('User sign in failed.');

        // Fetch user profile stats
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        if (profileError) {
          console.warn('Failed to fetch user profile, creating mock layout', profileError);
        }

        const loggedInUser = {
          id: signInData.user.id,
          email: signInData.user.email || email.trim(),
          name: profile?.username || signInData.user.user_metadata?.username || 'Sadhaka',
          premium: profile?.premium || false,
          onboardingCompleted: true,
        };
        await setSession(loggedInUser, signInData.session?.access_token || 'temp-token');
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Authentication Error', err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-6 relative">
      <MandalaThread />

      <View className="w-full max-w-md mx-auto">
        {/* Title Block */}
        <Display className="text-center mb-2">Sadhana</Display>
        <Subheading className="text-secondary-text text-center mb-8 font-serif">
          {isSignUp
            ? `Create your daily sanctuary account${tier === 'premium' ? ' (Premium Trial)' : ''}`
            : 'Welcome back to your sanctuary'}
        </Subheading>

        {/* Inputs */}
        <View className="gap-4 mb-8">
          {isSignUp && (
            <View>
              <Text className="text-secondary-text font-sans text-xs mb-2 uppercase tracking-widest">
                Username
              </Text>
              <TextInput
                className="w-full bg-surface border border-surface-border py-3 px-4 rounded-xl text-primary-text font-sans"
                placeholder="Sarah E."
                placeholderTextColor="#A69580"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                accessibilityLabel="Enter username field"
              />
            </View>
          )}

          <View>
            <Text className="text-secondary-text font-sans text-xs mb-2 uppercase tracking-widest">
              Email Address
            </Text>
            <TextInput
              className="w-full bg-surface border border-surface-border py-3 px-4 rounded-xl text-primary-text font-sans"
              placeholder="you@domain.com"
              placeholderTextColor="#A69580"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Enter email address field"
            />
          </View>

          <View>
            <Text className="text-secondary-text font-sans text-xs mb-2 uppercase tracking-widest">
              Password
            </Text>
            <TextInput
              className="w-full bg-surface border border-surface-border py-3 px-4 rounded-xl text-primary-text font-sans"
              placeholder="••••••••"
              placeholderTextColor="#A69580"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              accessibilityLabel="Enter password field"
            />
          </View>
        </View>

        {/* Submit Button */}
        <PressableAnimated
          className="w-full bg-accent-terracotta py-4 rounded-xl items-center mb-6 active:opacity-90 flex-row justify-center gap-2"
          disabled={loading}
          onPress={handleAuthAction}
          haptic="medium"
          accessibilityLabel={isSignUp ? "Submit and create account" : "Submit and sign in"}
        >
          {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
          <Text className="text-white font-sans font-bold text-base">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
        </PressableAnimated>

        {/* Toggle Account Action */}
        <PressableAnimated
          className="py-2 items-center active:opacity-80"
          onPress={() => setIsSignUp(!isSignUp)}
          haptic="light"
          accessibilityLabel={isSignUp ? "Switch to sign in screen" : "Switch to sign up screen"}
        >
          <Text className="text-secondary-text font-sans text-sm underline underline-offset-4 decoration-surface-border">
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Text>
        </PressableAnimated>

        {/* Sandbox Demo Quick Logins */}
        <View className="mt-8 pt-6 border-t border-surface-border/60 gap-3">
          <Text className="text-center font-sans font-semibold text-xs text-secondary-text uppercase tracking-widest">
            Sandbox Testing
          </Text>
          <View className="flex-row gap-2.5 justify-center">
            <PressableAnimated
              className="flex-1 bg-surface border border-surface-border py-2.5 rounded-lg items-center"
              onPress={async () => {
                const demoUser = {
                  id: "demo-free-user-id",
                  email: "asha.devi@sandbox.com",
                  name: "Asha Devi",
                  premium: false,
                  onboardingCompleted: true,
                };
                await setSession(demoUser, "demo-free-token");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              haptic="medium"
              accessibilityLabel="Quick Login as Demo Free User"
            >
              <Text className="text-secondary-text font-sans font-bold text-xs">Demo Free</Text>
            </PressableAnimated>

            <PressableAnimated
              className="flex-1 bg-warm-highlight border border-accent-terracotta/30 py-2.5 rounded-lg items-center"
              onPress={async () => {
                const demoUser = {
                  id: "demo-premium-user-id",
                  email: "devendra.nath@sandbox.com",
                  name: "Devendra Nath",
                  premium: true,
                  onboardingCompleted: true,
                };
                await setSession(demoUser, "demo-premium-token");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              haptic="medium"
              accessibilityLabel="Quick Login as Demo Premium User"
            >
              <Text className="text-accent-terracotta font-sans font-bold text-xs">Demo Premium</Text>
            </PressableAnimated>
          </View>
        </View>
      </View>
    </View>
  );
}
