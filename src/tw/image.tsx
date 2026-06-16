import { useCssElement } from "react-native-css";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Image as RNImage } from "expo-image";

const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);

const CSSImage = React.forwardRef<any, React.ComponentProps<typeof AnimatedExpoImage>>((props, ref) => {
  // @ts-expect-error: Remap objectFit style to contentFit property
  const { objectFit, objectPosition, ...style } =
    StyleSheet.flatten(props.style) || {};

  return (
    <AnimatedExpoImage
      ref={ref}
      contentFit={objectFit}
      contentPosition={objectPosition}
      {...props}
      source={
        typeof props.source === "string" ? { uri: props.source } : props.source
      }
      // @ts-expect-error: Style is remapped above
      style={style}
    />
  );
});

export type ImageProps = React.ComponentProps<typeof CSSImage> & { className?: string };

export const Image = React.forwardRef<any, ImageProps>((props, ref) => {
  return useCssElement(CSSImage as any, { ...props, ref } as any, { className: "style" }) as any;
});

Image.displayName = "CSS(Image)";
