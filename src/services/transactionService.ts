
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Transaction = Tables<'transactions'>;
export type NewTransaction = {
  account_id: string;
  amount: number;
  description: string;
  transaction_date: string;
  category: string;
  subcategory?: string;
  transaction_type: 'income' | 'expense';
  is_recurring?: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  recurring_end_date?: string | null;
  tags?: string[] | null;
  user_id: string;
};

export const transactionService = {
  getTransactions: async (filters?: {
    transaction_type?: 'income' | 'expense';
    account_id?: string;
    category?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    let query = supabase.from('transactions').select('*, accounts(name)').order('transaction_date', { ascending: false });

    if (filters?.transaction_type) {
      query = query.eq('transaction_type', filters.transaction_type);
    }
    
    if (filters?.account_id) {
      query = query.eq('account_id', filters.account_id);
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.start_date) {
      query = query.gte('transaction_date', filters.start_date);
    }
    
    if (filters?.end_date) {
      query = query.lte('transaction_date', filters.end_date);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  getTransaction: async (id: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, accounts(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  createTransaction: async (transaction: NewTransaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateTransaction: async (id: string, updates: Partial<NewTransaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteTransaction: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
