import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  created_at: string;
}

const defaultCategories: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  // Expense categories
  { name: 'Food & Dining', icon: 'utensils', color: '#F59E0B', type: 'expense' },
  { name: 'Transportation', icon: 'car', color: '#3B82F6', type: 'expense' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#EF4444', type: 'expense' },
  { name: 'Housing', icon: 'home', color: '#10B981', type: 'expense' },
  { name: 'Entertainment', icon: 'gamepad-2', color: '#8B5CF6', type: 'expense' },
  { name: 'Healthcare', icon: 'heart', color: '#EC4899', type: 'expense' },
  { name: 'Education', icon: 'book', color: '#6366F1', type: 'expense' },
  { name: 'Utilities', icon: 'dollar-sign', color: '#059669', type: 'expense' },
  
  // Income categories
  { name: 'Salary', icon: 'briefcase', color: '#10B981', type: 'income' },
  { name: 'Freelance', icon: 'dollar-sign', color: '#0891B2', type: 'income' },
  { name: 'Investment', icon: 'trending-up', color: '#7C3AED', type: 'income' },
  { name: 'Business', icon: 'briefcase', color: '#059669', type: 'income' },
  { name: 'Other Income', icon: 'dollar-sign', color: '#6366F1', type: 'income' },
];

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data.length === 0) {
        // Create default categories for new user
        const { data: newCategories, error: insertError } = await supabase
          .from('categories')
          .insert(
            defaultCategories.map(cat => ({
              ...cat,
              user_id: user.id,
            }))
          )
          .select();

        if (insertError) throw insertError;
        setCategories(newCategories || []);
      } else {
        setCategories(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription
    if (user) {
      const subscription = supabase
        .channel('categories')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'categories',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchCategories();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return {
    categories,
    loading,
    error,
    addCategory,
    refetch: fetchCategories,
  };
}