import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from '@/tw';

export default function Index() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <ActivityIndicator size="large" color="#C44B22" />
    </View>
  );
}
