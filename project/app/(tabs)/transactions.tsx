import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { DollarSign, Plus, Minus, Utensils, Car, ShoppingBag, Chrome as Home, Gamepad2, Heart, Book, Briefcase, TrendingUp, Palette } from 'lucide-react-native';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { addTransaction, loading: transactionLoading } = useTransactions();
  const { categories, addCategory, loading: categoriesLoading } = useCategories();
  const [activeTab, setActiveTab] = useState<'transaction' | 'category'>('transaction');
  
  // Transaction form state
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [categoryIcon, setCategoryIcon] = useState('dollar-sign');
  const [categoryColor, setCategoryColor] = useState('#3B82F6');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const categoryIcons = [
    { name: 'dollar-sign', icon: DollarSign },
    { name: 'utensils', icon: Utensils },
    { name: 'car', icon: Car },
    { name: 'shopping-bag', icon: ShoppingBag },
    { name: 'home', icon: Home },
    { name: 'gamepad-2', icon: Gamepad2 },
    { name: 'heart', icon: Heart },
    { name: 'book', icon: Book },
    { name: 'briefcase', icon: Briefcase },
    { name: 'trending-up', icon: TrendingUp },
  ];

  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#6366F1', '#059669', '#0891B2', '#7C3AED'
  ];

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
      marginBottom: 24,
      paddingTop: 20,
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
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabButtonInactive: {
      backgroundColor: 'transparent',
    },
    tabButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    tabButtonTextActive: {
      color: '#FFFFFF',
    },
    tabButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    formCard: {
      marginBottom: 24,
    },
    formSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 8,
    },
    optionalLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 8,
    },
    optionalText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      marginHorizontal: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    typeButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    typeButtonInactive: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    typeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 8,
    },
    typeButtonTextActive: {
      color: theme.colors.primary,
    },
    typeButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    amountInput: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      textAlign: 'center',
    },
    descriptionInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryButton: {
      width: '30%',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    categoryButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    categoryButtonInactive: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    categoryButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      marginTop: 6,
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    categoryButtonTextActive: {
      color: theme.colors.primary,
    },
    categoryButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    addButton: {
      marginTop: 16,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    iconButton: {
      width: 60,
      height: 60,
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
      backgroundColor: theme.colors.surface,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorButtonActive: {
      borderColor: theme.colors.text,
    },
  });

  const handleAddTransaction = async () => {
    // Only require amount and category, description is optional
    if (!amount || !category) {
      Alert.alert('Error', 'Please enter amount and select a category');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    const result = await addTransaction({
      type: transactionType,
      amount: numAmount,
      category,
      description: description.trim() || `${transactionType === 'income' ? 'Income' : 'Expense'} - ${category}`,
      date: new Date().toISOString().split('T')[0],
    });

    setIsSubmitting(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Success', 'Transaction added successfully!');
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setIsAddingCategory(true);

    const result = await addCategory({
      name: categoryName,
      icon: categoryIcon,
      color: categoryColor,
      type: categoryType,
    });

    setIsAddingCategory(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Success', 'Category added successfully!');
      setCategoryName('');
      setCategoryIcon('dollar-sign');
      setCategoryColor('#3B82F6');
    }
  };

  const getCategoryIcon = (iconName: string, color: string) => {
    const iconData = categoryIcons.find(i => i.name === iconName);
    const IconComponent = iconData?.icon || DollarSign;
    return <IconComponent size={24} color={color} />;
  };

  const filteredCategories = categories.filter(cat => cat.type === transactionType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New</Text>
            <Text style={styles.subtitle}>Create transactions and categories</Text>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'transaction' ? styles.tabButtonActive : styles.tabButtonInactive
              ]}
              onPress={() => setActiveTab('transaction')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'transaction' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
              ]}>
                Transaction
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'category' ? styles.tabButtonActive : styles.tabButtonInactive
              ]}
              onPress={() => setActiveTab('category')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'category' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
              ]}>
                Category
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInAnimation>

        {activeTab === 'transaction' ? (
          <FadeInAnimation direction="up" delay={200}>
            <Card style={styles.formCard}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Transaction Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      transactionType === 'expense' ? styles.typeButtonActive : styles.typeButtonInactive
                    ]}
                    onPress={() => {
                      setTransactionType('expense');
                      setCategory('');
                    }}
                  >
                    <Minus size={20} color={transactionType === 'expense' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      transactionType === 'expense' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                    ]}>
                      Expense
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      transactionType === 'income' ? styles.typeButtonActive : styles.typeButtonInactive
                    ]}
                    onPress={() => {
                      setTransactionType('income');
                      setCategory('');
                    }}
                  >
                    <Plus size={20} color={transactionType === 'income' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      transactionType === 'income' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                    ]}>
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="$0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                  {filteredCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        category === cat.name ? styles.categoryButtonActive : styles.categoryButtonInactive
                      ]}
                      onPress={() => setCategory(cat.name)}
                    >
                      {getCategoryIcon(cat.icon, category === cat.name ? theme.colors.primary : theme.colors.textSecondary)}
                      <Text style={[
                        styles.categoryButtonText,
                        category === cat.name ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.optionalLabel}>Description</Text>
                  <Text style={styles.optionalText}>(optional)</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Enter description (optional)..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Button
                title={isSubmitting ? "Adding..." : "Add Transaction"}
                onPress={handleAddTransaction}
                disabled={isSubmitting}
                style={styles.addButton}
              />
            </Card>
          </FadeInAnimation>
        ) : (
          <FadeInAnimation direction="up" delay={200}>
            <Card style={styles.formCard}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Category Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      categoryType === 'expense' ? styles.typeButtonActive : styles.typeButtonInactive
                    ]}
                    onPress={() => setCategoryType('expense')}
                  >
                    <Minus size={20} color={categoryType === 'expense' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      categoryType === 'expense' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                    ]}>
                      Expense
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      categoryType === 'income' ? styles.typeButtonActive : styles.typeButtonInactive
                    ]}
                    onPress={() => setCategoryType('income')}
                  >
                    <Plus size={20} color={categoryType === 'income' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      categoryType === 'income' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                    ]}>
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category name..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={categoryName}
                  onChangeText={setCategoryName}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {categoryIcons.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <TouchableOpacity
                        key={iconData.name}
                        style={[
                          styles.iconButton,
                          categoryIcon === iconData.name ? styles.iconButtonActive : styles.iconButtonInactive
                        ]}
                        onPress={() => setCategoryIcon(iconData.name)}
                      >
                        <IconComponent 
                          size={24} 
                          color={categoryIcon === iconData.name ? theme.colors.primary : theme.colors.textSecondary} 
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                  {categoryColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        categoryColor === color && styles.colorButtonActive
                      ]}
                      onPress={() => setCategoryColor(color)}
                    />
                  ))}
                </View>
              </View>

              <Button
                title={isAddingCategory ? "Adding..." : "Add Category"}
                onPress={handleAddCategory}
                disabled={isAddingCategory}
                style={styles.addButton}
              />
            </Card>
          </FadeInAnimation>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}