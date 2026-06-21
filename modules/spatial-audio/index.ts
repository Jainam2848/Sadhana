import { requireNativeModule } from 'expo-modules-core';

interface SpatialAudioModuleType {
  enableSpatialAudio(enable: boolean): void;
}

const SpatialAudio = requireNativeModule<SpatialAudioModuleType>('SpatialAudio');

export default SpatialAudio;
