import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { Card } from '@/components/ui/Card';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TransactionHistoryScreen() {
  const { theme } = useTheme();
  const { transactions, deleteTransaction, loading } = useTransactions();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, filterType]);

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || 'dollar-sign';
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await deleteTransaction(id);
    if (result.error) {
      console.error('Error deleting transaction:', result.error);
    }
  };

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
    searchContainer: {
      marginBottom: 16,
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 24,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },
    filterButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    filterButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    transactionsCard: {
      marginBottom: 40,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
    },
    transactionIcon: {
      marginRight: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    transactionContent: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    transactionDetails: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginRight: 12,
    },
    incomeAmount: {
      color: theme.colors.success,
    },
    expenseAmount: {
      color: theme.colors.error,
    },
    deleteButton: {
      padding: 8,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
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
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    summaryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

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
              <Text style={styles.title}>Transaction History</Text>
              <Text style={styles.subtitle}>{filteredTransactions.length} transactions</Text>
            </View>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <View style={styles.searchIcon}>
                <Search size={20} color={theme.colors.textSecondary} />
              </View>
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search transactions..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={200}>
          <View style={styles.filterContainer}>
            {(['all', 'income', 'expense'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filterType === type ? styles.filterButtonActive : styles.filterButtonInactive
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterType === type ? styles.filterButtonTextActive : styles.filterButtonTextInactive
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={300}>
          <Card style={styles.transactionsCard}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  +${totalIncome.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Income</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                  -${totalExpenses.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Expenses</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Net</Text>
              </View>
            </View>

            {filteredTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery || filterType !== 'all' 
                    ? 'No transactions match your search criteria'
                    : 'No transactions yet'
                  }
                </Text>
              </View>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.type === 'income' ? theme.colors.success + '20' : theme.colors.error + '20' }
                  ]}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={20} color={theme.colors.success} />
                    ) : (
                      <ArrowDownRight size={20} color={theme.colors.error} />
                    )}
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDetails}>
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.created_at).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </Card>
        </FadeInAnimation>
      </ScrollView>
    </SafeAreaView>
  );
}