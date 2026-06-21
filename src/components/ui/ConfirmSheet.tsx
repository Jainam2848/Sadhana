import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Dimensions } from 'react-native';
import { View, Text } from '@/tw';
import { Heading, Body } from '@/components/ui/Typography';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const [showModal, setShowModal] = useState(visible);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      // Animate in
      translateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.ease), // Tier 1 motion
      });
      backdropOpacity.value = withTiming(0.6, {
        duration: 280,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Animate out
      translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: 280,
        easing: Easing.out(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.ease),
      }, (finished) => {
        if (finished) {
          runOnJS(setShowModal)(false);
        }
      });
    }
  }, [visible]);

  if (!showModal) return null;

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={onCancel}
      animationType="none"
    >
      <View className="flex-1 justify-end items-center relative">
        {/* Dimmed backdrop */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, backdropStyle, { backgroundColor: '#000000' }]}
        >
          <PressableAnimated
            haptic="none"
            style={{ flex: 1 }}
            onPress={onCancel}
            accessibilityLabel="Dismiss sheet"
          />
        </Animated.View>

        {/* Bottom Sheet Container */}
        <Animated.View
          style={[sheetStyle]}
          className="w-full bg-[#1C1610] rounded-t-[20px] border-t border-white/10 p-6 pb-10 max-w-md shadow-2xl z-50"
        >
          {/* Grab handle */}
          <View className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

          <Heading className="text-white text-xl font-bold mb-2">
            {title}
          </Heading>
          <Body className="text-white/70 text-sm mb-6 leading-relaxed">
            {message}
          </Body>

          {/* Actions */}
          <View className="flex-row gap-3">
            <PressableAnimated
              haptic="medium"
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-full items-center active:bg-white/10"
              onPress={onCancel}
              accessibilityLabel={cancelLabel}
            >
              <Text className="text-white/90 font-sans font-bold text-sm">
                {cancelLabel}
              </Text>
            </PressableAnimated>

            <PressableAnimated
              haptic="medium"
              className="flex-1 py-3 bg-accent-terracotta rounded-full items-center active:opacity-90"
              onPress={onConfirm}
              accessibilityLabel={confirmLabel}
            >
              <Text className="text-white font-sans font-bold text-sm">
                {confirmLabel}
              </Text>
            </PressableAnimated>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
