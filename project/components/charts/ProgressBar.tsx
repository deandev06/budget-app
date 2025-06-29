import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  delay?: number;
}

export function ProgressBar({ 
  current, 
  target, 
  label, 
  color, 
  showPercentage = true,
  delay = 0 
}: ProgressBarProps) {
  const { theme } = useTheme();
  const progress = Math.min(current / target, 1);
  const percentage = Math.round(progress * 100);
  
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withDelay(delay, withSpring(progress, { duration: 1000 }));
  }, [current, target, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    percentage: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: color || theme.colors.primary,
    },
    progressTrack: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: color || theme.colors.primary,
      borderRadius: 4,
    },
    amountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    amount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{percentage}%</Text>
          )}
        </View>
      )}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>${current.toFixed(2)}</Text>
        <Text style={styles.amount}>${target.toFixed(2)}</Text>
      </View>
    </View>
  );
}