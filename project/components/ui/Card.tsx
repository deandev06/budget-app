import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export function Card({ children, style, delay = 0 }: CardProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(600)}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}