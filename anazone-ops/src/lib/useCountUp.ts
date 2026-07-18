import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue.setValue(0);
    const listener = animatedValue.addListener(({ value: v }) => setValue(v));
    Animated.timing(animatedValue, { toValue: target, duration, useNativeDriver: false }).start();
    return () => animatedValue.removeListener(listener);
  }, [target, duration, animatedValue]);

  return value;
}
