import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}

export function Badge({ text, variant = 'info', size = 'medium' }: BadgeProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    badge: {
      paddingHorizontal: size === 'small' ? 8 : 12,
      paddingVertical: size === 'small' ? 4 : 6,
      borderRadius: size === 'small' ? 8 : 10,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: size === 'small' ? 12 : 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getVariantColor() }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}