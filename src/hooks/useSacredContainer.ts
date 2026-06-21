import { useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import SpatialAudio from '../../modules/spatial-audio';

export const useSacredContainer = () => {
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    // Activate spatial audio category and routing natively
    try {
      SpatialAudio.enableSpatialAudio(true);
    } catch (e) {
      console.warn('[useSacredContainer] Failed to enable Spatial Audio:', e);
    }

    let subscription: any = null;

    // Check gyroscope availability for high-end parallax effect
    Gyroscope.isAvailableAsync()
      .then((isAvailable) => {
        if (!isAvailable) {
          console.warn('[useSacredContainer] Gyroscope is not available on this device');
          return;
        }

        // Set update interval to 16ms to achieve a silky 60fps refresh rate
        Gyroscope.setUpdateInterval(16);

        subscription = Gyroscope.addListener((data) => {
          // data.x (rotation around X axis, tilt forward/backward) -> controls vertical tilt
          // data.y (rotation around Y axis, tilt left/right) -> controls horizontal tilt
          // We apply a scale and clamp to a maximum of 5 degrees for a premium, non-dizzying depth effect
          const targetX = Math.max(-5, Math.min(5, data.y * 7));
          const targetY = Math.max(-5, Math.min(5, data.x * 7));

          tiltX.value = withSpring(targetX, { damping: 15, stiffness: 85 });
          tiltY.value = withSpring(targetY, { damping: 15, stiffness: 85 });
        });
      })
      .catch((error) => {
        console.warn('[useSacredContainer] Error initializing Gyroscope:', error);
      });

    return () => {
      if (subscription) {
        subscription.remove();
      }
      try {
        SpatialAudio.enableSpatialAudio(false);
      } catch (e) {
        console.warn('[useSacredContainer] Failed to disable Spatial Audio:', e);
      }
    };
  }, []);

  return { tiltX, tiltY };
};
export default useSacredContainer;
