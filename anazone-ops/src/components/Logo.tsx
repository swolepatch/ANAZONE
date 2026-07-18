import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 28 }: LogoProps) {
  // Multiple screens stay mounted at once (React Navigation keeps visited
  // tabs alive), and on web that means multiple <Logo> SVGs in the same DOM.
  // A shared gradient id there breaks every instance after the first.
  const gradientId = `anazoneMark-${useId()}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id={gradientId} x1="10" y1="90" x2="90" y2="10">
          <Stop offset="0" stopColor="#2FE8DC" />
          <Stop offset="1" stopColor="#FF3EA5" />
        </LinearGradient>
      </Defs>
      <Path
        d="M50 10 L90 90 L10 90 Z M32 65 L68 65"
        stroke={`url(#${gradientId})`}
        strokeWidth={8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
