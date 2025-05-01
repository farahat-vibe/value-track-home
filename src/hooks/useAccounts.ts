
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { accountService, NewAccount } from '@/services/accountService';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const createAccount = useMutation({
    mutationFn: (account: NewAccount) => accountService.createAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Account created",
        description: "Your account was created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create account",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<NewAccount> }) => 
      accountService.updateAccount(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Account updated",
        description: "Your account was updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update account",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteAccount = useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Account deleted",
        description: "Your account was deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete account",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    accounts: {
      data: accounts.data || [],
      isLoading: accounts.isLoading,
      isError: accounts.isError,
      error: accounts.error
    },
    createAccount,
    updateAccount,
    deleteAccount
  };
};
