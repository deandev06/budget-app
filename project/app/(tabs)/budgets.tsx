import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useBudgets } from '@/hooks/useBudgets';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/charts/ProgressBar';
import { Button } from '@/components/ui/Button';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { Wiggle } from '@/components/animations/Wiggle';
import { Target, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, TrendingUp, Utensils, Car, ShoppingBag, Gamepad2, Heart, Book, Briefcase, DollarSign, Plus, CreditCard as Edit, Trash2, X, Settings, ChevronDown, Calendar } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function BudgetsScreen() {
  const { theme } = useTheme();
  const { budgets, userSettings, updateBudget, addBudgetCategory, deleteBudgetCategory, updateUserSettings, updateSpentAmounts, loading } = useBudgets();
  const { categories } = useCategories();
  const { transactions } = useTransactions();
  const [wiggleOverBudget, setWiggleOverBudget] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [salaryDay, setSalaryDay] = useState('');

  // Auto-refresh when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Budgets tab focused - updating spent amounts');
      if (budgets.length > 0) {
        updateSpentAmounts();
      }
    }, [budgets.length, updateSpentAmounts])
  );

  // Update spent amounts when transactions change
  useEffect(() => {
    if (transactions.length > 0 && budgets.length > 0) {
      console.log('Transactions or budgets changed, updating spent amounts...');
      updateSpentAmounts();
    }
  }, [transactions.length, budgets.length, updateSpentAmounts]);

  // Initialize settings form when modal opens
  useEffect(() => {
    if (showSettingsModal && userSettings) {
      setMonthlyIncome(userSettings.monthly_income.toString());
      setSalaryDay(userSettings.salary_day.toString());
    }
  }, [showSettingsModal, userSettings]);

  useEffect(() => {
    // Trigger wiggle animation for over-budget items
    const hasOverBudget = budgets.some(budget => budget.spent > budget.limit_amount && budget.limit_amount > 0);
    if (hasOverBudget) {
      setWiggleOverBudget(true);
      setTimeout(() => setWiggleOverBudget(false), 500);
    }
  }, [budgets]);

  // Calculate days until next salary
  const getDaysUntilSalary = () => {
    if (!userSettings?.salary_day) return null;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    // Create next salary date
    let nextSalaryDate = new Date(currentYear, currentMonth, userSettings.salary_day);
    
    // If salary day has already passed this month, move to next month
    if (currentDay >= userSettings.salary_day) {
      nextSalaryDate = new Date(currentYear, currentMonth + 1, userSettings.salary_day);
    }
    
    // Calculate difference in days
    const timeDiff = nextSalaryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };

  const daysUntilSalary = getDaysUntilSalary();

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
    salaryCountdown: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginTop: 4,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    summaryCard: {
      marginBottom: 24,
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    totalProgress: {
      marginTop: 16,
    },
    salaryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      padding: 12,
      backgroundColor: theme.colors.primary + '10',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
    },
    salaryInfoText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    budgetCard: {
      marginBottom: 16,
    },
    budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    budgetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    budgetIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    budgetContent: {
      flex: 1,
    },
    budgetCategory: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    budgetAmount: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    budgetActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    formSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    categorySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    categorySelectorText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: selectedCategory ? theme.colors.text : theme.colors.textSecondary,
      flex: 1,
    },
    categoryPicker: {
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      marginTop: 8,
    },
    categoryOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoryOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      marginLeft: 12,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
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
      marginTop: 16,
    },
    debugInfo: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  const getCategoryIcon = (categoryName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (categoryName.toLowerCase()) {
      case 'food & dining':
        return <Utensils {...iconProps} />;
      case 'transportation':
        return <Car {...iconProps} />;
      case 'shopping':
        return <ShoppingBag {...iconProps} />;
      case 'entertainment':
        return <Gamepad2 {...iconProps} />;
      case 'healthcare':
        return <Heart {...iconProps} />;
      case 'education':
        return <Book {...iconProps} />;
      case 'housing':
      case 'utilities':
        return <Briefcase {...iconProps} />;
      default:
        return <DollarSign {...iconProps} />;
    }
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    if (limit === 0) {
      return { variant: 'info' as const, text: 'No Limit Set', icon: Target };
    }
    
    const percentage = (spent / limit) * 100;
    
    if (percentage >= 100) {
      return { variant: 'error' as const, text: 'Over Budget', icon: AlertTriangle };
    } else if (percentage >= 80) {
      return { variant: 'warning' as const, text: 'Close to Limit', icon: AlertTriangle };
    } else {
      return { variant: 'success' as const, text: 'On Track', icon: CheckCircle };
    }
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setNewCategoryLimit(budget.limit_amount.toString());
    setShowCategoryModal(true);
  };

  const handleDeleteBudget = (budget: any) => {
    Alert.alert(
      'Delete Budget Category',
      `Are you sure you want to delete "${budget.category}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteBudgetCategory(budget.id);
            if (result.error) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleSaveCategory = async () => {
    if (editingBudget) {
      // Update existing budget
      const limit = parseFloat(newCategoryLimit) || 0;
      const result = await updateBudget(editingBudget.id, { limit_amount: limit });
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        setShowCategoryModal(false);
        setEditingBudget(null);
        setNewCategoryLimit('');
      }
    } else {
      // Add new category
      if (!selectedCategory) {
        Alert.alert('Error', 'Please select a category');
        return;
      }
      
      const limit = parseFloat(newCategoryLimit) || 0;
      const result = await addBudgetCategory(selectedCategory, limit);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        setShowCategoryModal(false);
        setSelectedCategory('');
        setNewCategoryLimit('');
      }
    }
  };

  const handleSaveSettings = async () => {
    const income = parseFloat(monthlyIncome) || 0;
    const day = parseInt(salaryDay) || 1;
    
    if (day < 1 || day > 31) {
      Alert.alert('Error', 'Salary day must be between 1 and 31');
      return;
    }

    const result = await updateUserSettings({
      monthly_income: income,
      salary_day: day,
    });

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setShowSettingsModal(false);
      Alert.alert('Success', 'Settings updated successfully!');
    }
  };

  // Get available categories that don't already have budgets
  const availableCategories = categories.filter(cat => 
    !budgets.some(budget => budget.category === cat.name)
  );

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit_amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const onTrackBudgets = budgets.filter(budget => 
    budget.limit_amount > 0 && budget.spent < budget.limit_amount * 0.8
  ).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading budgets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Budget Overview</Text>
              <Text style={styles.subtitle}>
                {userSettings?.monthly_income ? 
                  `Monthly Income: $${userSettings.monthly_income.toFixed(0)}` : 
                  'Set up your monthly budget'
                }
              </Text>
              {daysUntilSalary !== null && userSettings?.salary_day && (
                <Text style={styles.salaryCountdown}>
                  {daysUntilSalary === 0 
                    ? '🎉 Salary day is today!' 
                    : daysUntilSalary === 1 
                    ? '💰 Salary tomorrow!' 
                    : `💰 ${daysUntilSalary} days until next salary`
                  }
                </Text>
              )}
              <Text style={styles.debugInfo}>
                {budgets.length} budgets • {transactions.length} transactions
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowSettingsModal(true)}
              >
                <Settings size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Plus size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${totalSpent.toFixed(0)}</Text>
                <Text style={styles.summaryLabel}>Total Spent</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${totalBudget.toFixed(0)}</Text>
                <Text style={styles.summaryLabel}>Total Budget</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  {onTrackBudgets}
                </Text>
                <Text style={styles.summaryLabel}>On Track</Text>
              </View>
            </View>
            {totalBudget > 0 && (
              <View style={styles.totalProgress}>
                <ProgressBar
                  current={totalSpent}
                  target={totalBudget}
                  label="Overall Budget"
                  color={totalSpent > totalBudget ? theme.colors.error : theme.colors.primary}
                />
              </View>
            )}
            {daysUntilSalary !== null && userSettings?.salary_day && (
              <View style={styles.salaryInfo}>
                <Calendar size={16} color={theme.colors.primary} />
                <Text style={styles.salaryInfoText}>
                  Next salary: {userSettings.salary_day}{userSettings.salary_day === 1 ? 'st' : userSettings.salary_day === 2 ? 'nd' : userSettings.salary_day === 3 ? 'rd' : 'th'} of next month
                </Text>
              </View>
            )}
          </Card>
        </FadeInAnimation>

        <Text style={styles.sectionTitle}>Budget Categories</Text>

        {budgets.map((budget, index) => {
          const status = getBudgetStatus(budget.spent, budget.limit_amount);
          const isOverBudget = budget.spent > budget.limit_amount && budget.limit_amount > 0;
          
          return (
            <FadeInAnimation key={budget.id} direction="up" delay={200 + index * 100}>
              <Wiggle trigger={isOverBudget && wiggleOverBudget}>
                <Card style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetInfo}>
                      <View style={[
                        styles.budgetIcon,
                        { backgroundColor: theme.colors.primary + '20' }
                      ]}>
                        {getCategoryIcon(budget.category, theme.colors.primary)}
                      </View>
                      <View style={styles.budgetContent}>
                        <Text style={styles.budgetCategory}>{budget.category}</Text>
                        <Text style={styles.budgetAmount}>
                          ${budget.spent.toFixed(2)} of ${budget.limit_amount.toFixed(2)}
                        </Text>
                        <Text style={styles.debugInfo}>
                          ID: {budget.id.slice(0, 8)}... • Updated: {new Date(budget.updated_at).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.budgetActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditBudget(budget)}
                      >
                        <Edit size={16} color={theme.colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteBudget(budget)}
                      >
                        <Trash2 size={16} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {budget.limit_amount > 0 ? (
                    <ProgressBar
                      current={budget.spent}
                      target={budget.limit_amount}
                      color={isOverBudget ? theme.colors.error : theme.colors.primary}
                      showPercentage={false}
                    />
                  ) : (
                    <View style={{ alignItems: 'center', padding: 16 }}>
                      <Text style={styles.budgetAmount}>
                        No budget limit set. Tap edit to set a limit.
                      </Text>
                    </View>
                  )}
                </Card>
              </Wiggle>
            </FadeInAnimation>
          );
        })}

        {budgets.length === 0 && (
          <FadeInAnimation direction="up" delay={200}>
            <Card>
              <View style={styles.emptyState}>
                <Target size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No budget categories yet. Tap the + button to create your first budget!
                </Text>
              </View>
            </Card>
          </FadeInAnimation>
        )}
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBudget ? 'Edit Budget' : 'New Budget Category'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowCategoryModal(false);
                  setEditingBudget(null);
                  setSelectedCategory('');
                  setNewCategoryLimit('');
                  setShowCategoryPicker(false);
                }}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {!editingBudget && (
              <View style={styles.formSection}>
                <Text style={styles.label}>Select Category</Text>
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <Text style={styles.categorySelectorText}>
                    {selectedCategory || 'Choose from your existing categories...'}
                  </Text>
                  <ChevronDown size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                
                {showCategoryPicker && (
                  <ScrollView style={styles.categoryPicker} nestedScrollEnabled>
                    {availableCategories.length > 0 ? (
                      availableCategories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={styles.categoryOption}
                          onPress={() => {
                            setSelectedCategory(category.name);
                            setShowCategoryPicker(false);
                          }}
                        >
                          {getCategoryIcon(category.name, theme.colors.text)}
                          <Text style={styles.categoryOptionText}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.categoryOption}>
                        <Text style={styles.categoryOptionText}>
                          No available categories. Create categories in the Transactions tab first.
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.label}>Monthly Budget Limit</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={newCategoryLimit}
                onChangeText={setNewCategoryLimit}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                style={styles.modalButton}
                onPress={() => {
                  setShowCategoryModal(false);
                  setEditingBudget(null);
                  setSelectedCategory('');
                  setNewCategoryLimit('');
                  setShowCategoryPicker(false);
                }}
              />
              <Button
                title={editingBudget ? 'Update' : 'Create'}
                style={styles.modalButton}
                onPress={handleSaveCategory}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Budget Settings</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSettingsModal(false)}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Monthly Income</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Salary Day (1-31)</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={theme.colors.textSecondary}
                value={salaryDay}
                onChangeText={setSalaryDay}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowSettingsModal(false)}
              />
              <Button
                title="Save"
                style={styles.modalButton}
                onPress={handleSaveSettings}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}