import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    toggleTheme();
  };

  const styles = StyleSheet.create({
    container: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {theme.isDark ? (
        <Sun size={24} color={theme.colors.text} />
      ) : (
        <Moon size={24} color={theme.colors.text} />
      )}
    </AnimatedTouchableOpacity>
  );
}