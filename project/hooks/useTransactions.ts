import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching transactions for user:', user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched transactions:', data?.length || 0);
      setTransactions(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    // Create optimistic transaction for immediate UI update
    const optimisticTransaction: Transaction = {
      id: 'temp-' + Date.now(),
      user_id: user.id,
      ...transaction,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Adding optimistic transaction:', optimisticTransaction);

    // Update UI immediately (optimistic update)
    setTransactions(prev => {
      const newTransactions = [optimisticTransaction, ...prev];
      console.log('Updated transactions count (optimistic):', newTransactions.length);
      return newTransactions;
    });

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Transaction saved to database:', data);
      
      // Replace optimistic transaction with real one
      setTransactions(prev => {
        const updated = prev.map(t => t.id === optimisticTransaction.id ? data : t);
        console.log('Replaced optimistic transaction, count:', updated.length);
        return updated;
      });
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Error saving transaction:', err);
      // Remove optimistic transaction on error
      setTransactions(prev => {
        const filtered = prev.filter(t => t.id !== optimisticTransaction.id);
        console.log('Removed failed transaction, count:', filtered.length);
        return filtered;
      });
      return { data: null, error: err.message };
    }
  };

  const deleteTransaction = async (id: string) => {
    // Store the transaction for potential rollback
    const transactionToDelete = transactions.find(t => t.id === id);
    
    // Update UI immediately (optimistic update)
    setTransactions(prev => {
      const filtered = prev.filter(t => t.id !== id);
      console.log('Deleted transaction, remaining count:', filtered.length);
      return filtered;
    });

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      // Rollback on error
      if (transactionToDelete) {
        setTransactions(prev => {
          const restored = [transactionToDelete, ...prev];
          console.log('Restored failed delete, count:', restored.length);
          return restored;
        });
      }
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription
    if (user) {
      console.log('Setting up real-time subscription for user:', user.id);
      
      const subscription = supabase
        .channel('transactions')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Real-time update received:', payload.eventType, payload);
            
            // Handle real-time updates from other sources (not our optimistic updates)
            if (payload.eventType === 'INSERT') {
              setTransactions(prev => {
                // Check if transaction already exists to avoid duplicates
                const exists = prev.some(t => t.id === payload.new.id);
                if (!exists) {
                  console.log('Adding new transaction from real-time');
                  return [payload.new as Transaction, ...prev];
                }
                console.log('Transaction already exists, skipping');
                return prev;
              });
            } else if (payload.eventType === 'DELETE') {
              setTransactions(prev => {
                const filtered = prev.filter(t => t.id !== payload.old.id);
                console.log('Deleted transaction from real-time, remaining:', filtered.length);
                return filtered;
              });
            } else if (payload.eventType === 'UPDATE') {
              setTransactions(prev => {
                const updated = prev.map(t => 
                  t.id === payload.new.id ? payload.new as Transaction : t
                );
                console.log('Updated transaction from real-time');
                return updated;
              });
            }
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up real-time subscription');
        subscription.unsubscribe();
      };
    }
  }, [user, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}