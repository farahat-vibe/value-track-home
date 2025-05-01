
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { transactionService, NewTransaction } from '@/services/transactionService';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTransactions = (filters?: {
  transaction_type?: 'income' | 'expense';
  account_id?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const queryClient = useQueryClient();

  // Get current user ID for creating transactions
  const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user.id;
  };

  const transactions = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
  });

  const createTransaction = useMutation({
    mutationFn: async (transactionData: Omit<NewTransaction, 'user_id'>) => {
      const userId = await getUserId();
      if (!userId) throw new Error("User not authenticated");
      
      return transactionService.createTransaction({
        ...transactionData,
        user_id: userId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transaction added",
        description: "Your transaction was added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<NewTransaction, 'user_id'>> }) => 
      transactionService.updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transaction updated",
        description: "Your transaction was updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transaction deleted",
        description: "Your transaction was deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Real-time subscription for transactions
  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    transactions: {
      data: transactions.data || [],
      isLoading: transactions.isLoading,
      isError: transactions.isError,
      error: transactions.error
    },
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};
