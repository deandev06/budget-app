import React from 'react';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
}

export function FadeInAnimation({ 
  children, 
  direction = 'none', 
  delay = 0, 
  duration = 600 
}: FadeInProps) {
  const getAnimation = () => {
    const baseAnimation = {
      up: FadeInUp,
      down: FadeInDown,
      left: FadeInLeft,
      right: FadeInRight,
      none: FadeIn,
    }[direction];

    return baseAnimation.delay(delay).duration(duration);
  };

  return (
    <Animated.View entering={getAnimation()}>
      {children}
    </Animated.View>
  );
}