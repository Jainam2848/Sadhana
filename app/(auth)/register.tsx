import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Display, Subheading } from '@/components/ui/Typography';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
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

// ─── Floating Label Input ─────────────────────────────────────────────────────
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

  const isFloating = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    isFloating.value = withSpring(isFocused || value.length > 0 ? 1 : 0, {
      damping: 18,
      stiffness: 150,
    });
  }, [isFocused, value]);

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
      transform: [{ translateY }, { translateX }, { scale }],
      color: isFocused ? colors.accent : error ? '#E04343' : '#A69580',
    };
  });

  const focusBorderStyle = useAnimatedStyle(() => ({
    width: `${borderProgress.value * 100}%`,
    backgroundColor: error ? '#E04343' : colors.accent,
  }));

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text
        style={[styles.floatingLabel, labelStyle]}
        className="font-sans text-sm"
      >
        {label}
      </Animated.Text>

      <TextInput
        className="w-full text-primary-text font-sans text-base bg-transparent"
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel}
      />

      {/* Base border */}
      <View
        style={[
          styles.baseBorder,
          { backgroundColor: error ? 'rgba(224,67,67,0.35)' : 'rgba(166,149,128,0.25)' },
        ]}
      />

      {/* Animated focus border */}
      <View style={styles.focusBorderTrack}>
        <Animated.View style={[styles.focusBorderFill, focusBorderStyle]} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Breathing Dots Loader ────────────────────────────────────────────────────
function BreathingDots() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const seq = () =>
      withRepeat(
        withSequence(withTiming(1, { duration: 600 }), withTiming(0.3, { duration: 600 })),
        -1,
        true
      );
    dot1.value = seq();
    const t2 = setTimeout(() => { dot2.value = seq(); }, 200);
    const t3 = setTimeout(() => { dot3.value = seq(); }, 400);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const d1Style = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value }] }));
  const d2Style = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value }] }));
  const d3Style = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value }] }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, d1Style]} />
      <Animated.View style={[styles.dot, d2Style]} />
      <Animated.View style={[styles.dot, d3Style]} />
    </View>
  );
}

// ─── Button Content Cross-Fade ────────────────────────────────────────────────
function ButtonContent({ loading, isSignUp }: { loading: boolean; isSignUp: boolean }) {
  const opacity = useSharedValue(loading ? 0 : 1);
  const loadingOpacity = useSharedValue(loading ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(loading ? 0 : 1, { duration: 200 });
    loadingOpacity.value = withTiming(loading ? 1 : 0, { duration: 200 });
  }, [loading]);

  const textStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const loaderStyle = useAnimatedStyle(() => ({ opacity: loadingOpacity.value, position: 'absolute' }));

  return (
    <View style={styles.btnContent}>
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const { colors } = useTheme();
  const { tier } = useLocalSearchParams<{ tier: string }>();
  const setSession = useAuthStore((state) => state.setSession);
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [logoTapCount, setLogoTapCount] = useState(0);
  // Always show sandbox tools for quick developer logins
  const [showDeveloperTools, setShowDeveloperTools] = useState(true);

  // Segmented pill width — adapt to actual screen width with 48px horizontal padding
  const containerWidth = Math.min(320, width - 48);
  const pillPadding = 4;
  const pillWidth = containerWidth / 2 - pillPadding;

  const isSignUpShared = useSharedValue(isSignUp ? 0 : 1);
  useEffect(() => {
    isSignUpShared.value = withSpring(isSignUp ? 0 : 1, { damping: 18, stiffness: 150 });
  }, [isSignUp]);

  const usernameHeight = useSharedValue(isSignUp ? 1 : 0);
  useEffect(() => {
    usernameHeight.value = withSpring(isSignUp ? 1 : 0, { damping: 20, stiffness: 150 });
  }, [isSignUp]);

  const usernameAnimatedStyle = useAnimatedStyle(() => ({
    height: usernameHeight.value * 76,
    opacity: usernameHeight.value,
    transform: [{ translateY: (1 - usernameHeight.value) * -15 }],
    overflow: 'hidden',
  }));

  const segmentedPillStyle = useAnimatedStyle(() => ({
    width: pillWidth,
    transform: [{ translateX: isSignUpShared.value * (containerWidth / 2 - pillPadding * 0.5) }],
  }));

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');
  };

  const handleLogoTap = () => {
    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        // 5-tap toggles sandbox panel visibility
        setShowDeveloperTools((v) => !v);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return 0;
      }
      return next;
    });
  };

  const handleAuthAction = async () => {
    clearErrors();
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
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { username: username.trim() } },
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
          if (profileUpdateError) console.warn('Failed to update premium status', profileUpdateError);
        }

        const { error: onboardingError } = await supabase.from('onboarding_responses').insert({
          user_id: userId,
          goals: onboardingAnswers.goal ? [onboardingAnswers.goal] : ['stress'],
          tightness:
            onboardingAnswers.goal === 'mobility'
              ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
              : ['lower_back', 'shoulders'],
          experience_level: onboardingAnswers.experience || 'beginner',
          preferred_time: onboardingAnswers.schedule || 'morning',
          preferred_duration: onboardingAnswers.duration || 15,
          habit_anchor: onboardingAnswers.schedule
            ? `After my ${onboardingAnswers.schedule} routine`
            : 'After my morning tea',
        });
        if (onboardingError) console.warn('Failed to insert onboarding responses', onboardingError);

        const mockUser = {
          id: userId,
          email: email.trim(),
          name: username.trim(),
          premium: isPremiumRequested,
          onboardingCompleted: true,
        };
        await setSession(mockUser, signUpData.session?.access_token || 'temp-token');
      } else {
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
        if (profileError) console.warn('Failed to fetch user profile', profileError);

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
    if (!isSignUp) return 'Welcome Back';
    return 'Seal the Covenant';
  };

  const getHeaderSubheading = () => {
    if (!isSignUp) return 'Sign in to continue your practice.';
    return 'Create your secure practice vault to preserve your daily streaks, custom routine durations, and practice history across devices.';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <MandalaThread />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: Math.max(insets.top, 32),
          paddingBottom: 32,
        }}
      >
        {/* ── Brand Mark ── */}
        <PressableAnimated onPress={handleLogoTap} haptic="light" style={styles.brandRow}>
          <Text style={styles.brandAccent}>✦</Text>
          <Text style={styles.brandName}>Sadhana</Text>
          <Text style={styles.brandAccent}>✦</Text>
        </PressableAnimated>

        {/* ── Hero Title ── */}
        <View style={styles.heroBlock}>
          <Display className="text-center">{getHeaderTitle()}</Display>
          <Subheading
            className={`text-secondary-text text-center font-serif mt-2 ${
              isSmallDevice ? 'mb-3' : 'mb-4'
            }`}
            style={{ fontSize: 15, lineHeight: 22 }}
          >
            {getHeaderSubheading()}
          </Subheading>
          {/* Social proof trust line */}
          {isSignUp && (
            <View style={styles.trustRow}>
              <View style={styles.trustDot} />
              <Text style={styles.trustText}>4,200+ practitioners joined this week</Text>
              <View style={styles.trustDot} />
            </View>
          )}
        </View>

        {/* ── Segmented Create / Sign In ── */}
        <View style={[styles.segmentedContainer, { width: containerWidth }]}>
          <Animated.View
            style={[styles.segmentedPill, segmentedPillStyle]}
            className="bg-surface"
          />
          <PressableAnimated
            style={styles.segmentedTab}
            onPress={() => {
              setIsSignUp(true);
              clearErrors();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              className={`font-sans font-semibold text-xs ${
                isSignUp ? 'text-primary-text' : 'text-secondary-text'
              }`}
            >
              Create Account
            </Text>
          </PressableAnimated>
          <PressableAnimated
            style={styles.segmentedTab}
            onPress={() => {
              setIsSignUp(false);
              clearErrors();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              className={`font-sans font-semibold text-xs ${
                !isSignUp ? 'text-primary-text' : 'text-secondary-text'
              }`}
            >
              Sign In
            </Text>
          </PressableAnimated>
        </View>

        {/* ── Form Card ── */}
        <View className="mb-6 gap-2">
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

        {/* ── Sandbox Quick Logins ── */}
        {showDeveloperTools && (
          <View style={styles.devBlock}>
            <View style={styles.devDividerRow}>
              <View style={styles.devDivider} />
              <Text style={styles.devLabel}>DEV SANDBOX</Text>
              <View style={styles.devDivider} />
            </View>
            <View style={styles.devBtnRow}>
              <PressableAnimated
                style={styles.devBtn}
                onPress={async () => {
                  await setSession(
                    { id: 'demo-free-user-id', email: 'asha.devi@sandbox.com', name: 'Asha Devi', premium: false, onboardingCompleted: true },
                    'demo-free-token'
                  );
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                haptic="medium"
                accessibilityLabel="Quick Login as Demo Free User"
              >
                <Text style={styles.devBtnTextFree}>⚡ Free User</Text>
              </PressableAnimated>

              <PressableAnimated
                style={[styles.devBtn, styles.devBtnPremium]}
                onPress={async () => {
                  await setSession(
                    { id: 'demo-premium-user-id', email: 'devendra.nath@sandbox.com', name: 'Devendra Nath', premium: true, onboardingCompleted: true },
                    'demo-premium-token'
                  );
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                haptic="medium"
                accessibilityLabel="Quick Login as Demo Premium User"
              >
                <Text style={styles.devBtnTextPremium}>✦ Premium User</Text>
              </PressableAnimated>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Sticky Footer Submit ── */}
      <View
        style={[
          styles.stickyFooter,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.background,
            borderTopColor: 'rgba(166,149,128,0.08)',
          },
        ]}
      >
        {generalError ? (
          <Text style={styles.generalError}>{generalError}</Text>
        ) : null}

        <PressableAnimated
          style={styles.submitBtn}
          disabled={loading}
          onPress={handleAuthAction}
          haptic="medium"
          accessibilityLabel={isSignUp ? 'Submit and create account' : 'Submit and sign in'}
        >
          <ButtonContent loading={loading} isSignUp={isSignUp} />
        </PressableAnimated>

        {isSignUp && (
          <Text style={styles.legalNote}>
            By continuing you agree to our Terms & Privacy Policy.
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Brand mark row
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  brandAccent: {
    fontSize: 10,
    color: '#C44B22',
    opacity: 0.6,
  },
  brandName: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 13,
    letterSpacing: 3,
    color: '#C44B22',
    textTransform: 'uppercase',
  },
  // Hero block
  heroBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C44B22',
    opacity: 0.5,
  },
  trustText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: '#A69580',
    letterSpacing: 0.2,
  },
  // Segmented control
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(166,149,128,0.1)',
    padding: 4,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  segmentedPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    zIndex: 10,
  },
  // Form card
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  // Floating label input
  inputWrapper: {
    marginBottom: 24,
    position: 'relative',
    width: '100%',
    paddingTop: 16,
  },
  floatingLabel: {
    position: 'absolute',
    left: 4,
    top: 0,
    fontSize: 14,
    pointerEvents: 'none' as any,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  baseBorder: {
    height: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  focusBorderTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusBorderFill: { height: '100%' },
  errorContainer: {
    position: 'absolute',
    bottom: -18,
    left: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#E04343',
    fontFamily: 'DMSans-Medium',
  },
  // Sandbox dev block
  devBlock: {
    marginTop: 4,
    marginBottom: 8,
  },
  devDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  devDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(166,149,128,0.2)',
  },
  devLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 9,
    color: 'rgba(166,149,128,0.6)',
    letterSpacing: 1.5,
  },
  devBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  devBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(166,149,128,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(166,149,128,0.2)',
  },
  devBtnPremium: {
    backgroundColor: 'rgba(196,75,34,0.07)',
    borderColor: 'rgba(196,75,34,0.25)',
  },
  devBtnTextFree: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    color: '#A69580',
  },
  devBtnTextPremium: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    color: '#C44B22',
  },
  // Breathing dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  btnContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    position: 'relative',
  },
  // Sticky footer
  stickyFooter: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  submitBtn: {
    width: '100%',
    paddingVertical: 16,
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: '#C44B22',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  generalError: {
    fontSize: 12,
    color: '#E04343',
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: 'DMSans-Medium',
    lineHeight: 18,
  },
  legalNote: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: 'rgba(166,149,128,0.7)',
    textAlign: 'center',
    lineHeight: 14,
  },
});
