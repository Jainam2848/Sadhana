import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, BookOpen, Award, User } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { View } from '@/tw';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabItemProps {
  IconComponent: any;
  isFocused: boolean;
  onPress: () => void;
  colors: any;
  index: number;
  activeIndex: number;
}

// Individual TabItem with glowing spotlight and bounce scaling
const TabItem: React.FC<TabItemProps> = ({
  IconComponent,
  isFocused,
  onPress,
  colors,
  index,
  activeIndex,
}) => {
  const distance = Math.abs(activeIndex - index);
  // Calculate spotlight opacity relative to distance from active tab to replicate spotlight hover spread
  const spotlightOpacity = isFocused ? 0.14 : Math.max(0, 0.07 - distance * 0.035);

  const opacityVal = useSharedValue(spotlightOpacity);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacityVal.value = withTiming(spotlightOpacity, { duration: 300 });
  }, [spotlightOpacity]);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.15, { damping: 10, stiffness: 150 }, () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 150 });
      });
    } else {
      scale.value = withSpring(1);
    }
  }, [isFocused]);

  const spotlightStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';
  const inactiveColorString = typeof colors.secondaryText === 'string' ? colors.secondaryText : '#6B5A41';

  return (
    <PressableAnimated
      className="relative items-center justify-center w-12 h-12"
      onPress={onPress}
      haptic="light"
      scaleTo={0.93}
    >
      {/* Spotlight backdrop glow */}
      <Animated.View
        style={[
          spotlightStyle,
          {
            position: 'absolute',
            top: -24,
            width: 48,
            height: 48,
            borderRadius: 9999,
            backgroundColor: accentColorString,
          },
        ]}
      />
      <Animated.View style={iconStyle}>
        <IconComponent
          size={22}
          color={isFocused ? accentColorString : inactiveColorString}
        />
      </Animated.View>
    </PressableAnimated>
  );
};

// Custom TabBar that aligns with Earth Ritual styles and implements spotlight slide interactions
function SpotlightTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const activeIndex = state.index;

  const numTabs = state.routes.length;
  const paddingX = 16;
  const containerWidth = SCREEN_WIDTH - paddingX * 2;
  const tabWidth = containerWidth / numTabs;

  // Reanimated value for horizontal indicator line
  const indicatorLeft = useSharedValue(0);

  useEffect(() => {
    indicatorLeft.value = withSpring(activeIndex * tabWidth + paddingX + (tabWidth - 48) / 2, {
      damping: 15,
      stiffness: 120,
    });
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
  }));

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  return (
    <View className="bg-background px-4 pb-4 pt-1 z-50">
      <View className="relative flex-row items-center h-16 bg-surface border border-surface-border rounded-xl shadow-sm px-2 justify-around overflow-hidden">
        {/* Sliding top indicator line */}
        <Animated.View
          style={[
            indicatorStyle,
            {
              position: 'absolute',
              top: 0,
              height: 2,
              width: 48,
              backgroundColor: accentColorString,
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconComponent =
            route.name === 'home'
              ? Home
              : route.name === 'library'
              ? BookOpen
              : route.name === 'rewards'
              ? Award
              : User;

          return (
            <TabItem
              key={route.key}
              IconComponent={IconComponent}
              isFocused={isFocused}
              onPress={onPress}
              colors={colors}
              index={index}
              activeIndex={activeIndex}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <SpotlightTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
