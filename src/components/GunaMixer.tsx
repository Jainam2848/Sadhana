import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_SIZE = 320;
const CENTER = CONTAINER_SIZE / 2;
const RADIUS = 65;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GunaMixerProps {
  onRatioChange: (ratios: { sattva: number; rajas: number; tamas: number }) => void;
}

export const GunaMixer: React.FC<GunaMixerProps> = ({ onRatioChange }) => {
  // Center-relative coordinates
  const sattvaX = useSharedValue(0);
  const sattvaY = useSharedValue(-60);

  const rajasX = useSharedValue(-65);
  const rajasY = useSharedValue(50);

  const tamasX = useSharedValue(65);
  const tamasY = useSharedValue(50);

  // Active circle tracking
  const activeCircle = useSharedValue<string | null>(null);

  // Calculate distance
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    'worklet';
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  // Circle overlap area calculation
  const getOverlapArea = (x1: number, y1: number, x2: number, y2: number, r: number) => {
    'worklet';
    const d = getDistance(x1, y1, x2, y2);
    if (d >= 2 * r) return 0;
    if (d === 0) return Math.PI * r * r;

    const part1 = 2 * r * r * Math.acos(d / (2 * r));
    const part2 = (d / 2) * Math.sqrt(4 * r * r - d * d);
    return part1 - part2;
  };

  // Math worklet to calculate Guna ratios
  useDerivedValue(() => {
    // 1. Calculate centroid
    const cx = (sattvaX.value + rajasX.value + tamasX.value) / 3;
    const cy = (sattvaY.value + rajasY.value + tamasY.value) / 3;

    // 2. Calculate overlap areas
    const overlapSR = getOverlapArea(sattvaX.value, sattvaY.value, rajasX.value, rajasY.value, RADIUS);
    const overlapST = getOverlapArea(sattvaX.value, sattvaY.value, tamasX.value, tamasY.value, RADIUS);
    const overlapRT = getOverlapArea(rajasX.value, rajasY.value, tamasX.value, tamasY.value, RADIUS);

    const overlapSattva = (overlapSR + overlapST) / 2;
    const overlapRajas = (overlapSR + overlapRT) / 2;
    const overlapTamas = (overlapST + overlapRT) / 2;

    // 3. Compute distance from origin (center of mix)
    const distS = getDistance(sattvaX.value, sattvaY.value, 0, 0);
    const distR = getDistance(rajasX.value, rajasY.value, 0, 0);
    const distT = getDistance(tamasX.value, tamasY.value, 0, 0);

    // Strengths: inversely proportional to distance, boosted by overlap
    const maxOverlap = Math.PI * RADIUS * RADIUS;
    const epsilon = 30; // smooths out the center weight

    const wSattva = (1 / (distS + epsilon)) * (1 + overlapSattva / maxOverlap);
    const wRajas = (1 / (distR + epsilon)) * (1 + overlapRajas / maxOverlap);
    const wTamas = (1 / (distT + epsilon)) * (1 + overlapTamas / maxOverlap);

    const sumWeights = wSattva + wRajas + wTamas;
    const sattva = wSattva / sumWeights;
    const rajas = wRajas / sumWeights;
    const tamas = wTamas / sumWeights;

    runOnJS(onRatioChange)({ sattva, rajas, tamas });
  });

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      'worklet';
      const touchX = event.x - CENTER;
      const touchY = event.y - CENTER;

      const dS = getDistance(touchX, touchY, sattvaX.value, sattvaY.value);
      const dR = getDistance(touchX, touchY, rajasX.value, rajasY.value);
      const dT = getDistance(touchX, touchY, tamasX.value, tamasY.value);

      const minDist = Math.min(dS, dR, dT);
      if (minDist < RADIUS + 15) {
        if (minDist === dS) activeCircle.value = 'sattva';
        else if (minDist === dR) activeCircle.value = 'rajas';
        else activeCircle.value = 'tamas';
      } else {
        activeCircle.value = null;
      }
    })
    .onUpdate((event) => {
      'worklet';
      if (!activeCircle.value) return;

      const newX = event.x - CENTER;
      const newY = event.y - CENTER;

      // Restrict circles to stay within the mixer canvas boundaries
      const maxDistance = CONTAINER_SIZE / 2 - 10;
      const distFromCenter = Math.sqrt(newX ** 2 + newY ** 2);
      
      let clampedX = newX;
      let clampedY = newY;
      
      if (distFromCenter > maxDistance) {
        clampedX = (newX / distFromCenter) * maxDistance;
        clampedY = (newY / distFromCenter) * maxDistance;
      }

      if (activeCircle.value === 'sattva') {
        sattvaX.value = clampedX;
        sattvaY.value = clampedY;
      } else if (activeCircle.value === 'rajas') {
        rajasX.value = clampedX;
        rajasY.value = clampedY;
      } else if (activeCircle.value === 'tamas') {
        tamasX.value = clampedX;
        tamasY.value = clampedY;
      }
    })
    .onEnd(() => {
      'worklet';
      activeCircle.value = null;
    });

  // Reanimated style/props mapping for SVGs
  const sattvaProps = useAnimatedProps(() => ({
    cx: CENTER + sattvaX.value,
    cy: CENTER + sattvaY.value,
  }));

  const rajasProps = useAnimatedProps(() => ({
    cx: CENTER + rajasX.value,
    cy: CENTER + rajasY.value,
  }));

  const tamasProps = useAnimatedProps(() => ({
    cx: CENTER + tamasX.value,
    cy: CENTER + tamasY.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.svgWrapper}>
            <Svg height={CONTAINER_SIZE} width={CONTAINER_SIZE}>
              <Defs>
                <RadialGradient id="sattvaGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <Stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.35" />
                </RadialGradient>
                <RadialGradient id="rajasGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
                  <Stop offset="100%" stopColor="#991B1B" stopOpacity="0.25" />
                </RadialGradient>
                <RadialGradient id="tamasGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0%" stopColor="#78350F" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#451A03" stopOpacity="0.3" />
                </RadialGradient>
              </Defs>

              {/* Bounding Outer Area border */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={CONTAINER_SIZE / 2 - 2}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Three Overlapping Circles */}
              <AnimatedCircle
                r={RADIUS}
                fill="url(#sattvaGrad)"
                animatedProps={sattvaProps}
              />
              <AnimatedCircle
                r={RADIUS}
                fill="url(#rajasGrad)"
                animatedProps={rajasProps}
              />
              <AnimatedCircle
                r={RADIUS}
                fill="url(#tamasGrad)"
                animatedProps={tamasProps}
              />
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  canvasContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  svgWrapper: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
  },
});
