import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Display, Subheading } from '@/components/ui/Typography';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// 1. Floating Label Input Component
interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric';
  accessibilityLabel?: string;
  error?: string;
}

function FloatingLabelInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  accessibilityLabel,
  error,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  // Shared value for label placement (0 = inside/placeholder, 1 = floating above)
  const isFloating = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    isFloating.value = withSpring(isFocused || value.length > 0 ? 1 : 0, {
      damping: 18,
      stiffness: 150,
    });
  }, [isFocused, value]);

  // Shared value for drawing the focused border from center outward
  const borderProgress = useSharedValue(0);
  useEffect(() => {
    borderProgress.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [isFocused]);

  const labelStyle = useAnimatedStyle(() => {
    const scale = 1 - isFloating.value * 0.22;
    const translateY = 12 - isFloating.value * 26;
    const translateX = -isFloating.value * 12;

    return {
      transform: [
        { translateY },
        { translateX },
        { scale },
      ],
      color: isFocused
        ? colors.accent
        : error
        ? '#E04343'
        : '#A69580',
    };
  });

  const focusBorderStyle = useAnimatedStyle(() => {
    return {
      width: `${borderProgress.value * 100}%`,
      backgroundColor: error ? '#E04343' : colors.accent,
    };
  });

  return (
    <View className="mb-6 relative w-full pt-4">
      {/* Floating Label */}
      <Animated.Text
        style={[{ position: 'absolute', left: 4 }, labelStyle]}
        className="font-sans text-sm pointer-events-none"
      >
        {label}
      </Animated.Text>

      {/* TextInput */}
      <TextInput
        className="w-full text-primary-text font-sans text-base py-2.5 px-1 bg-transparent"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel}
      />

      {/* Base border line */}
      <View className={`h-[1px] w-full absolute bottom-0 left-0 ${error ? 'bg-[#E04343]/50' : 'bg-surface-border/40'}`} />

      {/* Active focus border line (drawn from center outward) */}
      <View className="absolute bottom-0 left-0 right-0 h-[1.5px] items-center justify-center">
        <Animated.View style={[{ height: '100%' }, focusBorderStyle]} />
      </View>

      {/* Animated error slide-down */}
      {error ? (
        <View className="absolute -bottom-4.5 left-1">
          <Text className="text-[11px] text-[#E04343] font-sans font-medium">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// 2. Custom Branded Loading Dots
function BreathingDots() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      -1,
      true
    );

    const t2 = setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      );
    }, 200);

    const t3 = setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      );
    }, 400);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const d1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));
  const d2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));
  const d3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  return (
    <View className="flex-row items-center justify-center gap-2 h-6">
      <Animated.View style={d1Style} className="w-2.5 h-2.5 rounded-full bg-white" />
      <Animated.View style={d2Style} className="w-2.5 h-2.5 rounded-full bg-white" />
      <Animated.View style={d3Style} className="w-2.5 h-2.5 rounded-full bg-white" />
    </View>
  );
}

// 3. Branded Button Content Cross-Fade
function ButtonContent({ loading, isSignUp }: { loading: boolean; isSignUp: boolean }) {
  const opacity = useSharedValue(loading ? 0 : 1);
  const loadingOpacity = useSharedValue(loading ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(loading ? 0 : 1, { duration: 200 });
    loadingOpacity.value = withTiming(loading ? 1 : 0, { duration: 200 });
  }, [loading]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
    position: 'absolute',
  }));

  return (
    <View className="w-full items-center justify-center h-6 relative">
      <Animated.View style={textStyle}>
        <Text className="text-white font-sans font-bold text-base">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Text>
      </Animated.View>
      {loading ? (
        <Animated.View style={loaderStyle}>
          <BreathingDots />
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { tier } = useLocalSearchParams<{ tier: string }>();
  const setSession = useAuthStore((state) => state.setSession);
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation / Inline Errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Hidden DevTools Sandbox Menu
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [showDeveloperTools, setShowDeveloperTools] = useState(true);

  // Segmented Pill Spring Transition
  const isSignUpShared = useSharedValue(isSignUp ? 0 : 1);
  useEffect(() => {
    isSignUpShared.value = withSpring(isSignUp ? 0 : 1, { damping: 18, stiffness: 150 });
  }, [isSignUp]);

  // Username Input Expand/Collapse spring transition
  const usernameHeight = useSharedValue(isSignUp ? 1 : 0);
  useEffect(() => {
    usernameHeight.value = withSpring(isSignUp ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
  }, [isSignUp]);

  const usernameAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: usernameHeight.value * 76,
      opacity: usernameHeight.value,
      transform: [
        {
          translateY: (1 - usernameHeight.value) * -15,
        },
      ],
      overflow: 'hidden',
    };
  });

  const handleLogoTap = () => {
    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowDeveloperTools(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Developer Mode', 'Developer tools are now visible at the bottom of the screen.');
        return 0;
      }
      return next;
    });
  };

  const handleAuthAction = async () => {
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');

    let hasError = false;

    if (isSignUp && !username.trim()) {
      setUsernameError('Please enter a username');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Please enter a password');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up via GoTrue
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

        if (isPremiumRequested) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ premium: true })
            .eq('id', userId);
          
          if (profileUpdateError) {
            console.warn('Failed to update premium profile status', profileUpdateError);
          }
        }

        const { error: onboardingError } = await supabase
          .from('onboarding_responses')
          .insert({
            user_id: userId,
            goals: onboardingAnswers.goal ? [onboardingAnswers.goal] : ['stress'],
            tightness: onboardingAnswers.goal === 'mobility' 
              ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
              : ['lower_back', 'shoulders'],
            experience_level: onboardingAnswers.experience || 'beginner',
            preferred_time: onboardingAnswers.schedule || 'morning',
            preferred_duration: onboardingAnswers.duration || 15,
            habit_anchor: onboardingAnswers.schedule 
              ? `After my ${onboardingAnswers.schedule} routine` 
              : 'After my morning tea'
          });

        if (onboardingError) {
          console.warn('Failed to insert onboarding responses', onboardingError);
        }

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
      setGeneralError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (!isSignUp) {
      return 'Welcome Back';
    }
    if (tier === 'premium') {
      return 'Claim Your 7-Day Trial';
    }
    return 'Begin Your Journey';
  };

  const getHeaderSubheading = () => {
    if (!isSignUp) {
      return 'Sign in to continue your practice.';
    }
    if (tier === 'premium') {
      return 'Step into your premium sanctuary. No payment required today.';
    }
    return 'Create your daily sanctuary account to begin.';
  };

  const containerWidth = 280;
  const pillPadding = 4;
  const pillWidth = containerWidth / 2 - pillPadding;

  const segmentedPillStyle = useAnimatedStyle(() => {
    return {
      width: pillWidth,
      transform: [
        {
          translateX: isSignUpShared.value * (containerWidth / 2 - pillPadding * 0.5),
        },
      ],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <MandalaThread />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: 24,
        }}
      >
        <View className="w-full max-w-md mx-auto">
          {/* Header Area */}
          <PressableAnimated onPress={handleLogoTap} haptic="light">
            <Display className="text-center mb-2">{getHeaderTitle()}</Display>
          </PressableAnimated>
          <Subheading className={`text-secondary-text text-center font-serif ${isSmallDevice ? 'mb-4' : 'mb-6'}`}>
            {getHeaderSubheading()}
          </Subheading>

          {/* 1. Segmented Control */}
          <View 
            style={{ width: containerWidth }}
            className="flex-row bg-surface-border/10 p-1 rounded-full mx-auto mb-8 relative"
          >
            <Animated.View
              style={[segmentedPillStyle]}
              className="absolute top-1 bottom-1 left-1 bg-surface rounded-full shadow-sm"
            />
            <PressableAnimated
              className="flex-1 py-2 items-center z-10"
              onPress={() => {
                setIsSignUp(true);
                setEmailError('');
                setPasswordError('');
                setUsernameError('');
                setGeneralError('');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text className={`font-sans font-semibold text-xs transition-colors duration-150 ${isSignUp ? 'text-primary-text' : 'text-secondary-text'}`}>
                Create
              </Text>
            </PressableAnimated>
            <PressableAnimated
              className="flex-1 py-2 items-center z-10"
              onPress={() => {
                setIsSignUp(false);
                setEmailError('');
                setPasswordError('');
                setUsernameError('');
                setGeneralError('');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text className={`font-sans font-semibold text-xs transition-colors duration-150 ${!isSignUp ? 'text-primary-text' : 'text-secondary-text'}`}>
                Sign In
              </Text>
            </PressableAnimated>
          </View>

          {/* Form Input Fields */}
          <View className={`mb-6`}>
            <Animated.View style={usernameAnimatedStyle}>
              <FloatingLabelInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                accessibilityLabel="Enter username field"
                error={usernameError}
              />
            </Animated.View>

            <FloatingLabelInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              accessibilityLabel="Enter email address field"
              error={emailError}
            />

            <FloatingLabelInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Enter password field"
              error={passwordError}
            />
          </View>

          {/* Collapsible Sandbox Debug Tools */}
          {showDeveloperTools ? (
            <View className={`border-t border-surface-border/25 gap-3 mt-6 pt-6`}>
              <Text className="text-center font-sans font-semibold text-[10px] text-secondary-text uppercase tracking-widest">
                Sandbox Testing Tools (Developer Mode)
              </Text>
              <View className="flex-row gap-2.5 justify-center">
                <PressableAnimated
                  className="flex-1 bg-surface border border-surface-border/40 py-2.5 rounded-xl items-center"
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
                  className="flex-1 bg-warm-highlight border border-accent-terracotta/30 py-2.5 rounded-xl items-center"
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
          ) : null}
        </View>
      </ScrollView>

      {/* 3. Keyboard-Aware Sticky Footer */}
      <View 
        className="w-full px-6 bg-background/95 border-t border-surface-border/5 pt-4"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <View className="w-full max-w-md mx-auto">
          {/* General Error Messaging */}
          {generalError ? (
            <Text className="text-xs text-[#E04343] font-sans text-center mb-3.5 font-medium leading-normal">
              {generalError}
            </Text>
          ) : null}

          {/* Submit Button */}
          <PressableAnimated
            className="w-full bg-accent-terracotta py-4 rounded-xl items-center mb-2 active:opacity-95 flex-row justify-center"
            disabled={loading}
            onPress={handleAuthAction}
            haptic="medium"
            accessibilityLabel={isSignUp ? "Submit and create account" : "Submit and sign in"}
          >
            <ButtonContent loading={loading} isSignUp={isSignUp} />
          </PressableAnimated>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
