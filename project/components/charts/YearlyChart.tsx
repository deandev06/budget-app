import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface YearlyChartProps {
  data: MonthlyData[];
  title?: string;
}

const screenWidth = Dimensions.get('window').width;

export function YearlyChart({ data, title = 'Monthly Income vs Expenses' }: YearlyChartProps) {
  const { theme } = useTheme();

  // Process data to ensure we have meaningful chart data
  const processedData = useMemo(() => {
    console.log('YearlyChart: Processing data with', data.length, 'months');
    
    // Filter out months with no data for a cleaner chart
    const filteredData = data.filter(item => item.income > 0 || item.expenses > 0);
    
    console.log('YearlyChart: Filtered data has', filteredData.length, 'months with transactions');
    
    // If we have data, use it; otherwise show last 6 months structure
    const displayData = filteredData.length > 0 ? filteredData : data.slice(-6);
    
    // Ensure we have at least some data to display
    if (displayData.length === 0) {
      return {
        months: ['Jan', 'Feb', 'Mar'],
        incomeData: [1, 1, 1],
        expenseData: [1, 1, 1],
        totalIncome: 0,
        totalExpenses: 0,
        hasRealData: false
      };
    }

    const months = displayData.map(item => item.month.substring(0, 3));
    // Ensure minimum values for chart visibility
    const incomeData = displayData.map(item => Math.max(item.income, 1));
    const expenseData = displayData.map(item => Math.max(item.expenses, 1));
    
    const totalIncome = displayData.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = displayData.reduce((sum, item) => sum + item.expenses, 0);
    const hasRealData = totalIncome > 0 || totalExpenses > 0;

    console.log('YearlyChart: Final data - Income:', totalIncome, 'Expenses:', totalExpenses, 'Has real data:', hasRealData);

    return {
      months,
      incomeData,
      expenseData,
      totalIncome,
      totalExpenses,
      hasRealData
    };
  }, [data]);

  const chartData = {
    labels: processedData.months,
    datasets: [
      {
        data: processedData.incomeData,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green for income
        strokeWidth: 2,
      },
      {
        data: processedData.expenseData,
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for expenses
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expenses'],
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
    incomeAmount: {
      color: theme.colors.success,
    },
    expenseAmount: {
      color: theme.colors.error,
    },
    netAmount: {
      color: theme.colors.text,
    },
    noDataContainer: {
      alignItems: 'center',
      padding: 40,
    },
    noDataText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    dataStatus: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
  });

  const netAmount = processedData.totalIncome - processedData.totalExpenses;

  if (!processedData.hasRealData) {
    return (
      <Animated.View entering={FadeInDown.delay(300)} style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No transaction data available yet.{'\n\n'}Add some transactions to see your monthly trends and financial insights!
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dataStatus}>
        Showing {processedData.months.length} months with transaction data
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

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryAmount, styles.incomeAmount]}>
            ${processedData.totalIncome.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expenseAmount]}>
            ${processedData.totalExpenses.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Amount</Text>
          <Text style={[
            styles.summaryAmount, 
            netAmount >= 0 ? styles.incomeAmount : styles.expenseAmount
          ]}>
            ${netAmount.toFixed(0)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}