import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";

export function QuickActions() {
  const handleAddIncome = () => console.log("Add income clicked");
  const handleAddExpense = () => console.log("Add expense clicked");
  const handleCreateBudget = () => console.log("Create budget clicked");
  const handleNewAccount = () => console.log("New account clicked");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <Button 
            className="w-full flex items-center justify-start gap-2"
            variant="default"
            onClick={handleAddIncome}
          >
            <TrendingUp className="h-4 w-4" />
            Add Income
          </Button>
          
          <Button 
            className="w-full flex items-center justify-start gap-2"
            variant="secondary"
            onClick={handleAddExpense}
          >
            <TrendingDown className="h-4 w-4" />
            Add Expense
          </Button>

          <Button 
            className="w-full flex items-center justify-start gap-2" 
            variant="outline"
            onClick={handleCreateBudget}
          >
            <Calendar className="h-4 w-4" />
            Create Budget
          </Button>

          <Button 
            className="w-full flex items-center justify-start gap-2" 
            variant="outline"
            onClick={handleNewAccount}
          >
            <Plus className="h-4 w-4" />
            New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
