import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MonthlyBalanceData {
  month: string;
  income: number;
  expenses: number;
  netChange: number;
  isPositive: boolean;
}

interface BalanceChartProps {
  data: MonthlyBalanceData[];
  title?: string;
}

const screenWidth = Dimensions.get('window').width;

export function BalanceChart({ data, title = 'Monthly Balance Changes' }: BalanceChartProps) {
  const { theme } = useTheme();

  // Process data to ensure we have meaningful chart data
  const processedData = useMemo(() => {
    console.log('BalanceChart: Processing data with', data.length, 'months');
    
    // Always show the last 6 months structure for consistency
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Generate last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'long' });
      months.push(monthName);
    }
    
    // Map data to months, using actual data if available, otherwise 0
    const monthlyStats = months.map(month => {
      const monthData = data.find(item => item.month === month);
      return {
        month,
        income: monthData?.income || 0,
        expenses: monthData?.expenses || 0,
        netChange: monthData?.netChange || 0,
        isPositive: monthData?.isPositive || true,
      };
    });

    const displayMonths = monthlyStats.map(item => item.month.substring(0, 3));
    
    // Create chart data - always show bars even if empty
    const positiveData = monthlyStats.map(item => 
      item.isPositive && item.netChange > 0 ? item.netChange : 1
    );
    const negativeData = monthlyStats.map(item => 
      !item.isPositive && item.netChange < 0 ? Math.abs(item.netChange) : 1
    );
    
    const totalSaved = monthlyStats.reduce((sum, item) => sum + (item.isPositive ? item.netChange : 0), 0);
    const totalLost = monthlyStats.reduce((sum, item) => sum + (item.isPositive ? 0 : Math.abs(item.netChange)), 0);
    const hasRealData = totalSaved > 0 || totalLost > 0;

    console.log('BalanceChart: Final data - Saved:', totalSaved, 'Lost:', totalLost, 'Has real data:', hasRealData);

    return {
      months: displayMonths,
      positiveData,
      negativeData,
      totalSaved,
      totalLost,
      hasRealData,
      monthlyStats
    };
  }, [data]);

  const chartData = {
    labels: processedData.months,
    datasets: [
      {
        data: processedData.positiveData,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green for positive
        strokeWidth: 2,
      },
      {
        data: processedData.negativeData,
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for negative
        strokeWidth: 2,
      },
    ],
    legend: ['Money Saved', 'Money Lost'],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => {
      const hex = theme.colors.text.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    labelColor: (opacity = 1) => {
      const hex = theme.colors.text.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
    },
    barPercentage: 0.7,
    fillShadowGradient: theme.colors.primary,
    fillShadowGradientOpacity: 0.3,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginVertical: 10,
      shadowColor: theme.isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    chartContainer: {
      alignItems: 'center',
      overflow: 'hidden',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    summaryAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      marginTop: 4,
    },
    savedAmount: {
      color: theme.colors.success,
    },
    lostAmount: {
      color: theme.colors.error,
    },
    netAmount: {
      color: theme.colors.text,
    },
    dataStatus: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyDataNote: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      fontStyle: 'italic',
    },
  });

  const netAmount = processedData.totalSaved - processedData.totalLost;

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dataStatus}>
        Showing last 6 months {processedData.hasRealData ? 'with transaction data' : '(empty - add transactions to see data)'}
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={Math.max(screenWidth - 80, processedData.months.length * 80)}
            height={220}
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisLabel="$"
            yAxisSuffix=""
            fromZero
            showBarTops={false}
            withInnerLines={true}
          />
        </View>
      </ScrollView>

      {!processedData.hasRealData && (
        <Text style={styles.emptyDataNote}>
          Chart shows empty bars. Add income and expense transactions to see your monthly balance changes.
        </Text>
      )}

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Saved</Text>
          <Text style={[styles.summaryAmount, styles.savedAmount]}>
            ${processedData.totalSaved.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Lost</Text>
          <Text style={[styles.summaryAmount, styles.lostAmount]}>
            ${processedData.totalLost.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Change</Text>
          <Text style={[
            styles.summaryAmount, 
            netAmount >= 0 ? styles.savedAmount : styles.lostAmount
          ]}>
            ${netAmount.toFixed(0)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}