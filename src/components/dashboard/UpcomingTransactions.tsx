import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingDown } from "lucide-react";

type UpcomingTransaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  daysLeft: number;
};

const upcomingTransactions: UpcomingTransaction[] = [
  {
    id: 1,
    description: "Rent Payment",
    amount: 1800,
    date: "May 1, 2025",
    category: "Housing",
    daysLeft: 2,
  },
  {
    id: 2,
    description: "Internet Bill",
    amount: 79.99,
    date: "May 5, 2025",
    category: "Utilities",
    daysLeft: 6,
  },
  {
    id: 3,
    description: "Car Insurance",
    amount: 145.5,
    date: "May 10, 2025",
    category: "Insurance",
    daysLeft: 11,
  },
];

export function UpcomingTransactions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                  <TrendingDown className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-muted-foreground">
                  -${transaction.amount.toFixed(2)}
                </p>
                <Badge variant={transaction.daysLeft <= 3 ? "destructive" : "secondary"} className="text-xs mt-1">
                  {transaction.daysLeft === 1 ? 'Tomorrow' : `${transaction.daysLeft} days`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
