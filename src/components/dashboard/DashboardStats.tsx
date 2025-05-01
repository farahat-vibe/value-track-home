
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStats() {
  const { accounts } = useAccounts();
  
  // Get current month transactions
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { transactions: incomeTransactions } = useTransactions({
    transaction_type: 'income',
    start_date: startOfMonth,
    end_date: endOfMonth
  });
  
  const { transactions: expenseTransactions } = useTransactions({
    transaction_type: 'expense',
    start_date: startOfMonth,
    end_date: endOfMonth
  });
  
  const totalBalance = accounts.data?.reduce((sum, account) => sum + Number(account.balance), 0) || 0;
  const totalIncome = incomeTransactions.data?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;
  const totalExpense = expenseTransactions.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  
  const isLoading = accounts.isLoading || incomeTransactions.isLoading || expenseTransactions.isLoading;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {isLoading ? (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/20">
                    <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <h2 className={`text-2xl font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-500'}`}>
                      ${totalBalance.toFixed(2)}
                    </h2>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Income ({format(new Date(startOfMonth), "MMM yyyy")})
                    </p>
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
                      ${totalIncome.toFixed(2)}
                    </h2>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Expenses ({format(new Date(startOfMonth), "MMM yyyy")})
                    </p>
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">
                      ${totalExpense.toFixed(2)}
                    </h2>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
