
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { format, addDays } from "date-fns";

export function UpcomingTransactions() {
  // Get recurring transactions that are due in the next 7 days
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const startDate = today.toISOString().split('T')[0];
  const endDate = nextWeek.toISOString().split('T')[0];
  
  const { transactions } = useTransactions({
    start_date: startDate,
    end_date: endDate
  });
  
  // Filter for recurring transactions
  const upcomingTransactions = transactions.data ? 
    transactions.data
      .filter(transaction => transaction.is_recurring)
      .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
      .slice(0, 5) : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Transactions
        </CardTitle>
        <CardDescription>Due in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : upcomingTransactions.length === 0 ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No upcoming transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {format(new Date(transaction.transaction_date), "dd")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.transaction_date), "EEEE, MMM dd")}
                  </p>
                </div>
                <div className={`text-sm font-medium ${
                  transaction.transaction_type === "income" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {transaction.transaction_type === "income" ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
