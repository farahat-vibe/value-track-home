
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { subMonths, format } from "date-fns";
import { useState, useMemo } from "react";

export function BalanceChart() {
  const [timeRange, setTimeRange] = useState("6m");
  
  const today = new Date();
  const monthsToShow = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;
  
  const startDate = subMonths(today, monthsToShow).toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  const { transactions } = useTransactions({
    start_date: startDate,
    end_date: endDate
  });
  
  const { accounts } = useAccounts();

  const chartData = useMemo(() => {
    if (!transactions.data) return [];
    
    // Prepare monthly data points
    const dataMap = new Map();
    
    // Initialize data points for each month
    for (let i = 0; i <= monthsToShow; i++) {
      const date = subMonths(today, monthsToShow - i);
      const monthKey = format(date, "yyyy-MM");
      dataMap.set(monthKey, {
        month: format(date, "MMM"),
        income: 0,
        expense: 0,
        net: 0
      });
    }
    
    // Aggregate transaction data by month
    transactions.data.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      const monthKey = format(transactionDate, "yyyy-MM");
      
      if (dataMap.has(monthKey)) {
        const monthData = dataMap.get(monthKey);
        
        if (transaction.transaction_type === "income") {
          monthData.income += Number(transaction.amount);
        } else {
          monthData.expense += Number(transaction.amount);
        }
        
        monthData.net = monthData.income - monthData.expense;
        dataMap.set(monthKey, monthData);
      }
    });
    
    return Array.from(dataMap.values());
  }, [transactions.data, monthsToShow, today]);

  // Calculate total balance
  const totalBalance = accounts.data?.reduce((sum, account) => sum + Number(account.balance), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Balance Overview</CardTitle>
            <CardDescription>Income vs Expenses</CardDescription>
          </div>
          <div className="space-x-1">
            <button 
              onClick={() => setTimeRange("3m")}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === "3m" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              3M
            </button>
            <button 
              onClick={() => setTimeRange("6m")}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === "6m" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              6M
            </button>
            <button 
              onClick={() => setTimeRange("12m")}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === "12m" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              12M
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.isLoading || accounts.isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-muted-foreground text-sm mb-1">Current Balance</h3>
              <p className={`text-2xl font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${totalBalance.toFixed(2)}
              </p>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month"
                    axisLine={false}
                    tickLine={false} 
                    tickMargin={5}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.375rem',
                    }}
                    labelStyle={{
                      color: 'var(--foreground)',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                    }}
                    itemStyle={{
                      padding: '0.125rem 0',
                      fontSize: '0.875rem',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorNet)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-muted-foreground">Expense</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">Net</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
