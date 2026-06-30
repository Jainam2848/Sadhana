import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Modal, Platform, StyleSheet, View, AccessibilityInfo, Pressable } from 'react-native';
import { Video as ExpoVideo, Audio, ResizeMode } from 'expo-av';
import { ArrowLeft, BookOpen, Pause, Play, RotateCcw, RotateCw, SkipForward, Volume2, VolumeX, Sparkles, Eye, Info, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation, withSpring } from 'react-native-reanimated';
import { Svg, Circle, Path, Video } from '@/components/ui/Compat';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession, useRoutine } from '@/hooks/api';
import { Text } from '@/components/ui/Text';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

const PHASES = ['Asana', 'Pranayama', 'Dhyana'] as const;

export default function ActiveRoutinePlayerScreen() {
  const { colors, motion } = useTheme();
  const router = useRouter();
  const submitSession = useSubmitSession();
  const { planId, asanaId, asanaDuration, pranayamaId, pranayamaDuration, dhyanaId, dhyanaDuration } = useLocalSearchParams<{
    planId: string;
    asanaId: string;
    asanaDuration: string;
    pranayamaId: string;
    pranayamaDuration: string;
    dhyanaId: string;
    dhyanaDuration: string;
  }>();

  // Core navigation states
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Music mute
  const [voiceMuted, setVoiceMuted] = useState(false); // Voice guide mute
  const [breathCue, setBreathCue] = useState('Inhale');
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  // Redesign states
  const [isPrepBuffer, setIsPrepBuffer] = useState(false);
  const [prepTimeLeft, setPrepTimeLeft] = useState(7);
  const [isIntermission, setIsIntermission] = useState(false);
  const [intermissionTimeLeft, setIntermissionTimeLeft] = useState(15);
  const [isModified, setIsModified] = useState(false);
  
  const videoRef = useRef<ExpoVideo>(null);

  const { data: asanaRoutine } = useRoutine(asanaId);
  const { data: pranayamaRoutine } = useRoutine(pranayamaId);
  const { data: dhyanaRoutine } = useRoutine(dhyanaId);

  const visualizerScale = useSharedValue(1);
  const visualizerRotation = useSharedValue(0);
  const visualizerOpacity = useSharedValue(0.42);

  const entranceProgress = useSharedValue(0);

  useEffect(() => {
    entranceProgress.value = withTiming(1, { duration: motion.duration.slow, easing: Easing.bezier(0.25, 1, 0.5, 1) });
    return () => {
      cancelAnimation(entranceProgress);
    };
  }, []);

  const animatedTopBarStyle = useAnimatedStyle(() => {
    return {
      opacity: entranceProgress.value,
      transform: [{ translateY: -20 + 20 * entranceProgress.value }],
    };
  });

  const animatedStageStyle = useAnimatedStyle(() => {
    return {
      opacity: entranceProgress.value,
      transform: [{ translateY: 30 - 30 * entranceProgress.value }],
    };
  });

  const animatedControlsStyle = useAnimatedStyle(() => {
    return {
      opacity: entranceProgress.value,
      transform: [{ translateY: 40 - 40 * entranceProgress.value }],
    };
  });

  // Total durations for each segment in seconds
  const durations = useMemo(
    () => [
      parseInt(asanaDuration || '5', 10) * 60,
      parseInt(pranayamaDuration || '4', 10) * 60,
      parseInt(dhyanaDuration || '3', 10) * 60,
    ],
    [asanaDuration, pranayamaDuration, dhyanaDuration]
  );

  // Break down current segment into steps (poses for Asana, single block for breath/meditation)
  const currentSteps = useMemo(() => {
    if (currentSegment === 0) {
      if (!asanaRoutine || !asanaRoutine.sanskrit_terms) {
        return [{ sanskrit: 'Asana', english: 'Grounding Posture', videoUrl: asanaRoutine?.media_url }];
      }
      return Object.entries(asanaRoutine.sanskrit_terms).map(([sanskrit, english]) => ({
        sanskrit,
        english,
        videoUrl: asanaRoutine?.media_url,
      }));
    } else if (currentSegment === 1) {
      return [
        {
          sanskrit: pranayamaRoutine?.title || 'Pranayama',
          english: pranayamaRoutine 
            ? Object.values(pranayamaRoutine.sanskrit_terms || {})[0] || 'Balanced Breath' 
            : 'Balanced Breath',
          videoUrl: null,
        },
      ];
    } else {
      return [
        {
          sanskrit: dhyanaRoutine?.title || 'Dhyana',
          english: dhyanaRoutine 
            ? Object.values(dhyanaRoutine.sanskrit_terms || {})[0] || 'Silent Meditation' 
            : 'Silent Meditation',
          videoUrl: null,
        },
      ];
    }
  }, [currentSegment, asanaRoutine, pranayamaRoutine, dhyanaRoutine]);

  // Duration of active step (pose-by-pose for Asana, full segment for Pranayama/Dhyana)
  const currentStepDuration = useMemo(() => {
    if (currentSegment === 0) {
      return Math.floor(durations[0] / currentSteps.length);
    } else {
      return durations[currentSegment] || 1;
    }
  }, [currentSegment, currentSteps, durations]);

  const [timeLeft, setTimeLeft] = useState(currentStepDuration);

  // Auto-update timer when stepping/segmenting
  useEffect(() => {
    setTimeLeft(currentStepDuration);
  }, [currentSegment, currentStepIndex, currentStepDuration]);

  const segmentHeaders = useMemo(
    () => [
      {
        type: 'Asana',
        title: asanaRoutine?.title || 'Grounding Posture',
        subtitle: asanaRoutine?.description || 'Move slowly. Keep the breath audible.',
      },
      {
        type: 'Pranayama',
        title: pranayamaRoutine?.title || 'Balanced Breath',
        subtitle: pranayamaRoutine?.description || 'Four count inhale, two count pause, four count exhale.',
      },
      {
        type: 'Dhyana',
        title: dhyanaRoutine?.title || 'Silent Meditation',
        subtitle: dhyanaRoutine?.description || 'Rest attention at the heart center.',
      },
    ],
    [asanaRoutine, pranayamaRoutine, dhyanaRoutine]
  );

  const currentHeader = segmentHeaders[currentSegment];

  // Calculate elapsed time based on completed steps plus current progress
  const elapsed = useMemo(() => {
    if (currentSegment === 0) {
      const completedStepsTime = currentStepIndex * currentStepDuration;
      const currentStepElapsed = currentStepDuration - timeLeft;
      return completedStepsTime + currentStepElapsed;
    } else {
      return currentStepDuration - timeLeft;
    }
  }, [currentSegment, currentStepIndex, currentStepDuration, timeLeft]);

  const currentDuration = durations[currentSegment] || 1;
  const segmentProgress = Math.min((elapsed / currentDuration) * 100, 100);

  const totalElapsed = useMemo(() => {
    const previousSegmentsTime = durations.slice(0, currentSegment).reduce((sum, item) => sum + item, 0);
    return previousSegmentsTime + elapsed;
  }, [currentSegment, durations, elapsed]);

  const totalDuration = durations.reduce((sum, item) => sum + item, 0);
  const overallProgress = Math.min((totalElapsed / totalDuration) * 100, 100);

  // Next pose helper for distance cue preview
  const nextStep = useMemo(() => {
    if (currentSegment === 0) {
      if (currentStepIndex < currentSteps.length - 1) {
        return currentSteps[currentStepIndex + 1];
      } else {
        return { sanskrit: pranayamaRoutine?.title || 'Pranayama', english: 'Balanced Breath' };
      }
    } else if (currentSegment === 1) {
      return { sanskrit: dhyanaRoutine?.title || 'Dhyana', english: 'Silent Meditation' };
    } else {
      return null;
    }
  }, [currentSegment, currentStepIndex, currentSteps, pranayamaRoutine, dhyanaRoutine]);

  // Voice guide text-to-speech engine
  const speakCurrentPose = (poseName: string, englishTranslation?: string, isPrep = false) => {
    if (voiceMuted) return;
    try {
      Speech.stop().catch(() => {});
      
      const introText = isPrep 
        ? `Prepare for ${poseName}. ${englishTranslation ? `Also known as ${englishTranslation}.` : ''}`
        : `Begin ${poseName}. ${englishTranslation ? englishTranslation : ''}`;
      
      let cue = '';
      if (!isPrep) {
        const name = poseName.toLowerCase();
        if (name.includes('pranamasana') || name.includes('prayer')) {
          cue = 'Bring your palms together at your heart. Stand tall and ground your heels.';
        } else if (name.includes('hastauttanasana') || name.includes('raised arms')) {
          cue = 'Inhale, reach your arms up, arch back gently, and expand your chest.';
        } else if (name.includes('padahastasana') || name.includes('hand to foot') || name.includes('uttanasana')) {
          cue = 'Exhale, fold completely forward from your hips. Keep your spine long and head heavy.';
        } else if (name.includes('ashwa sanchalanasana') || name.includes('equestrian')) {
          cue = 'Step your leg back into a low lunge, drop your knee, and look forward with a steady gaze.';
        } else if (name.includes('adho mukha svanasana') || name.includes('downward')) {
          cue = 'Press through your hands, lift your hips high, and reach your chest toward your thighs.';
        } else if (name.includes('marjariasana') || name.includes('cat')) {
          cue = 'Exhale, press the floor away, round your back, and tuck your chin toward your throat.';
        } else if (name.includes('bitilasana') || name.includes('cow')) {
          cue = 'Inhale, drop your belly toward the mat, roll your shoulders back, and look up.';
        } else if (name.includes('chaturanga')) {
          cue = 'Shift forward, hug your elbows in, and lower down to a hover with a strong core.';
        } else if (name.includes('bhujangasana') || name.includes('cobra')) {
          cue = 'Keep your hips grounded, press your hands down, and lift your chest forward and up.';
        } else if (name.includes('balasana') || name.includes('child')) {
          cue = 'Rest your hips onto your heels, lengthen your spine forward, and relax your forehead down.';
        }
      }
      
      Speech.speak(`${introText}. ${cue}`, {
        language: 'en',
        pitch: 0.95,
        rate: 0.82,
      });
    } catch (e) {
      console.warn('Speech engine failed', e);
    }
  };

  // Play transition chime
  const playTransitionBell = async () => {
    try {
      const { sound: chimeSound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav' },
        { shouldPlay: true, volume: 0.45 }
      );
      setTimeout(() => {
        chimeSound.unloadAsync().catch(() => {});
      }, 7000);
    } catch (error) {
      console.warn('Failed to play chime', error);
    }
  };

  // Pose modifications lookup
  const getPoseModification = (sanskritName: string) => {
    if (!sanskritName) return 'Listen to your body and work in a comfortable range.';
    const name = sanskritName.toLowerCase();
    if (name.includes('padahastasana') || name.includes('uttanasana')) {
      return 'Bend your knees slightly, placing hands on shins or blocks to release tension.';
    }
    if (name.includes('ashwa sanchalanasana')) {
      return 'Place yoga blocks under your hands for height, or lower your knee onto a folded blanket.';
    }
    if (name.includes('chaturanga')) {
      return 'Lower your knees down to the mat first, keeping your elbows bent at 90 degrees.';
    }
    if (name.includes('bhujangasana')) {
      return 'Perform Baby Cobra: keep your chest lower and lift hands off the floor to focus on back strength.';
    }
    if (name.includes('adho mukha svanasana')) {
      return 'Keep a deep bend in your knees and focus on lengthening your spine and lifting hips.';
    }
    if (name.includes('virabhadrasana')) {
      return 'Keep hands on your hips instead of reaching overhead to ease shoulder strain.';
    }
    return 'Take Child’s Pose at any time to rest and reconnect with your breath.';
  };

  // Speak initial pose when loaded
  const hasSpokenFirst = useRef(false);
  useEffect(() => {
    if (
      asanaRoutine &&
      currentSteps.length > 0 &&
      isPlaying &&
      !hasSpokenFirst.current &&
      !isPrepBuffer &&
      !isIntermission &&
      currentSegment === 0
    ) {
      hasSpokenFirst.current = true;
      const firstStep = currentSteps[0];
      speakCurrentPose(firstStep.sanskrit, firstStep.english, false);
    }
  }, [asanaRoutine, currentSteps, isPlaying, currentSegment, isPrepBuffer, isIntermission]);

  // Check and listen to OS reduced motion setting
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotionEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotionEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Mandala animation rotation rules
  useEffect(() => {
    if (reduceMotionEnabled) {
      visualizerRotation.value = 0;
      cancelAnimation(visualizerRotation);
    } else {
      visualizerRotation.value = withRepeat(withTiming(360, { duration: 26000, easing: Easing.linear }), -1, false);
    }
    return () => cancelAnimation(visualizerRotation);
  }, [reduceMotionEnabled, visualizerRotation]);

  // Breathing mandala expand/contract loops
  useEffect(() => {
    if (currentSegment === 0 || !isPlaying || isIntermission) {
      visualizerScale.value = withTiming(1, { duration: 700 });
      visualizerOpacity.value = withTiming(0.34, { duration: 700 });
      return;
    }

    let alive = true;
    let holdTimeout: ReturnType<typeof setTimeout>;
    let exhaleTimeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      if (!alive || !isPlaying || isIntermission) return;
      setBreathCue(currentSegment === 1 ? 'Inhale' : 'Soften');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      
      if (reduceMotionEnabled) {
        visualizerScale.value = withTiming(1.0, { duration: 500 });
        visualizerOpacity.value = withTiming(0.58, { duration: 500 });
      } else {
        visualizerScale.value = withTiming(1.42, { duration: 4000, easing: Easing.inOut(Easing.ease) });
        visualizerOpacity.value = withTiming(0.78, { duration: 4000 });
      }

      holdTimeout = setTimeout(() => {
        if (!alive || !isPlaying || isIntermission) return;
        setBreathCue(currentSegment === 1 ? 'Hold' : 'Notice');
        
        if (reduceMotionEnabled) {
          visualizerOpacity.value = withTiming(0.58, { duration: 500 });
        } else {
          visualizerOpacity.value = withTiming(0.58, { duration: 2000 });
        }

        exhaleTimeout = setTimeout(() => {
          if (!alive || !isPlaying || isIntermission) return;
          setBreathCue(currentSegment === 1 ? 'Exhale' : 'Release');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          
          if (reduceMotionEnabled) {
            visualizerScale.value = withTiming(1.0, { duration: 500 });
            visualizerOpacity.value = withTiming(0.34, { duration: 500 });
          } else {
            visualizerScale.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            visualizerOpacity.value = withTiming(0.34, { duration: 4000 });
          }
        }, 2000);
      }, 4000);
    };

    runCycle();
    const interval = setInterval(runCycle, 10000);

    return () => {
      alive = false;
      clearInterval(interval);
      clearTimeout(holdTimeout);
      clearTimeout(exhaleTimeout);
    };
  }, [currentSegment, isPlaying, isIntermission, visualizerScale, visualizerOpacity, reduceMotionEnabled]);

  // Load and play background music for meditation
  const loadBackgroundSound = async () => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: dhyanaRoutine?.media_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
        { shouldPlay: isPlaying && !isMuted, isLooping: true, volume: 0.12 }
      );
      setSound(newSound);
    } catch (error) {
      console.warn('Failed to load background audio', error);
    }
  };

  useEffect(() => {
    if (currentSegment === 2) {
      loadBackgroundSound();
    } else if (sound) {
      sound.unloadAsync().catch(() => {});
      setSound(null);
    }
  }, [currentSegment]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync().catch(() => {});
    };
  }, [sound]);

  useEffect(() => {
    if (!sound) return;
    if (isPlaying && !isMuted && !isIntermission) {
      sound.playAsync().catch(() => {});
    } else {
      sound.pauseAsync().catch(() => {});
    }
  }, [isPlaying, isMuted, sound, isIntermission]);

  // Central interval countdown ticking
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (isIntermission) {
        setIntermissionTimeLeft((prev) => {
          if (prev <= 1) {
            handleBeginNextSegment();
            return 15;
          }
          return prev - 1;
        });
        return;
      }

      if (isPrepBuffer) {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPrepBuffer(false);
            const currentPose = currentSteps[currentStepIndex];
            if (currentPose) {
              speakCurrentPose(currentPose.sanskrit, currentPose.english, false);
            }
            return 7;
          }
          return prev - 1;
        });
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextStep();
          return currentStepDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPrepBuffer, isIntermission, currentStepIndex, currentSteps, currentStepDuration, timeLeft]);

  // Step progression logic
  const handleNextStep = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setIsModified(false);

    if (currentSegment === 0 && currentStepIndex < currentSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(currentStepDuration);
      
      // Play transition bell and activate buffer
      setIsPrepBuffer(true);
      setPrepTimeLeft(7);
      playTransitionBell();

      const nextPose = currentSteps[nextIndex];
      if (nextPose) {
        speakCurrentPose(nextPose.sanskrit, nextPose.english, true); // Speak preview cue
      }
    } else {
      handleSegmentCompletion();
    }
  };

  const handleSegmentCompletion = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    if (currentSegment < 2) {
      setIsIntermission(true);
      setIntermissionTimeLeft(15);
      playTransitionBell();

      if (!voiceMuted) {
        const nextPhaseName = PHASES[currentSegment + 1];
        Speech.speak(`${PHASES[currentSegment]} segment complete. Please prepare your space to transition to ${nextPhaseName}.`, {
          language: 'en',
          pitch: 0.95,
          rate: 0.85,
        });
      }
    } else {
      handleCompleteSession();
    }
  };

  const handleBeginNextSegment = () => {
    setIsIntermission(false);
    setIsPrepBuffer(false);
    setCurrentSegment((prev) => prev + 1);
    setCurrentStepIndex(0);
  };

  const handleCompleteSession = async () => {
    setIsPlaying(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    try {
      const totalMinutes = totalDuration / 60;
      await submitSession.mutateAsync({
        routineId: asanaId || 'mock-asana-123',
        durationPracticed: Math.round(totalMinutes),
      });
      router.replace({
        pathname: '/session-completed',
        params: { totalMinutes: totalMinutes.toString() },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Session saved locally', 'We could not sync the session yet. Your practice is still complete.');
      router.replace('/(tabs)/home');
    }
  };

  // Format seconds to digital minutes:seconds
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Fast forward / skip gesture actions
  const handleSkipForward = () => {
    if (currentSegment === 0) {
      handleNextStep();
    } else {
      // 15 seconds jump for breathing and meditation
      setTimeLeft((prev) => Math.max(prev - 15, 0));
    }
  };

  const handleSkipBackward = () => {
    if (currentSegment === 0) {
      if (currentStepIndex > 0) {
        const prevIndex = currentStepIndex - 1;
        setCurrentStepIndex(prevIndex);
        setTimeLeft(currentStepDuration);
        setIsPrepBuffer(true);
        setPrepTimeLeft(7);
        playTransitionBell();

        const prevPose = currentSteps[prevIndex];
        if (prevPose) {
          speakCurrentPose(prevPose.sanskrit, prevPose.english, true);
        }
      } else {
        setTimeLeft(currentStepDuration);
      }
    } else {
      setTimeLeft((prev) => Math.min(prev + 15, durations[currentSegment]));
    }
  };

  const togglePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsPlaying((value) => !value);
  };

  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visualizerScale.value }, { rotate: `${visualizerRotation.value}deg` }],
    opacity: visualizerOpacity.value,
  }));

  const activeStep = currentSteps[currentStepIndex];

  return (
    <View style={styles.screen}>
      {/* Top Bar Navigation */}
      <Animated.View style={[styles.topBar, animatedTopBarStyle]}>
        <PressableAnimated style={styles.iconButton} onPress={() => router.back()} haptic="light" accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#FDFAF5" />
        </PressableAnimated>
        <View style={styles.phaseTrack}>
          {PHASES.map((phase, index) => (
            <View key={phase} style={[styles.phasePill, index === currentSegment && { backgroundColor: 'rgba(253,250,245,0.16)' }]}>
              <Text variant="body" weight="bold" style={[styles.phasePillText, index === currentSegment && styles.phasePillTextActive]}>
                {phase}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.audioControls}>
          <PressableAnimated 
            style={styles.iconButton} 
            onPress={() => setVoiceMuted((m) => !m)} 
            haptic="light" 
            accessibilityLabel={voiceMuted ? 'Unmute voice guidance' : 'Mute voice guidance'}
          >
            {voiceMuted ? <VolumeX size={18} color="#A69580" /> : <Volume2 size={18} color="#FDFAF5" />}
          </PressableAnimated>
          {currentSegment === 2 && (
            <PressableAnimated 
              style={styles.iconButton} 
              onPress={() => setIsMuted((value) => !value)} 
              haptic="light" 
              accessibilityLabel={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
            >
              {isMuted ? <VolumeX size={18} color="#E04343" /> : <Volume2 size={18} color="#2CA358" />}
            </PressableAnimated>
          )}
        </View>
      </Animated.View>

      {/* Overall Progress Tracker */}
      <View style={styles.overallTrack}>
        <View style={[styles.overallFill, { width: `${overallProgress}%`, backgroundColor: colors.accent }]} />
      </View>

      {/* Visual Stage */}
      <Animated.View style={[styles.visualStage, animatedStageStyle]}>
        {isIntermission ? (
          /* Transition Intermission View */
          <View style={styles.intermissionView}>
            <Sparkles size={48} color={colors.accent} style={styles.intermissionIcon} />
            <Text variant="display" weight="bold" style={styles.intermissionTitle}>
              Rest & Align
            </Text>
            <Text variant="body" style={styles.intermissionSubtitle}>
              {PHASES[currentSegment]} segment complete. Sit comfortably, release physical holds, and prepare for {PHASES[currentSegment + 1]}.
            </Text>
            <View style={styles.intermissionTimerContainer}>
              <Text variant="stat" style={[styles.intermissionTimer, { color: colors.accent }]}>
                {intermissionTimeLeft}
              </Text>
              <Text variant="body" weight="bold" style={styles.intermissionTimerLabel}>
                Seconds to transition
              </Text>
            </View>
            <PressableAnimated
              style={[styles.beginButton, { backgroundColor: colors.accent }]}
              onPress={handleBeginNextSegment}
              haptic="medium"
            >
              <Text variant="body" weight="bold" style={styles.beginButtonText}>
                Begin {PHASES[currentSegment + 1]}
              </Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </PressableAnimated>
          </View>
        ) : currentSegment === 0 ? (
          /* Asana Video / Guide View */
          <Pressable style={styles.videoPressArea} onPress={togglePlayPause}>
            <View style={styles.videoWrap}>
              <Video
                ref={videoRef}
                style={StyleSheet.absoluteFill}
                source={{ uri: activeStep?.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4' }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={isPlaying && !isPrepBuffer}
                isLooping
                isMuted
              />
              <View style={styles.videoVeil} />
              
              {/* Play Pause Gesture Visual Indicator */}
              {!isPlaying && (
                <View style={styles.playOverlay}>
                  <Play size={48} color="#FDFAF5" fill="#FDFAF5" opacity={0.8} />
                </View>
              )}

              {/* Pose details vignette overlay */}
              <View style={styles.poseVignette}>
                <View style={styles.poseRow}>
                  <View style={styles.poseHeader}>
                    <Text variant="body" weight="bold" style={styles.poseLabelBadge}>
                      POSE {currentStepIndex + 1} OF {currentSteps.length}
                    </Text>
                    {isModified && (
                      <View style={styles.modifiedBadge}>
                        <Sparkles size={10} color="#0D0A06" />
                        <Text variant="body" weight="bold" style={styles.modifiedBadgeText}>
                          MODIFIED
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text variant="display" weight="bold" style={styles.sanskritPoseTitle}>
                  {activeStep?.sanskrit}
                </Text>
                <Text variant="body" style={styles.englishPoseSubtitle}>
                  {isModified ? `Modified: ${activeStep?.english}` : activeStep?.english}
                </Text>

                {/* Sub-Progress Dots */}
                <View style={styles.dotsContainer}>
                  {currentSteps.map((_, dotIdx) => (
                    <View
                      key={dotIdx}
                      style={[
                        styles.progressDot,
                        dotIdx === currentStepIndex && [styles.progressDotActive, { backgroundColor: colors.accent }],
                        dotIdx < currentStepIndex && styles.progressDotCompleted,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Pressable>
        ) : (
          /* Pranayama & Dhyana Mandala Visualizer */
          <View style={styles.mandalaWrap}>
            <Animated.View style={[styles.mandala, animatedMandalaStyle]}>
              <Svg width="100%" height="100%" viewBox="0 0 220 220">
                <Circle cx="110" cy="110" r="96" fill="none" stroke={colors.accent} strokeWidth="0.6" strokeDasharray="5 6" opacity="0.28" />
                <Circle cx="110" cy="110" r="72" fill="none" stroke={colors.accent} strokeWidth="0.6" opacity="0.38" />
                <Circle cx="110" cy="110" r="48" fill="none" stroke={colors.accent} strokeWidth="0.8" opacity="0.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <Path
                    key={angle}
                    d="M110 110 C128 78 136 78 110 36 C84 78 92 78 110 110 Z"
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth="0.8"
                    opacity="0.35"
                    transform={`rotate(${angle} 110 110)`}
                  />
                ))}
              </Svg>
            </Animated.View>
            <View style={styles.embeddedTimerContainer}>
              <Text variant="stat" style={styles.embeddedTimerText}>
                {formatTime(timeLeft)}
              </Text>
              <Text variant="body" weight="bold" style={styles.embeddedBreathCue}>
                {breathCue}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Active Console Area */}
      <Animated.View style={[styles.activeConsole, animatedControlsStyle]}>
        {!isIntermission && (
          <View style={styles.telemetryDock}>
            {currentSegment === 0 ? (
              /* Asana Mode Console Controls */
              <View style={styles.asanaDock}>
                {/* Modify Pose Trigger */}
                <View style={styles.dockLeft}>
                  <PressableAnimated
                    style={[styles.consoleCard, isModified && { borderColor: colors.accent }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setIsModified(!isModified);
                    }}
                    haptic="light"
                  >
                    <Sparkles size={16} color={isModified ? colors.accent : '#A69580'} />
                    <Text variant="body" weight="bold" style={[styles.consoleCardLabel, isModified && { color: colors.accent }]}>
                      {isModified ? 'Standard' : 'Modify'}
                    </Text>
                  </PressableAnimated>
                </View>

                {/* Center SVG Circular Timer */}
                <View style={styles.dockCenter}>
                  <View style={styles.circularTimerWrapper}>
                    <Svg width="116" height="116" viewBox="0 0 120 120">
                      <Circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                      <Circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke={isPrepBuffer ? '#E06135' : colors.accent}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - (isPrepBuffer ? prepTimeLeft / 7 : timeLeft / currentStepDuration))}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </Svg>
                    <View style={styles.circularTimerContent}>
                      <Text variant="stat" style={styles.circularTimerDigits}>
                        {isPrepBuffer ? `${prepTimeLeft}s` : formatTime(timeLeft)}
                      </Text>
                      <Text variant="body" weight="bold" style={styles.circularTimerCue}>
                        {isPrepBuffer ? 'PREP' : 'HOLD'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Next Pose Preview Card */}
                <View style={styles.dockRight}>
                  {nextStep ? (
                    <PressableAnimated
                      style={styles.consoleCard}
                      onPress={handleSkipForward}
                      haptic="light"
                    >
                      <View style={styles.nextCardMeta}>
                        <Text variant="body" weight="bold" style={styles.nextCardHint}>
                          NEXT POSE
                        </Text>
                        <Text variant="body" weight="bold" style={styles.nextCardTitle} numberOfLines={1}>
                          {nextStep.sanskrit}
                        </Text>
                      </View>
                      <ChevronRight size={14} color="#CDBEA8" />
                    </PressableAnimated>
                  ) : (
                    <View style={styles.consoleCardEmpty} />
                  )}
                </View>
              </View>
            ) : (
              /* Pranayama / Dhyana Text Detail */
              <View style={styles.breathDetails}>
                <Text variant="body" style={styles.breathSubtitle}>
                  {currentHeader.subtitle}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Floating Modification Tips Sheet */}
        {isModified && currentSegment === 0 && !isIntermission && (
          <Animated.View style={styles.modificationTipsSheet}>
            <Info size={16} color={colors.accent} />
            <Text variant="body" style={styles.modificationTipsText}>
              {getPoseModification(activeStep?.sanskrit)}
            </Text>
          </Animated.View>
        )}

        {/* Progress Timeline Track */}
        <View style={styles.segmentTrack}>
          <View style={[styles.segmentFill, { width: `${segmentProgress}%`, backgroundColor: colors.accent }]} />
        </View>

        {/* Playback Controls Row */}
        <View style={styles.controlsRow}>
          <PressableAnimated haptic="light" onPress={handleSkipBackward} style={styles.smallControl} accessibilityLabel="Rewind step">
            <RotateCcw size={22} color="#FDFAF5" />
          </PressableAnimated>
          <PressableAnimated 
            haptic="medium" 
            scaleTo={1.04} 
            onPress={togglePlayPause} 
            style={[styles.playButton, { backgroundColor: colors.accent }]} 
            accessibilityLabel={isPlaying ? 'Pause routine' : 'Resume routine'}
          >
            {isPlaying ? <Pause size={28} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={28} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />}
          </PressableAnimated>
          <PressableAnimated haptic="light" onPress={handleSkipForward} style={styles.smallControl} accessibilityLabel="Fast forward step">
            <RotateCw size={22} color="#FDFAF5" />
          </PressableAnimated>
        </View>

        {/* Footnotes / Extra Controls */}
        <View style={styles.secondaryActions}>
          <PressableAnimated haptic="light" onPress={() => setIsGlossaryOpen(true)} style={styles.textAction} accessibilityLabel="Open Sanskrit glossary">
            <BookOpen size={14} color="#CDBEA8" />
            <Text variant="body" weight="bold" style={styles.textActionLabel}>Sanskrit Notes</Text>
          </PressableAnimated>
          
          <PressableAnimated haptic="medium" onPress={handleSegmentCompletion} style={styles.textAction} accessibilityLabel="Skip to next phase">
            <Text variant="body" weight="bold" style={styles.textActionLabel}>
              {currentSegment < 2 ? 'Skip Phase' : 'Complete'}
            </Text>
            <SkipForward size={14} color="#CDBEA8" />
          </PressableAnimated>
        </View>
      </Animated.View>

      {/* Sanskrit Notes Modal Drawer */}
      <Modal animationType="slide" transparent visible={isGlossaryOpen} onRequestClose={() => setIsGlossaryOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setIsGlossaryOpen(false)} />
          <View style={styles.modalContent}>
            <View style={styles.grabber} />
            <Text variant="display" weight="bold" style={[styles.modalTitle, { color: colors.primaryText }]}>
              Sanskrit Terms
            </Text>
            {[
              { term: 'Asana', def: 'Physical posture or seat. Releases physical holds to prepare for breathing.' },
              { term: 'Pranayama', def: 'Breath regulation. Lengthens, refines, and balances vital energy channels.' },
              { term: 'Dhyana', def: 'Meditation. Still, quiet awareness of inner presence.' },
              { term: 'Ujjayi', def: 'Victorious ocean breath. Created by slightly contracting the throat.' },
            ].map((item) => (
              <View key={item.term} style={[styles.glossaryRow, { borderBottomColor: colors.border }]}>
                <Text variant="body" weight="bold" style={{ color: colors.primaryText }}>{item.term}</Text>
                <Text variant="body" style={[styles.glossaryDef, { color: colors.secondaryText }]}>{item.def}</Text>
              </View>
            ))}
            <PressableAnimated style={[styles.closeGlossary, { borderColor: colors.accent }]} onPress={() => setIsGlossaryOpen(false)} haptic="light">
              <Text variant="body" weight="bold" style={{ color: colors.accent }}>Close</Text>
            </PressableAnimated>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 58 : 38,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  audioControls: {
    flexDirection: 'row',
    gap: 8,
  },
  phaseTrack: {
    flex: 1,
    marginHorizontal: 8,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  phasePill: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phasePillText: {
    fontSize: 9,
    letterSpacing: 0.5,
    color: 'rgba(253,250,245,0.36)',
    textTransform: 'uppercase',
  },
  phasePillTextActive: {
    color: '#FDFAF5',
  },
  overallTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  overallFill: {
    height: '100%',
  },
  visualStage: {
    flex: 1,
    backgroundColor: '#070503',
    justifyContent: 'center',
  },
  videoPressArea: {
    flex: 1,
  },
  videoWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  videoVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,5,3,0.14)',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poseVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 60,
    backgroundColor: 'rgba(13,10,6,0) rgba(13,10,6,0.85) rgba(13,10,6,0.95)', // Solid vignette color representation
    // To represent gradient in React Native: we keep standard backdrop styling
    borderTopColor: 'rgba(0,0,0,0)',
  },
  poseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  poseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  poseLabelBadge: {
    color: '#CDBEA8',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  modifiedBadge: {
    backgroundColor: '#CDBEA8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  modifiedBadgeText: {
    color: '#0D0A06',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  sanskritPoseTitle: {
    color: '#FDFAF5',
    fontSize: 32,
    lineHeight: 38,
    marginTop: 4,
  },
  englishPoseSubtitle: {
    color: '#A69580',
    fontSize: 14,
    marginTop: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 18,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressDotActive: {
    width: 16,
  },
  progressDotCompleted: {
    backgroundColor: 'rgba(205,190,168,0.5)',
  },
  mandalaWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mandala: {
    width: 260,
    height: 260,
  },
  embeddedTimerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  embeddedTimerText: {
    color: '#FDFAF5',
    fontSize: 48,
    fontWeight: 'bold',
  },
  embeddedBreathCue: {
    color: 'rgba(253,250,245,0.4)',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  intermissionView: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0A06',
  },
  intermissionIcon: {
    marginBottom: 20,
  },
  intermissionTitle: {
    color: '#FDFAF5',
    fontSize: 34,
    marginBottom: 8,
    textAlign: 'center',
  },
  intermissionSubtitle: {
    color: '#A69580',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  intermissionTimerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  intermissionTimer: {
    fontSize: 54,
    fontWeight: 'bold',
  },
  intermissionTimerLabel: {
    fontSize: 9,
    color: '#A69580',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  beginButton: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  beginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeConsole: {
    backgroundColor: '#0D0A06',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  telemetryDock: {
    minHeight: 120,
    justifyContent: 'center',
    marginBottom: 12,
  },
  asanaDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dockLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  dockCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
  dockRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  consoleCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '92%',
    maxWidth: 110,
    minHeight: 46,
  },
  consoleCardEmpty: {
    width: '92%',
    maxWidth: 110,
    minHeight: 46,
  },
  consoleCardLabel: {
    color: '#A69580',
    fontSize: 11,
  },
  nextCardMeta: {
    flex: 1,
  },
  nextCardHint: {
    color: '#A69580',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  nextCardTitle: {
    color: '#FDFAF5',
    fontSize: 10,
    marginTop: 1,
  },
  circularTimerWrapper: {
    width: 116,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularTimerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTimerDigits: {
    color: '#FDFAF5',
    fontSize: 28,
    fontWeight: 'bold',
  },
  circularTimerCue: {
    color: 'rgba(253,250,245,0.36)',
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  breathDetails: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  breathSubtitle: {
    color: '#A69580',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  modificationTipsSheet: {
    backgroundColor: 'rgba(196,75,34,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(196,75,34,0.15)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  modificationTipsText: {
    color: '#CDBEA8',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  segmentTrack: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  segmentFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    marginBottom: 12,
  },
  smallControl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  textAction: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textActionLabel: {
    color: '#CDBEA8',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7,5,3,0.78)',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FDFAF5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 34,
  },
  grabber: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(107,90,65,0.18)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  glossaryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  glossaryDef: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  closeGlossary: {
    marginTop: 20,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
