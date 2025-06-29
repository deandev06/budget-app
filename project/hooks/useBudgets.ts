import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
  spent: number;
  month: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  monthly_income: number;
  salary_day: number;
  budget_period_start: string;
  created_at: string;
  updated_at: string;
}

export function useBudgets() {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7); // YYYY-MM format
  };

  const fetchBudgets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const currentMonth = getCurrentMonth();
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .order('category', { ascending: true });

      if (error) throw error;

      console.log('Fetched budgets:', data?.length || 0);
      setBudgets(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        // Create default settings
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            monthly_income: 0,
            salary_day: 1,
            budget_period_start: new Date().toISOString().split('T')[0],
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setUserSettings(newSettings);
      } else {
        setUserSettings(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user settings:', err);
    }
  }, [user]);

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setBudgets(prev => prev.map(budget => budget.id === id ? data : budget));
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const addBudgetCategory = async (categoryName: string, limitAmount: number = 0) => {
    if (!user) return { error: 'User not authenticated' };

    // Check if category exists in the categories table
    const categoryExists = categories.some(cat => cat.name === categoryName);
    if (!categoryExists) {
      return { error: 'Category must exist in your categories list first. Please add it in the transactions tab.' };
    }

    try {
      const currentMonth = getCurrentMonth();
      
      // Check if budget already exists for this category and month
      const existingBudget = budgets.find(b => b.category === categoryName);
      if (existingBudget) {
        return { error: 'Budget already exists for this category' };
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category: categoryName,
          limit_amount: limitAmount,
          spent: 0,
          month: currentMonth,
        })
        .select()
        .single();

      if (error) throw error;
      
      setBudgets(prev => [...prev, data]);
      
      // Calculate spent amount for this new budget
      await updateSpentAmountForCategory(data.id, categoryName);
      
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteBudgetCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBudgets(prev => prev.filter(budget => budget.id !== id));
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !userSettings) return { error: 'User not authenticated or settings not loaded' };

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserSettings(data);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  // Function to update spent amount for a specific category
  const updateSpentAmountForCategory = async (budgetId: string, categoryName: string) => {
    if (!user) return;

    try {
      const currentMonth = getCurrentMonth();
      
      // Get all expense transactions for this category in current month
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .eq('category', categoryName)
        .gte('date', `${currentMonth}-01`)
        .lt('date', `${currentMonth}-32`);

      if (transError) throw transError;

      // Calculate total spent for this category
      const spent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      console.log(`Updating spent amount for ${categoryName}: $${spent}`);

      // Update the budget with calculated spent amount
      await updateBudget(budgetId, { spent });

    } catch (err: any) {
      console.error('Error updating spent amount for category:', err);
    }
  };

  // Function to update spent amounts for all budgets when transactions change
  const updateSpentAmounts = useCallback(async () => {
    if (!user || budgets.length === 0) return;

    console.log('Updating spent amounts for all budgets...');

    try {
      const currentMonth = getCurrentMonth();
      
      // Get all expense transactions for current month
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('category, amount, type')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', `${currentMonth}-01`)
        .lt('date', `${currentMonth}-32`);

      if (transError) throw transError;

      // Calculate spent amounts by category
      const spentByCategory: { [key: string]: number } = {};
      
      transactions?.forEach(transaction => {
        const category = transaction.category;
        if (!spentByCategory[category]) {
          spentByCategory[category] = 0;
        }
        spentByCategory[category] += Number(transaction.amount);
      });

      console.log('Spent by category:', spentByCategory);

      // Update each budget with calculated spent amount
      const updatePromises = budgets.map(async (budget) => {
        const spent = spentByCategory[budget.category] || 0;
        if (Math.abs(spent - budget.spent) > 0.01) { // Only update if there's a meaningful difference
          console.log(`Updating ${budget.category}: ${budget.spent} -> ${spent}`);
          return updateBudget(budget.id, { spent });
        }
        return Promise.resolve({ data: null, error: null });
      });

      await Promise.all(updatePromises);
      console.log('Finished updating spent amounts');

    } catch (err: any) {
      console.error('Error updating spent amounts:', err);
    }
  }, [user, budgets, updateBudget]);

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchUserSettings();
    }
  }, [user, fetchBudgets, fetchUserSettings]);

  // Set up real-time subscription for budgets
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('budgets')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'budgets',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Budget real-time update:', payload.eventType);
          fetchBudgets();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchBudgets]);

  // Set up real-time subscription for transactions to update spent amounts
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('transactions_for_budgets')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Transaction change detected, updating budgets...');
          // Small delay to ensure transaction is fully processed
          setTimeout(() => {
            updateSpentAmounts();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, updateSpentAmounts]);

  return {
    budgets,
    userSettings,
    loading,
    error,
    updateBudget,
    addBudgetCategory,
    deleteBudgetCategory,
    updateUserSettings,
    updateSpentAmounts,
    refetch: fetchBudgets,
  };
}