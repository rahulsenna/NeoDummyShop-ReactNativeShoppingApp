import Ionicons from 'react-native-vector-icons/Ionicons';
import { type IconProps } from 'react-native-vector-icons/icon';

export default function TabBarIcon({ style, ...rest }: IconProps) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}

