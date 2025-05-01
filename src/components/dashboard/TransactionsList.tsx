
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function TransactionsList() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Get transactions from the past 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  const { transactions } = useTransactions({
    start_date: startDate,
    end_date: endDate
  });

  const filteredTransactions = transactions.data ? transactions.data
    .filter(transaction => {
      if (activeTab === "all") return true;
      if (activeTab === "income") return transaction.transaction_type === "income";
      if (activeTab === "expense") return transaction.transaction_type === "expense";
      return true;
    })
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 5) : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your activity in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {transactions.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No transactions found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === "income" 
                        ? "bg-green-100 dark:bg-green-900/20" 
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}>
                      {transaction.transaction_type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(transaction.transaction_date), "MMM dd, yyyy")} • {transaction.category}
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.transaction_type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {transaction.transaction_type === "income" ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-right">
                  <Button variant="link" asChild size="sm">
                    <Link to={activeTab === "income" ? "/income" : activeTab === "expense" ? "/expenses" : "/accounts"}>
                      View all
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
