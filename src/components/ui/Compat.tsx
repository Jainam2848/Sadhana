import SvgComponent, { Path as PathComponent, Circle as CircleComponent, G as GComponent } from 'react-native-svg';
import { Video as ExpoVideo } from 'expo-av';
import SliderComponent from '@react-native-community/slider';

/**
 * React 19 compatibility wrappers for class-based third-party elements
 * that throw JSX element validation warnings due to outdated typing schemas.
 */
export const Svg = SvgComponent as any;
export const Path = PathComponent as any;
export const Circle = CircleComponent as any;
export const G = GComponent as any;
export const Video = ExpoVideo as any;
export const Slider = SliderComponent as any;

