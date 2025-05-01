
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { accountService, NewAccount } from '@/services/accountService';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAccounts = () => {
  const queryClient = useQueryClient();
  
  // Get current user ID for creating accounts
  const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user.id;
  };

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const createAccount = useMutation({
    mutationFn: async (accountData: Omit<NewAccount, 'user_id'>) => {
      const userId = await getUserId();
      if (!userId) throw new Error("User not authenticated");
      
      return accountService.createAccount({
        ...accountData,
        user_id: userId
      });
    },
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
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<NewAccount, 'user_id'>> }) => 
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

  // Real-time subscription for accounts
  useEffect(() => {
    const channel = supabase
      .channel('accounts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'accounts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
