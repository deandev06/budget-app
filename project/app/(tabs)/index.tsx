import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import { Card } from '@/components/ui/Card';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { DollarSign, TrendingUp, TrendingDown, Eye, EyeOff, ArrowUpRight, ArrowDownRight, ChartBar as BarChart3, Receipt, ChevronRight } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { transactions, loading, refetch } = useTransactions();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Home tab focused - refreshing data');
      refetch();
    }, [refetch])
  );

  // Manual refresh function for pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Calculate totals and recent transactions - this will update immediately when transactions change
  const { totalIncome, totalExpenses, balance, recentTransactions } = useMemo(() => {
    console.log('Home: Recalculating balance with transactions:', transactions.length);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const bal = income - expenses;
    
    console.log('Home: Calculated - Income:', income, 'Expenses:', expenses, 'Balance:', bal);
    
    // Get recent transactions (last 3)
    const recent = transactions.slice(0, 3);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: bal,
      recentTransactions: recent,
    };
  }, [transactions]); // This dependency ensures everything updates when transactions change

  // Force re-render when transactions change
  useEffect(() => {
    console.log('Home: Transactions updated, count:', transactions.length);
  }, [transactions]);

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingTop: 20,
    },
    headerContent: {
      flex: 1,
    },
    greeting: {
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
    balanceCard: {
      marginBottom: 24,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    balanceLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    balanceAmount: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: balance >= 0 ? theme.colors.success : theme.colors.error,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    statIcon: {
      marginRight: 8,
    },
    statContent: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    statAmount: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    quickActionsContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 100,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    quickActionSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    recentTransactionsCard: {
      marginBottom: 40,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    transactionIcon: {
      marginRight: 12,
    },
    transactionContent: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    transactionCategory: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    incomeAmount: {
      color: theme.colors.success,
    },
    expenseAmount: {
      color: theme.colors.error,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      marginTop: 8,
    },
    viewAllText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginRight: 4,
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
    transactionCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.subtitle}>Here's your financial overview</Text>
              <Text style={styles.transactionCount}>
                {transactions.length} total transactions
              </Text>
            </View>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <Card style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? (
                  <Eye size={24} color={theme.colors.textSecondary} />
                ) : (
                  <EyeOff size={24} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {isBalanceVisible ? `$${balance.toFixed(2)}` : '••••••'}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <ArrowUpRight size={20} color={theme.colors.success} />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={[styles.statAmount, { color: theme.colors.success }]}>
                    ${totalIncome.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <ArrowDownRight size={20} color={theme.colors.error} />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={[styles.statAmount, { color: theme.colors.error }]}>
                    ${totalExpenses.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={200}>
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
                onPress={() => router.push('/charts')}
                activeOpacity={0.7}
              >
                <Card style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <BarChart3 size={32} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.quickActionTitle}>Charts</Text>
                  <Text style={styles.quickActionSubtitle}>View analytics</Text>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/transaction-history')}
                activeOpacity={0.7}
              >
                <Card style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <Receipt size={32} color={theme.colors.secondary} />
                  </View>
                  <Text style={styles.quickActionTitle}>Transactions</Text>
                  <Text style={styles.quickActionSubtitle}>Full history</Text>
                </Card>
              </TouchableOpacity>
            </View>
          </View>
        </FadeInAnimation>

        {recentTransactions.length > 0 ? (
          <FadeInAnimation direction="up" delay={300}>
            <Card style={styles.recentTransactionsCard}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {recentTransactions.map((transaction, index) => (
                <View key={`${transaction.id}-${transaction.created_at}-${index}`} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={24} color={theme.colors.success} />
                    ) : (
                      <ArrowDownRight size={24} color={theme.colors.error} />
                    )}
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/transaction-history')}
              >
                <Text style={styles.viewAllText}>View All Transactions</Text>
                <ChevronRight size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </Card>
          </FadeInAnimation>
        ) : (
          <FadeInAnimation direction="up" delay={300}>
            <Card style={styles.recentTransactionsCard}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Receipt size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.transactionCategory, { marginTop: 16, textAlign: 'center' }]}>
                  No transactions yet. Add your first transaction to get started!
                </Text>
                <TouchableOpacity 
                  style={[styles.viewAllButton, { marginTop: 16 }]}
                  onPress={() => router.push('/(tabs)/transactions')}
                >
                  <Text style={styles.viewAllText}>Add Transaction</Text>
                  <ChevronRight size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </FadeInAnimation>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}