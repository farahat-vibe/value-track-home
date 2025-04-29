
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <h3 className="text-2xl font-bold">$12,560.45</h3>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
            <h3 className="text-2xl font-bold">$8,240.00</h3>
            <p className="text-xs text-green-500 mt-1">+5% from last month</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
            <h3 className="text-2xl font-bold">$5,680.20</h3>
            <p className="text-xs text-red-500 mt-1">+12% from last month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
