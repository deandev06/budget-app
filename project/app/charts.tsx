import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import { BalanceChart } from '../components/charts/BalanceChart';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ChartsScreen() {
  const { theme } = useTheme();
  const { transactions, loading } = useTransactions();

  // Calculate monthly balance changes - this will update when transactions change
  const monthlyBalanceData = useMemo(() => {
    console.log('Charts: Recalculating with transactions:', transactions.length);
    
    // Generate monthly data for the current year
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyStats = months.map(month => {
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === currentYear && 
               transactionDate.toLocaleString('default', { month: 'long' }) === month;
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const netChange = monthIncome - monthExpenses;

      return {
        month,
        income: monthIncome,
        expenses: monthExpenses,
        netChange,
        isPositive: netChange >= 0,
      };
    });

    return monthlyStats;
  }, [transactions]); // This dependency ensures charts update when transactions change

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      paddingTop: 20,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 16,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading charts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Analytics</Text>
              <Text style={styles.subtitle}>Your financial insights</Text>
            </View>
          </View>
        </FadeInAnimation>

        <BalanceChart data={monthlyBalanceData} />
      </ScrollView>
    </SafeAreaView>
  );
}