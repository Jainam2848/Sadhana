import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { Image } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRoutine, useProfile, useSubmitSession } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { CourseDetailSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  ChevronLeft, 
  Lock, 
  PlayCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Info, 
  AlertTriangle, 
  Check,
  Award
} from 'lucide-react-native';
import { Alert, View as RNView, Text as RNText, AccessibilityInfo } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing, 
  cancelAnimation,
  interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle, Path, G } from '@/components/ui/Compat';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';

const AnimatedG = Animated.createAnimatedComponent(G) as any;

// -------------------------------------------------------------
// Exercise Details Lookup Dictionary
// -------------------------------------------------------------
interface DetailedInfo {
  importance: string;
  steps: string[];
  precautions: string[];
}

function getExerciseDetails(title: string, routine: any): DetailedInfo {
  const t = (title || '').toLowerCase();
  
  if (t.includes('surya') || t.includes('salutation')) {
    return {
      importance: "Awakens vital energy (prana), improves blood circulation throughout the body, warms up muscular systems, and builds physical flexibility and cardiovascular stamina.",
      steps: [
        "Stand at the front of your mat, feet together, hands in prayer pose (Pranamasana) at chest level.",
        "Inhale, lift your arms up, keeping shoulders relaxed, and arch your back slightly (Hastauttanasana).",
        "Exhale, fold forward from your hips, keeping the spine straight, and place hands beside feet (Padahastasana).",
        "Inhale, step your right leg back, drop the knee, point the toes, and look up (Ashwa Sanchalanasana).",
        "Retain your breath, step the left leg back to a stable plank position, keeping body in a straight line.",
        "Exhale, lower knees, chest, and forehead gently to the floor, hips slightly raised (Ashtanga Namaskara).",
        "Inhale, slide forward, keeping hips on the floor, and lift chest into Cobra pose (Bhujangasana).",
        "Exhale, tuck toes and lift hips up and back into Downward Dog (Adho Mukha Svanasana).",
        "Inhale, step the right foot forward between your hands, drop the left knee, and look up (Ashwa Sanchalanasana).",
        "Exhale, step the left foot forward to meet the right, keeping head relaxed (Padahastasana).",
        "Inhale, roll up the spine, lift torso, reach arms up and arch back slightly (Hastauttanasana).",
        "Exhale, return to standing prayer pose (Pranamasana). Repeat on the other side."
      ],
      precautions: [
        "Avoid if you have acute back pain, high blood pressure, or wrist injuries.",
        "Move gently, matching your breathing to each pose; do not force the backbends.",
        "Keep your knees slightly bent in the forward fold if your hamstrings feel tight."
      ]
    };
  }
  
  if (t.includes('spinal') || t.includes('awakening') || t.includes('back')) {
    return {
      importance: "Releases deep spinal stiffness, improves spinal flexibility, counteracts slouching from desk work, and helps ground and soothe the nervous system.",
      steps: [
        "Start in a tabletop position on hands and knees, keeping wrists under shoulders and knees under hips.",
        "Inhale, arch your back, dropping the belly down while lifting your chest and tailbone (Cow Pose).",
        "Exhale, round your spine toward the ceiling, tucking your chin and tailbone (Cat Pose). Repeat for 5 breaths.",
        "Push back into Downward Facing Dog, pedaling your heels to stretch the back of your legs and spine.",
        "Come to a comfortable seated pose (Sukhasana), place your right hand on your left knee, and gently twist left.",
        "Exhale, return to center, place left hand on right knee, and twist right. Breathe deeply into the chest."
      ],
      precautions: [
        "Avoid deep twisting if you have a recent disc herniation or severe lower back injury.",
        "Keep movements smooth and slow. Do not yank or force the twists."
      ]
    };
  }

  if (t.includes('joint') || t.includes('mobilization') || t.includes('sukshma')) {
    return {
      importance: "Lubricates the joints, releases blockages in the flow of prana (vital energy), and increases blood circulation to extremities.",
      steps: [
        "Sit or stand comfortably with your spine erect and shoulders relaxed.",
        "Gently roll your neck in half-circles from shoulder to shoulder, inhaling as you roll back, exhaling forward.",
        "Place your fingertips on your shoulders and rotate your elbows in wide circles, 5 times each direction.",
        "Extend your arms forward, make loose fists, and rotate your wrists clockwise and counter-clockwise.",
        "Sit with legs extended, flex ankles forward and backward, then rotate them to release ankle stiffness."
      ],
      precautions: [
        "Avoid if you have active joint inflammation, acute sprains, or severe arthritis.",
        "Move only in a pain-free range of motion. Do not force joints beyond comfort."
      ]
    };
  }

  if (t.includes('vinyasa') || t.includes('solar') || t.includes('flow') || t.includes('warrior')) {
    return {
      importance: "Builds physical strength, core stability, and intense mental focus while generating internal heat to purify the body.",
      steps: [
        "Begin standing tall in Mountain Pose. Take a deep breath to center your focus.",
        "Flow through a Sun Salutation A to warm up your muscles and coordinate breath.",
        "From Downward Dog, step right foot forward, spin back heel down, and lift arms into Warrior I.",
        "Open your hips and arms to transition into Warrior II, gazing over your front right hand.",
        "Straighten the front leg, reach forward, and tilt down into Triangle Pose, looking up at the left hand.",
        "Exhale, place hands on the mat, flow through Chaturanga back to Downward Dog. Repeat on the left side."
      ],
      precautions: [
        "Requires knee, hip, and shoulder stability. Listen to your body.",
        "Modify by dropping the back knee in lunges or using a yoga block in Triangle Pose if the floor feels too far."
      ]
    };
  }

  if (t.includes('hip') || t.includes('glute') || t.includes('pigeon')) {
    return {
      importance: "Hips store physical and emotional tension. This routine opens deep rotators, easing lower back pain and improving hip mobility.",
      steps: [
        "Start in a tabletop position on hands and knees or in Downward Facing Dog.",
        "Bring your right knee forward behind your right wrist, placing the shin at a comfortable angle across the mat.",
        "Extend your left leg straight back behind you, keeping your hips square to the front of the mat.",
        "Inhale to lengthen your spine, then exhale as you gently fold forward over your right shin (Pigeon Pose).",
        "Rest your forehead on your hands or the floor. Hold for 2-3 minutes while breathing deeply.",
        "Gently press up, step back to tabletop, and repeat the pose with the left knee forward."
      ],
      precautions: [
        "Avoid if you have severe knee pain or meniscus injuries.",
        "Use a yoga block or blanket under the hip of the bent leg to protect the knee joint and keep hips level."
      ]
    };
  }

  if (t.includes('shoulder') || t.includes('neck') || t.includes('release') || t.includes('eagle') || t.includes('child')) {
    return {
      importance: "Relieves chronic tension in the neck, upper back, and shoulders caused by screen time, opening the chest for fuller respiration.",
      steps: [
        "Sit comfortably with an upright spine. Wrap your right arm under your left, binding at the wrists (Eagle Arms).",
        "Lift your elbows to shoulder height and press your hands away from your face. Breathe into the upper back.",
        "Unwrap gently and repeat on the other side, wrapping the left arm under the right.",
        "Lower your hips to your heels, fold forward, and rest in Child's Pose (Balasana) with arms extended.",
        "Walk both hands to the right side of the mat to stretch the left shoulder and ribcage, then repeat on the left."
      ],
      precautions: [
        "Do not force the arms to bind if your shoulders are tight; simply hold opposite shoulders (bear hug).",
        "Avoid if you have acute shoulder dislocation, rotator cuff tears, or neck disc herniation."
      ]
    };
  }

  if (t.includes('hamstring') || t.includes('sanctuary') || t.includes('splits') || t.includes('forward bend')) {
    return {
      importance: "Safely lengthens the hamstrings, which relieves lower back tension, improves standing posture, and aids recovery.",
      steps: [
        "Stand tall in Mountain Pose. Inhale, sweep arms up. Exhale, fold forward from your hips (Uttanasana). Keep knees soft.",
        "Let your head and arms hang heavy, breathing into the back of your thighs.",
        "Step back into Downward Facing Dog, alternating pressing your right and left heels toward the mat.",
        "Sit on the floor with legs extended straight. Flex feet, reach up, and fold forward from the crease of your hips.",
        "Hold onto your shins, ankles, or feet. Keep your spine long; do not round your upper back."
      ],
      precautions: [
        "Keep your knees slightly bent if you feel any pulling or strain in your lower back.",
        "Never bounce in forward folds; hold the stretch statically and breathe."
      ]
    };
  }

  if (t.includes('ashtanga') || t.includes('advanced') || t.includes('crow') || t.includes('wheel')) {
    return {
      importance: "A highly vigorous and demanding physical practice that builds deep cardiovascular fitness, mental focus, and muscular strength.",
      steps: [
        "Flow through 3 rounds of Sun Salutation A and 3 rounds of Sun Salutation B to build deep internal heat.",
        "Perform standing balance poses, including Extended Hand-to-Big-Toe Pose (Utthita Hasta Padangusthasana).",
        "Move into arm balances like Crow Pose (Bakasana), placing knees on back of triceps and lifting feet.",
        "Perform deep backbends like Wheel Pose (Urdhva Dhanurasana), pushing up from the feet and hands.",
        "End with a seated forward fold (Paschimottanasana) and 5 minutes of quiet rest in Corpse Pose (Savasana)."
      ],
      precautions: [
        "Not recommended for beginners. Requires wrist, shoulder, and core strength.",
        "Avoid if you have heart conditions, high blood pressure, pregnancy, or acute joint injuries."
      ]
    };
  }

  if (t.includes('nadi') || t.includes('shodhana') || t.includes('breathing')) {
    return {
      importance: "Calms the nervous system, reduces stress and anxiety, balances the left and right hemispheres of the brain, and prepares the mind for meditation.",
      steps: [
        "Sit comfortably in a cross-legged position with your spine straight and eyes gently closed.",
        "Place your left hand on your left knee in Jnana Mudra (thumb and index finger touching).",
        "Bring your right hand to your face. Place your index and middle fingers between your eyebrows.",
        "Close your right nostril with your thumb and inhale fully and quietly through your left nostril.",
        "Close your left nostril with your ring finger, open your right nostril, and exhale fully through the right.",
        "Inhale deeply through your right nostril, close it, and then exhale slowly through your left nostril. This is one cycle.",
        "Continue this pattern for 5 to 10 minutes, keeping your breath smooth, even, and natural."
      ],
      precautions: [
        "Keep the breath gentle. Never force or strain your lungs.",
        "Do not practice breath retention (holding the breath) if you have high blood pressure or heart issues.",
        "Stop if you feel dizzy, anxious, or short of breath."
      ]
    };
  }

  if (t.includes('kapalabhati') || t.includes('shining') || t.includes('skull')) {
    return {
      importance: "Clears the sinuses, invigorates the brain, improves digestive function, and boosts metabolic rate and vital energy.",
      steps: [
        "Sit comfortably with your spine erect. Rest your hands on your knees with palms facing up.",
        "Inhale deeply through both nostrils, expanding your chest and abdomen.",
        "Exhale forcefully and quickly by contracting your abdominal muscles, pushing the air out of your nose.",
        "Release the abdominal contraction immediately; the inhalation will occur passively as your belly expands.",
        "Repeat this rhythmic exhalation-inhalation cycle at a pace of about 1 breath per second.",
        "Complete a round of 20-30 breaths, then sit quietly and observe the natural stillness in your breath."
      ],
      precautions: [
        "Avoid if you have high blood pressure, heart disease, hernias, gastric ulcers, or during pregnancy.",
        "Practice only on an empty stomach. Stop immediately if you feel dizzy or hyperventilated."
      ]
    };
  }

  if (t.includes('sheetali') || t.includes('cooling')) {
    return {
      importance: "Cools the physical body, calms anger and emotional irritation, soothes the nervous system, and quenches thirst.",
      steps: [
        "Sit comfortably with your spine straight and shoulders relaxed. Close your eyes.",
        "Extend your tongue slightly outside your mouth and roll the sides upward to form a tube or straw shape.",
        "Inhale deeply and slowly through the rolled tongue, feeling the cool air pass over it.",
        "Draw your tongue back, close your mouth, and exhale slowly and completely through both nostrils.",
        "Repeat this process for 10 to 15 breaths, focusing on the cooling sensation in your throat."
      ],
      precautions: [
        "Do not practice in cold weather or in highly polluted environments.",
        "Avoid if you have low blood pressure, chronic asthma, bronchitis, or heavy congestion."
      ]
    };
  }

  if (t.includes('box') || t.includes('sama') || t.includes('vritti')) {
    return {
      importance: "Triggers the parasympathetic nervous system, rapidly lowers stress hormones, slows heart rate, and establishes deep mental focus.",
      steps: [
        "Sit upright in a chair or on the floor. Exhale all the air from your lungs completely.",
        "Inhale slowly through your nose for a count of 4, filling your lungs comfortably.",
        "Hold your breath gently for a count of 4, keeping your face and shoulders relaxed.",
        "Exhale smoothly through your nose or mouth for a count of 4, emptying lungs completely.",
        "Hold your lungs empty for a count of 4. This completes one cycle of the box.",
        "Repeat this box pattern for 5 to 10 cycles, keeping the timing equal for each side of the box."
      ],
      precautions: [
        "Never strain or force your breath holds. If a 4-second hold feels uncomfortable, reduce the count to 3 seconds.",
        "Avoid holds if pregnant or if you experience anxiety during breath retention."
      ]
    };
  }

  if (t.includes('bhramari') || t.includes('bee') || t.includes('humming')) {
    return {
      importance: "Relieves mental tension and anxiety, lowers blood pressure, calms an overactive mind, and triggers the relaxation response.",
      steps: [
        "Sit comfortably with your spine erect. Close your eyes and relax your jaw.",
        "Place your index fingers on the cartilage (tragus) of your ears to block out external sound.",
        "Inhale deeply through both nostrils, feeling your chest expand.",
        "As you exhale slowly, make a steady, smooth, medium-pitched humming sound (like a humming bee) in your throat.",
        "Feel the vibrations resonate throughout your head, jaw, and brain. Repeat for 5-8 breaths."
      ],
      precautions: [
        "Do not press too hard on the ear cartilage. Do not insert fingers into the ear canal.",
        "Best practiced in a quiet environment. Rest after completing the practice."
      ]
    };
  }

  if (t.includes('trataka') || t.includes('gazing')) {
    return {
      importance: "Strengthens eye muscles, sharpens visual and mental concentration, improves memory, and helps quiet internal chatter.",
      steps: [
        "Set up a candle at eye level, about 2 to 3 feet in front of you, in a quiet, dark room with no draft.",
        "Sit comfortably with your spine erect and shoulders relaxed. Take a few deep breaths to settle.",
        "Gaze steadily at the brightest part of the candle flame (just above the wick) without blinking.",
        "Keep your eyes relaxed. If your eyes begin to water or feel tired, close them gently.",
        "With eyes closed, focus on the after-image of the flame at your eyebrow center until it completely fades.",
        "Open your eyes and repeat the gazing once more, followed by closing them. Rest your eyes afterward."
      ],
      precautions: [
        "Avoid if you have glaucoma, severe astigmatism, or epilepsy (triggered by flickering lights).",
        "Do not strain your eyes; if it feels uncomfortable, close your eyes immediately."
      ]
    };
  }

  if (t.includes('nidra') || t.includes('yogic') || t.includes('psychic')) {
    return {
      importance: "A highly restorative practice equivalent to several hours of sleep. Releases deep muscular, emotional, and mental tensions.",
      steps: [
        "Lie down flat on your back in Savasana (Corpse Pose). Use a pillow under your head or knees if needed.",
        "Cover yourself with a light blanket to keep warm as your body temperature drops.",
        "Close your eyes and make a resolve (Sankalpa), a positive affirmation about your well-being.",
        "Follow the voice instructions as it guides your awareness through different parts of the body.",
        "Focus on your breath, sensations of heaviness and lightness, and guided mental visualizations.",
        "Remain awake but deeply relaxed."
      ],
      precautions: [
        "Suitable for everyone. If you experience intense anxiety or emotional discomfort during relaxation, gently open your eyes."
      ]
    };
  }

  if (t.includes('chakra') || t.includes('beeja') || t.includes('mantra') || t.includes('chanting')) {
    return {
      importance: "Uses sound vibration to align and balance the seven major energy centers (chakras) of the body, balancing physical and emotional states.",
      steps: [
        "Sit in a comfortable meditation posture with your spine tall and hands on your knees.",
        "Bring your attention to the tailbone and chant 'LAM' (Root Chakra) on a long, slow exhalation.",
        "Move up to the pelvis and chant 'VAM' (Sacral Chakra). Focus on the warmth there.",
        "Move to the navel and chant 'RAM' (Solar Plexus Chakra). Feel the solar energy.",
        "Move to the chest center and chant 'YAM' (Heart Chakra). Feel compassion radiating.",
        "Move to the throat and chant 'HAM' (Throat Chakra). Feel space and expression.",
        "Move to the space between brows and chant 'OM' (Third Eye Chakra). Feel light and stillness."
      ],
      precautions: [
        "Chant in a natural, comfortable vocal range. Do not strain your voice.",
        "Maintain a steady, slow breathing pattern between chants."
      ]
    };
  }

  if (t.includes('anapana') || t.includes('mindfulness') || t.includes('observ')) {
    return {
      importance: "Builds self-awareness, sharpens attention, and trains the mind to remain centered in the present moment.",
      steps: [
        "Sit comfortably with an upright, relaxed spine. Close your eyes gently.",
        "Direct your entire attention to the triangular area just below your nose and above your upper lip.",
        "Observe the natural, incoming and outgoing breath exactly as it is, without trying to control it.",
        "Notice the sensations of the breath—coolness as it enters, warmth as it exits, or the touch on the skin.",
        "If your mind wanders to thoughts or sounds, patiently and non-judgmentally bring it back to the breath."
      ],
      precautions: [
        "Do not force or manipulate the breath. Let the body breathe naturally.",
        "Be patient with your mind. Wandering is normal; the practice is in returning."
      ]
    };
  }

  if (t.includes('metta') || t.includes('loving') || t.includes('kindness')) {
    return {
      importance: "Cultivates compassion, reduces self-criticism and anger, builds emotional resilience, and fosters feelings of connection.",
      steps: [
        "Sit comfortably, close your eyes, and bring your awareness to your heart center.",
        "Repeat silently to yourself: 'May I be safe. May I be happy. May I be healthy. May I live with ease.'",
        "Visualize a loved one or benefactor and send them the same wishes: 'May you be safe. May you be happy...'",
        "Extend the wishes to a neutral person (someone you see but don't know well).",
        "Extend the wishes to a difficult person, letting go of resentment.",
        "Finally, expand your awareness to send these wishes to all living beings everywhere."
      ],
      precautions: [
        "If strong emotions or resistance arise, return to directing loving-kindness to yourself until you feel stable."
      ]
    };
  }

  // Fallback dynamic generator using routine metadata
  const categoryName = routine?.category === 'asana' ? 'physical posture (asana)' : 
                       routine?.category === 'pranayama' ? 'breathing technique (pranayama)' : 
                       routine?.category === 'dhyana' ? 'meditative focus (dhyana)' : 'philosophical reflection';

  const targets = routine?.tightness && routine.tightness.length > 0 
    ? ` This practice is excellent for releasing tension in the ${routine.tightness.join(' and ')}.`
    : '';

  const benefits = routine?.goals && routine.goals.length > 0
    ? ` It helps promote ${routine.goals.join(', ')}.`
    : '';

  return {
    importance: `A traditional ${categoryName} designed to promote physical and mental balance.${targets}${benefits} Practices like ${title} help center your attention and ground your energy.`,
    steps: [
      `Sit or stand in a comfortable position with your spine erect and shoulders relaxed.`,
      `Take a few deep, centering breaths to prepare your mind and body for the practice.`,
      `Carefully observe and perform the movements or focus: "${routine?.description || 'Gentle rhythmic practice.'}"`,
      `Continue the practice steadily for the duration of the session, matching your breathing with movements.`,
      `Release the posture or breathing pattern, sit quietly, and notice the physical and mental effects.`
    ],
    precautions: [
      `Always listen to your body. Do not push into pain or sharp discomfort.`,
      `Modify the pose or breathing rate to suit your current energy level and flexibility.`,
      `If you have any chronic joint issues or cardiovascular conditions, consult a qualified instructor before practicing.`
    ]
  };
}

function CourseDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const submitSession = useSubmitSession();

  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  // Fetch routine details
  const { data: routine, isLoading, isError, refetch } = useRoutine(routineId);

  // Fetch profile to verify premium tier
  const { data: profile } = useProfile(user?.id);
  const isPremium = profile?.premium || user?.premium || false;

  // View state machine: 'preview' | 'practice' | 'completed'
  const [viewMode, setViewMode] = useState<'preview' | 'practice' | 'completed'>('preview');

  // Confirmation sheets state
  const [exitSheetVisible, setExitSheetVisible] = useState(false);
  const [completeSheetVisible, setCompleteSheetVisible] = useState(false);

  // Motion preference
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotionEnabled(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduceMotionEnabled(enabled)
    );
    return () => {
      subscription.remove();
    };
  }, []);

  // Timer state
  const totalSeconds = (routine?.duration_minutes || 5) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isTimerPlaying, setIsTimerPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rotation = useSharedValue(0);
  const bgProgress = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  // Trigger background cross-fade when viewMode changes
  useEffect(() => {
    bgProgress.value = withTiming(viewMode === 'preview' ? 0 : 1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  }, [viewMode]);

  // Trigger Pranayama pulse animation
  useEffect(() => {
    if (viewMode === 'practice' && routine?.category === 'pranayama' && !reduceMotionEnabled) {
      pulseValue.value = withRepeat(
        withTiming(1.08, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      pulseValue.value = 1;
    }
  }, [viewMode, routine?.category, reduceMotionEnabled]);

  // Mount diagnostics logging
  useEffect(() => {
    console.log(`[CourseDetailScreen] Component Mounted. Parameters: routineId=${routineId || 'undefined'}`);
    console.log(`[CourseDetailScreen] Auth State: user_id=${user?.id || 'guest'}, isPremium=${isPremium}`);
    return () => {
      console.log(`[CourseDetailScreen] Component Unmounted.`);
    };
  }, []);

  // Log routine fetch state changes
  useEffect(() => {
    console.log(`[CourseDetailScreen] useRoutine fetch state updated: isLoading=${isLoading}, isError=${isError}, routineFound=${!!routine}`);
    if (routine) {
      console.log(`[CourseDetailScreen] Routine Data: title="${routine.title}", category="${routine.category}", duration_minutes=${routine.duration_minutes}, is_premium=${routine.is_premium}`);
    }
  }, [routine, isLoading, isError]);

  // Log viewMode transitions
  useEffect(() => {
    console.log(`[CourseDetailScreen] Transitioned viewMode to: "${viewMode}"`);
  }, [viewMode]);

  // Log timer state changes
  useEffect(() => {
    console.log(`[CourseDetailScreen] Timer playing status updated: isTimerPlaying=${isTimerPlaying}, timeLeft=${timeLeft}`);
  }, [isTimerPlaying]);

  // Animated background style for cross-fade transition
  const animatedBgStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ['#FDFAF5', '#0D0A06']
    );
    return { backgroundColor };
  });

  // Animated style for scale pulsing the progress ring
  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: 100 },
        { translateY: 100 },
        { scale: pulseValue.value },
        { translateX: -100 },
        { translateY: -100 },
      ],
    };
  });

  // Rotate Mandala during practice
  const mandalaAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: 100 },
        { translateY: 100 },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  // Reset timer if routine loads or changes
  useEffect(() => {
    if (routine) {
      setTimeLeft(routine.duration_minutes * 60);
    }
  }, [routine]);

  // Handle Rotation animation based on timer playing state
  useEffect(() => {
    if (isTimerPlaying && viewMode === 'practice') {
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, {
          duration: 12000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isTimerPlaying, viewMode]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer interval hook
  useEffect(() => {
    if (isTimerPlaying && viewMode === 'practice') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleCompletePractice(false); // natural completion plays success haptic directly above
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerPlaying, viewMode]);

  const handleStartPractice = () => {
    if (!routine) {
      console.warn(`[CourseDetailScreen] handleStartPractice called but routine is null`);
      return;
    }
    console.log(`[CourseDetailScreen] handleStartPractice clicked. title="${routine.title}", is_premium=${routine.is_premium}`);
    
    // Check premium access
    const isLocked = routine.is_premium && !isPremium;
    if (isLocked) {
      console.log(`[CourseDetailScreen] Practice access denied: locked for guest/free user`);
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
    console.log(`[CourseDetailScreen] Beginning practice session. Initializing timer to ${routine.duration_minutes * 60} seconds`);
    setViewMode('practice');
    setTimeLeft(routine.duration_minutes * 60);
    setIsTimerPlaying(true);
  };

  const handleTogglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsTimerPlaying(!isTimerPlaying);
  };

  const handleResetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTimerPlaying(false);
    setTimeLeft(routine ? routine.duration_minutes * 60 : 300);
  };

  const handleExitPractice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExitSheetVisible(true);
  };

  const handleConfirmExit = () => {
    setExitSheetVisible(false);
    setIsTimerPlaying(false);
    setViewMode('preview');
  };

  const handleCancelExit = () => {
    setExitSheetVisible(false);
  };

  // Immediate completion option / skip
  const handleSkipOrComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setCompleteSheetVisible(true);
  };

  const handleConfirmComplete = () => {
    setCompleteSheetVisible(false);
    setTimeLeft(0);
    handleCompletePractice(true); // manual completes play normal impact haptic
  };

  const handleCancelComplete = () => {
    setCompleteSheetVisible(false);
  };

  const handleCompletePractice = (playHaptic = true) => {
    setIsTimerPlaying(false);
    if (playHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setViewMode('completed');

    try {
      // Submit log to database
      submitSession.mutate({
        routineId: routineId || 'mock-id',
        durationPracticed: routine?.duration_minutes || 5,
      });
    } catch (e) {
      console.warn('Could not submit session log', e);
    }
  };

  const handleReturnToLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode('preview');
    router.back();
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

  // Load custom structured contents for this routine with safe-guards
  const routineTitle = routine.title || '';
  const details = getExerciseDetails(routineTitle, routine);

  // Timer math safe-guards (avoids division by zero and NaN)
  const initialDuration = Math.max((routine.duration_minutes || 5) * 60, 1);
  const safeTimeLeft = typeof timeLeft === 'number' && !isNaN(timeLeft) ? timeLeft : initialDuration;
  const progressPercent = Math.min(((initialDuration - safeTimeLeft) / initialDuration) * 100, 100);
  const safeProgressPercent = isNaN(progressPercent) ? 0 : progressPercent;
  const strokeDashoffset = 439.8 - (safeProgressPercent / 100) * 439.8;
  const safeStrokeDashoffset = isNaN(strokeDashoffset) ? 439.8 : strokeDashoffset;

  const formatTimerTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Select cover image or fallback based on category
  const imageSource = routine.thumbnail_url || (
    routine.category === 'asana' ? 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600' :
    routine.category === 'pranayama' ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600' :
    routine.category === 'dhyana' ? 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600' :
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600'
  );

  // Sanskrit terms safe-guard
  const sanskritTerms = typeof routine.sanskrit_terms === 'object' && routine.sanskrit_terms !== null
    ? routine.sanskrit_terms
    : {};

  return (
    <Animated.View style={[{ flex: 1 }, animatedBgStyle]} className="relative justify-between">
      {viewMode === 'preview' && (
        <React.Fragment>
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
            {/* Hero Image Header */}
            <View 
              className="h-[280px] bg-warm-highlight relative overflow-hidden w-full border-b border-surface-border"
              accessibilityLabel="Exercise preview image"
            >
              <Image
                source={{ uri: imageSource }}
                className="w-full h-full object-cover"
                accessibilityLabel={`${routineTitle} posture`}
              />
              <View className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
            </View>

            {/* Main Details Section */}
            <View className="-mt-4 pt-4 px-6 relative z-20">
              <Micro className="text-accent-terracotta uppercase tracking-wider font-bold mb-1">
                {routine.category}
              </Micro>
              <Display className="text-3xl font-serif text-primary-text mb-2">
                {routineTitle}
              </Display>

              {/* Sanskrit terms badges */}
              {Object.keys(sanskritTerms).length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-4" accessibilityLabel="Sanskrit names">
                  {Object.entries(sanskritTerms).map(([sanskrit, english]) => (
                    <View key={sanskrit} className="bg-surface border border-surface-border/60 rounded-lg px-2.5 py-1 flex-row items-center gap-1.5">
                      <Text className="font-sans font-bold text-xs text-accent-terracotta">{sanskrit}</Text>
                      <Text className="font-sans text-[11px] text-secondary-text">({english as string})</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* General Metadata Info Row */}
              <View className="flex-row items-center gap-3 mb-6">
                <View className="bg-surface border border-surface-border rounded-full px-3 py-1 flex-row items-center gap-1.5">
                  <Clock size={12} color={colors.accent} />
                  <Caption className="text-primary-text font-bold">{routine.duration_minutes} min</Caption>
                </View>

                {routine.experience_level && (
                  <View className="bg-surface border border-surface-border rounded-full px-3 py-1">
                    <Caption className="text-secondary-text uppercase font-bold text-[10px]">
                      {routine.experience_level}
                    </Caption>
                  </View>
                )}

                {routine.is_premium && (
                  <View className="bg-accent-terracotta/10 border border-accent-terracotta/20 rounded-full px-3 py-1 flex-row items-center gap-1">
                    <Lock size={10} color={colors.accent} />
                    <Caption className="text-accent-terracotta font-bold text-[10px]">PREMIUM</Caption>
                  </View>
                )}
              </View>

              {/* Importance / Benefits Card */}
              <View className="bg-accent-terracotta/5 border border-accent-terracotta/10 rounded-xl p-4 mb-6">
                <View className="flex-row items-center gap-2 mb-2">
                  <Info size={16} color={colors.accent} />
                  <Subheading className="font-sans font-bold text-sm text-primary-text mb-0">
                    Benefits & Importance
                  </Subheading>
                </View>
                <Body className="text-secondary-text text-sm leading-relaxed">
                  {details.importance}
                </Body>
              </View>

              {/* How to Do / Steps Section */}
              <View className="mb-6">
                <Subheading className="font-serif text-lg text-primary-text mb-4">
                  How to Practice
                </Subheading>
                <View className="gap-4">
                  {details.steps.map((step, idx) => (
                    <View key={idx} className="flex-row items-start gap-4">
                      <View className="w-6 h-6 rounded-full bg-accent-terracotta/10 border border-accent-terracotta/20 items-center justify-center mt-0.5">
                        <Text className="font-sans font-bold text-[11px] text-accent-terracotta">
                          {idx + 1}
                        </Text>
                      </View>
                      <Body className="flex-1 text-primary-text text-[14px] leading-relaxed">
                        {step}
                      </Body>
                    </View>
                  ))}
                </View>
              </View>

              {/* Safety Precautions Card */}
              <View className="bg-warning-bg border border-warning-border rounded-xl p-4 mb-8">
                <View className="flex-row items-center gap-2 mb-2">
                  <AlertTriangle size={16} color={colors.warningIcon} />
                  <Subheading className="font-sans font-bold text-sm text-warning-heading mb-0">
                    Safety & Precautions
                  </Subheading>
                </View>
                <View className="gap-2">
                  {details.precautions.map((prec, idx) => (
                    <View key={idx} className="flex-row items-start gap-2">
                      <Text className="text-warning-heading leading-relaxed text-xs">•</Text>
                      <Body className="flex-1 text-warning-body text-xs leading-relaxed">
                        {prec}
                      </Body>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Play CTA */}
          <View className="absolute bottom-0 left-0 w-full bg-surface/95 border-t border-surface-border px-6 py-4 z-50 flex items-center pb-8">
            <PressableAnimated
              haptic="medium"
              className="w-full max-w-sm h-12 bg-accent-terracotta rounded-full flex-row items-center justify-center gap-2 active:opacity-90 shadow"
              onPress={handleStartPractice}
              accessibilityLabel="Start this exercise session"
            >
              <Text className="text-white font-sans font-bold text-sm">Start Practice</Text>
              <PlayCircle size={16} color="#FFFFFF" />
            </PressableAnimated>
          </View>
        </React.Fragment>
      )}

      {viewMode === 'practice' && (() => {
        try {
          return (
            <View className="flex-1 bg-transparent relative justify-between px-6">
              {/* Header bar */}
              <View className="pt-12 pb-3 z-40 flex-row justify-between items-center w-full">
                <PressableAnimated
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:scale-95"
                  onPress={handleExitPractice}
                  haptic="light"
                  accessibilityLabel="Cancel practice session"
                >
                  <ChevronLeft size={24} color="#FDFAF5" />
                </PressableAnimated>
                <Text className="font-sans font-bold text-xs text-white/50 uppercase tracking-widest text-center flex-1">
                  Active Sadhana
                </Text>
                <PressableAnimated
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:scale-95"
                  onPress={handleSkipOrComplete}
                  haptic="light"
                  accessibilityLabel="Skip or complete exercise"
                >
                  <SkipForward size={18} color="#FDFAF5" />
                </PressableAnimated>
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                {/* Circular Countdown Timer */}
                <View className="items-center justify-center py-12">
                  <View className="w-56 h-56 bg-[#1A140D] rounded-full items-center justify-center border border-[#2B2014] relative shadow-2xl">
                    {/* Consolidated Svg Countdown Circle + Mandala */}
                    <Svg width="200" height="200" style={{ position: 'absolute' }} viewBox="0 0 200 200">
                      {/* Outer Countdown Ring - Gated pulse animation applied if Pranayama */}
                      <AnimatedG style={animatedRingStyle}>
                        {/* Track Circle */}
                        <Circle 
                          cx="100" 
                          cy="100" 
                          r="70" 
                          stroke="#2B2014" 
                          strokeWidth="4" 
                          fill="none" 
                        />
                        {/* Progress Circle - Rotated Group */}
                        <G transform="rotate(-90 100 100)">
                          <Circle 
                            cx="100" 
                            cy="100" 
                            r="70" 
                            stroke={colors.accent} 
                            strokeWidth="5" 
                            strokeLinecap="round"
                            strokeDasharray={[439.8, 439.8]} 
                            strokeDashoffset={safeStrokeDashoffset} 
                            fill="none" 
                          />
                        </G>
                      </AnimatedG>

                      {/* Faint rotating Mandala icon in center */}
                      <AnimatedG style={mandalaAnimatedStyle} opacity={0.15}>
                        <Circle cx="0" cy="0" r="57.6" stroke={colors.accent} strokeDasharray={[3, 3]} strokeWidth="0.5" fill="none" />
                        <Path d="M0 -42 L0 42 M-42 0 L42 0" stroke={colors.accent} strokeWidth="0.5" />
                      </AnimatedG>
                    </Svg>

                    {/* Clock numbers */}
                    <View className="items-center justify-center">
                      <Display className="text-white font-bold tracking-tight">
                        {formatTimerTime(safeTimeLeft)}
                      </Display>
                      <Caption className="text-white/40 text-[10px] uppercase font-bold mt-1 tracking-wider">
                        {isTimerPlaying ? 'Active' : 'Paused'}
                      </Caption>
                    </View>
                  </View>

                  {/* Controls bar */}
                  <View className="flex-row items-center gap-6 mt-10">
                    <PressableAnimated
                      className="w-12 h-12 rounded-full border border-white/10 bg-white/5 items-center justify-center active:bg-white/15"
                      onPress={handleResetTimer}
                      haptic="medium"
                      accessibilityLabel="Reset timer"
                    >
                      <RotateCcw size={18} color="#FDFAF5" />
                    </PressableAnimated>

                    <PressableAnimated
                      className="w-16 h-16 rounded-full bg-accent-terracotta items-center justify-center shadow-lg active:scale-95"
                      onPress={handleTogglePlay}
                      haptic="medium"
                      accessibilityLabel={isTimerPlaying ? 'Pause timer' : 'Resume timer'}
                    >
                      {isTimerPlaying ? (
                        <Pause size={24} color="#FDFAF5" fill="#FDFAF5" />
                      ) : (
                        <Play size={24} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 3 }} />
                      )}
                    </PressableAnimated>

                    <PressableAnimated
                      className="w-12 h-12 rounded-full border border-white/10 bg-white/5 items-center justify-center active:bg-white/15"
                      onPress={handleSkipOrComplete}
                      haptic="medium"
                      accessibilityLabel="Mark exercise complete"
                    >
                      <Check size={18} color="#FDFAF5" />
                    </PressableAnimated>
                  </View>
                </View>

                {/* Instruction Steps - Visible during practice */}
                <View className="border-t border-white/10 pt-6 px-4">
                  <Text className="font-serif text-lg text-[#F7E5D2] mb-4">
                    Postures & Sequence
                  </Text>
                  <View className="gap-5">
                    {details.steps.map((step, idx) => (
                      <View key={idx} className="flex-row items-start gap-4">
                        <View className="w-5 h-5 rounded-full bg-white/10 items-center justify-center mt-0.5">
                          <Text className="font-sans font-bold text-[10px] text-white/70">
                            {idx + 1}
                          </Text>
                        </View>
                        <Text className="flex-1 font-sans text-white/80 text-[13px] leading-relaxed">
                          {step}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Safety Precautions Callout */}
                  <View className="bg-warning-bg border border-warning-border rounded-xl p-4 mt-8">
                    <View className="flex-row items-center gap-2 mb-2">
                      <AlertTriangle size={15} color={colors.warningIcon} />
                      <Text className="font-sans font-bold text-xs text-warning-heading uppercase tracking-wider">
                        Safety & Precautions
                      </Text>
                    </View>
                    <View className="gap-2">
                      {details.precautions.map((prec, idx) => (
                        <View key={idx} className="flex-row items-start gap-2">
                          <Text className="text-warning-heading leading-relaxed text-xs">•</Text>
                          <Text className="flex-1 font-sans text-warning-body text-xs leading-relaxed">
                            {prec}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          );
        } catch (e: any) {
          console.error("Practice render error:", e);
          return (
            <RNView style={{ flex: 1, backgroundColor: '#0D0A06', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
              <RNText style={{ color: '#E06135', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Practice View Crash</RNText>
              <RNText style={{ color: '#FDFAF5', fontSize: 12, fontFamily: 'monospace' }}>{e.stack || e.toString()}</RNText>
            </RNView>
          );
        }
      })()}

      {viewMode === 'completed' && (
        <View className="flex-1 bg-transparent items-center justify-center px-8">
          <MandalaThread />

          <View className="items-center justify-center">
            {/* Circular badge */}
            <View className="w-24 h-24 bg-growth-green/10 border border-growth-green/30 rounded-full items-center justify-center mb-6">
              <Award size={48} color="#4CAF50" strokeWidth={1.5} />
            </View>

            {/* Stats Card */}
            <View className="w-full max-w-xs flex-row justify-around bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <View className="items-center">
                <Text className="font-sans text-xs text-white/60">Minutes Completed</Text>
                <Display className="text-white font-bold text-2xl mt-1">
                  {routine.duration_minutes}
                </Display>
              </View>
              <View className="w-[1px] bg-white/10" />
              <View className="items-center">
                <Text className="font-sans text-xs text-white/60">Current Streak</Text>
                {/* TODO: Wire in the real streak count from a useStreak hook or user_streaks Supabase table here */}
                <Display className="text-white font-bold text-2xl mt-1">
                  --
                </Display>
              </View>
            </View>
            
            <Heading className="text-3xl font-serif text-[#F7E5D2] text-center mb-2">
              Practice Complete
            </Heading>
            
            <Heading className="text-accent-terracotta text-center font-devanagari text-2xl mb-2">
              Hari Om Tat Sat
            </Heading>
            <Caption className="text-white/60 text-center font-sans max-w-xs mb-8">
              You have completed {routine.duration_minutes} minutes of {routine.title}. Your morning devotion is logged.
            </Caption>

            <PressableAnimated
              haptic="medium"
              className="px-8 py-3 bg-accent-terracotta rounded-full flex-row items-center gap-2"
              onPress={handleReturnToLibrary}
              accessibilityLabel="Return to library"
            >
              <Text className="text-white font-sans font-bold text-sm">Hari Om</Text>
            </PressableAnimated>
          </View>
        </View>
      )}

      {/* Confirmation Sheets */}
      <ConfirmSheet
        visible={exitSheetVisible}
        title="Exit Practice?"
        message="Are you sure you want to stop this session? Your progress will not be saved."
        confirmLabel="Exit"
        cancelLabel="Continue Practice"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />

      <ConfirmSheet
        visible={completeSheetVisible}
        title="Complete Session?"
        message="Would you like to complete this practice now and log it to your daily journal?"
        confirmLabel="Complete Now"
        cancelLabel="Cancel"
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
      />
    </Animated.View>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <RNView style={{ flex: 1, backgroundColor: '#0D0A06', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <RNText style={{ color: '#E06135', fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
            Sanctuary Session Error
          </RNText>
          <RNText style={{ color: '#FDFAF5', fontSize: 11, fontFamily: 'monospace', opacity: 0.8, lineHeight: 16 }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </RNText>
        </RNView>
      );
    }
    return this.props.children;
  }
}

export default function CourseDetailScreenWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CourseDetailScreen />
    </ErrorBoundary>
  );
}
