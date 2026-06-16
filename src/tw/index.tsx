import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

import { Link as RouterLink } from "expo-router";
import Animated from "react-native-reanimated";
import React from "react";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TouchableHighlight as RNTouchableHighlight,
  TextInput as RNTextInput,
  StyleSheet,
} from "react-native";

// CSS-enabled Link
export const Link = React.forwardRef<any, React.ComponentProps<typeof RouterLink> & { className?: string }>(
  (props, ref) => {
    return useCssElement(RouterLink as any, { ...props, ref } as any, { className: "style" }) as any;
  }
);
(Link as any).Trigger = RouterLink.Trigger;
(Link as any).Menu = RouterLink.Menu;
(Link as any).MenuAction = RouterLink.MenuAction;
(Link as any).Preview = RouterLink.Preview;

// CSS Variable hook
export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

// View
export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const View = React.forwardRef<RNView, ViewProps>((props, ref) => {
  return useCssElement(RNView as any, { ...props, ref } as any, { className: "style" }) as any;
});
View.displayName = "CSS(View)";

// Text
export const Text = React.forwardRef<RNText, React.ComponentProps<typeof RNText> & { className?: string }>(
  (props, ref) => {
    return useCssElement(RNText as any, { ...props, ref } as any, { className: "style" }) as any;
  }
);
Text.displayName = "CSS(Text)";

// ScrollView
export const ScrollView = React.forwardRef<RNScrollView, React.ComponentProps<typeof RNScrollView> & {
  className?: string;
  contentContainerClassName?: string;
}>((props, ref) => {
  return useCssElement(RNScrollView as any, { ...props, ref } as any, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  }) as any;
});
ScrollView.displayName = "CSS(ScrollView)";

// Pressable
export const Pressable = React.forwardRef<any, React.ComponentProps<typeof RNPressable> & { className?: string }>(
  (props, ref) => {
    return useCssElement(RNPressable as any, { ...props, ref } as any, { className: "style" }) as any;
  }
);
Pressable.displayName = "CSS(Pressable)";

// TextInput
export const TextInput = React.forwardRef<RNTextInput, React.ComponentProps<typeof RNTextInput> & { className?: string }>(
  (props, ref) => {
    return useCssElement(RNTextInput as any, { ...props, ref } as any, { className: "style" }) as any;
  }
);
TextInput.displayName = "CSS(TextInput)";

// AnimatedScrollView
export const AnimatedScrollView = React.forwardRef<any, React.ComponentProps<typeof Animated.ScrollView> & {
  className?: string;
  contentClassName?: string;
  contentContainerClassName?: string;
}>((props, ref) => {
  return useCssElement(Animated.ScrollView as any, { ...props, ref } as any, {
    className: "style",
    contentClassName: "contentContainerStyle",
    contentContainerClassName: "contentContainerStyle",
  }) as any;
});
AnimatedScrollView.displayName = "CSS(AnimatedScrollView)";

// TouchableHighlight with underlayColor extraction
function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight>
) {
  const { underlayColor, ...style } = (StyleSheet.flatten(props.style) as any) || {};
  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = React.forwardRef<any, React.ComponentProps<typeof RNTouchableHighlight>>(
  (props, ref) => {
    return useCssElement(XXTouchableHighlight as any, { ...props, ref } as any, { className: "style" }) as any;
  }
);
TouchableHighlight.displayName = "CSS(TouchableHighlight)";

export { Image } from "./image";
