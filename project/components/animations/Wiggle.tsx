import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming,
  Easing 
} from 'react-native-reanimated';

interface WiggleProps {
  children: React.ReactNode;
  trigger: boolean;
  intensity?: number;
}

export function Wiggle({ children, trigger, intensity = 10 }: WiggleProps) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-intensity, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(intensity, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(-intensity, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(intensity, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [trigger, intensity]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}