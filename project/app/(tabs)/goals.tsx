import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/charts/ProgressBar';
import { Button } from '@/components/ui/Button';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { Target, Calendar, DollarSign, Shield, Plane, Laptop, TrendingUp, Plus, CreditCard as Edit, X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const goalIcons = [
  { name: 'Emergency Fund', icon: 'shield', color: '#10B981' },
  { name: 'Vacation', icon: 'plane', color: '#F59E0B' },
  { name: 'Electronics', icon: 'laptop', color: '#3B82F6' },
  { name: 'Investment', icon: 'trending-up', color: '#8B5CF6' },
  { name: 'General', icon: 'target', color: '#6B7280' },
];

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { goals, addGoal, updateGoal, deleteGoal, loading } = useSavingsGoals();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    target_date: '',
    icon: 'target',
    color: '#6B7280',
  });

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
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryCard: {
      marginBottom: 24,
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    goalCard: {
      marginBottom: 16,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    goalInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    goalIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    goalContent: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    goalTarget: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    goalStatus: {
      marginLeft: 16,
    },
    goalDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    goalDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    goalDetailText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginLeft: 6,
    },
    goalActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    actionButton: {
      flex: 1,
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
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    iconButton: {
      flex: 1,
      minWidth: '30%',
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    iconButtonInactive: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    iconButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      marginTop: 8,
      textAlign: 'center',
    },
    iconButtonTextActive: {
      color: theme.colors.primary,
    },
    iconButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
    },
  });

  const getGoalIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (iconName) {
      case 'shield':
        return <Shield {...iconProps} />;
      case 'plane':
        return <Plane {...iconProps} />;
      case 'laptop':
        return <Laptop {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      default:
        return <Target {...iconProps} />;
    }
  };

  const getGoalStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    
    if (percentage >= 100) {
      return { variant: 'success' as const, text: 'Completed' };
    } else if (percentage >= 75) {
      return { variant: 'success' as const, text: 'Almost There' };
    } else if (percentage >= 50) {
      return { variant: 'warning' as const, text: 'In Progress' };
    } else {
      return { variant: 'info' as const, text: 'Getting Started' };
    }
  };

  const calculateDaysLeft = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.target_amount || !formData.target_date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const targetAmount = parseFloat(formData.target_amount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const goalData = {
      title: formData.title,
      target_amount: targetAmount,
      current_amount: editingGoal?.current_amount || 0,
      target_date: formData.target_date,
      icon: formData.icon,
      color: formData.color,
    };

    let result;
    if (editingGoal) {
      result = await updateGoal(editingGoal.id, goalData);
    } else {
      result = await addGoal(goalData);
    }

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setShowModal(false);
      setEditingGoal(null);
      setFormData({
        title: '',
        target_amount: '',
        target_date: '',
        icon: 'target',
        color: '#6B7280',
      });
    }
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target_amount: goal.target_amount.toString(),
      target_date: goal.target_date,
      icon: goal.icon,
      color: goal.color,
    });
    setShowModal(true);
  };

  const handleAddMoney = (goal: any) => {
    Alert.prompt(
      'Add Money',
      'How much would you like to add to this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (amount) => {
            if (amount) {
              const addAmount = parseFloat(amount);
              if (!isNaN(addAmount) && addAmount > 0) {
                const newAmount = goal.current_amount + addAmount;
                const result = await updateGoal(goal.id, { current_amount: newAmount });
                if (result.error) {
                  Alert.alert('Error', result.error);
                }
              } else {
                Alert.alert('Error', 'Please enter a valid amount');
              }
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const completedGoals = goals.filter(goal => goal.current_amount >= goal.target_amount).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Savings Goals</Text>
              <Text style={styles.subtitle}>Track your financial objectives</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  ${totalSaved.toFixed(0)}
                </Text>
                <Text style={styles.summaryLabel}>Total Saved</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${totalTarget.toFixed(0)}</Text>
                <Text style={styles.summaryLabel}>Total Target</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                  {completedGoals}
                </Text>
                <Text style={styles.summaryLabel}>Completed</Text>
              </View>
            </View>
          </Card>
        </FadeInAnimation>

        {goals.map((goal, index) => {
          const status = getGoalStatus(goal.current_amount, goal.target_amount);
          const daysLeft = calculateDaysLeft(goal.target_date);
          
          return (
            <FadeInAnimation key={goal.id} direction="up" delay={200 + index * 100}>
              <Card style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={[
                      styles.goalIcon,
                      { backgroundColor: goal.color + '20' }
                    ]}>
                      {getGoalIcon(goal.icon, goal.color)}
                    </View>
                    <View style={styles.goalContent}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalTarget}>
                        Target: ${goal.target_amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.goalStatus}>
                    <Badge 
                      text={status.text} 
                      variant={status.variant}
                      size="small"
                    />
                  </View>
                </View>
                
                <ProgressBar
                  current={goal.current_amount}
                  target={goal.target_amount}
                  color={goal.color}
                  showPercentage={false}
                />
                
                <View style={styles.goalDetails}>
                  <View style={styles.goalDetailItem}>
                    <Calendar size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.goalDetailText}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </Text>
                  </View>
                  <View style={styles.goalDetailItem}>
                    <DollarSign size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.goalDetailText}>
                      ${(goal.target_amount - goal.current_amount).toFixed(2)} remaining
                    </Text>
                  </View>
                </View>
                
                <View style={styles.goalActions}>
                  <Button
                    title="Add Money"
                    variant="primary"
                    size="small"
                    style={styles.actionButton}
                    onPress={() => handleAddMoney(goal)}
                  />
                  <Button
                    title="Edit Goal"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    onPress={() => handleEdit(goal)}
                  />
                </View>
              </Card>
            </FadeInAnimation>
          );
        })}

        {goals.length === 0 && (
          <FadeInAnimation direction="up" delay={200}>
            <Card>
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Target size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.goalTarget, { marginTop: 16, textAlign: 'center' }]}>
                  No savings goals yet. Tap the + button to create your first goal!
                </Text>
              </View>
            </Card>
          </FadeInAnimation>
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingGoal ? 'Edit Goal' : 'New Savings Goal'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowModal(false);
                  setEditingGoal(null);
                  setFormData({
                    title: '',
                    target_amount: '',
                    target_date: '',
                    icon: 'target',
                    color: '#6B7280',
                  });
                }}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Goal Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Target Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.target_amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, target_amount: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Target Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.target_date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, target_date: text }))}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Icon</Text>
              <View style={styles.iconGrid}>
                {goalIcons.map((iconData) => (
                  <TouchableOpacity
                    key={iconData.icon}
                    style={[
                      styles.iconButton,
                      formData.icon === iconData.icon ? styles.iconButtonActive : styles.iconButtonInactive
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      icon: iconData.icon,
                      color: iconData.color
                    }))}
                  >
                    {getGoalIcon(iconData.icon, formData.icon === iconData.icon ? theme.colors.primary : theme.colors.textSecondary)}
                    <Text style={[
                      styles.iconButtonText,
                      formData.icon === iconData.icon ? styles.iconButtonTextActive : styles.iconButtonTextInactive
                    ]}>
                      {iconData.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                style={styles.modalButton}
                onPress={() => {
                  setShowModal(false);
                  setEditingGoal(null);
                  setFormData({
                    title: '',
                    target_amount: '',
                    target_date: '',
                    icon: 'target',
                    color: '#6B7280',
                  });
                }}
              />
              <Button
                title={editingGoal ? 'Update' : 'Create'}
                style={styles.modalButton}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}