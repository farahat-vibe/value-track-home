
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { transactionService, NewTransaction } from '@/services/transactionService';

export const useTransactions = (filters?: {
  transaction_type?: 'income' | 'expense';
  account_id?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const queryClient = useQueryClient();

  const transactions = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
  });

  const createTransaction = useMutation({
    mutationFn: (transaction: NewTransaction) => transactionService.createTransaction(transaction),
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
    mutationFn: ({ id, updates }: { id: string, updates: Partial<NewTransaction> }) => 
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
