
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

const recentTransactions: Transaction[] = [
  {
    id: 1,
    description: "Salary",
    amount: 5000,
    type: "income",
    category: "Paycheck",
    date: "Apr 28, 2025",
  },
  {
    id: 2,
    description: "Grocery Shopping",
    amount: 120.5,
    type: "expense",
    category: "Food",
    date: "Apr 27, 2025",
  },
  {
    id: 3,
    description: "Netflix Subscription",
    amount: 14.99,
    type: "expense",
    category: "Entertainment",
    date: "Apr 25, 2025",
  },
  {
    id: 4,
    description: "Freelance Work",
    amount: 750,
    type: "income",
    category: "Side Hustle",
    date: "Apr 24, 2025",
  },
  {
    id: 5,
    description: "Gas Station",
    amount: 45.75,
    type: "expense",
    category: "Transportation",
    date: "Apr 22, 2025",
  },
];

export function TransactionsList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <a 
          href="#" 
          className="text-sm text-primary hover:underline"
        >
          View All
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                  transaction.type === "income" ? "bg-income-light" : "bg-expense-light"
                }`}>
                  {transaction.type === "income" ? (
                    <ArrowUp className="h-5 w-5 text-income" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-expense" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className={`font-medium ${
                transaction.type === "income" 
                  ? "text-income" 
                  : "text-expense"
              }`}>
                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
