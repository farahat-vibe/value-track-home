
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, ArrowDown, Calendar } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <Button className="w-full flex items-center justify-start gap-2 bg-income hover:bg-income/90">
            <ArrowUp className="h-4 w-4" />
            Add Income
          </Button>
          
          <Button className="w-full flex items-center justify-start gap-2 bg-expense hover:bg-expense/90">
            <ArrowDown className="h-4 w-4" />
            Add Expense
          </Button>

          <Button className="w-full flex items-center justify-start gap-2" variant="outline">
            <Calendar className="h-4 w-4" />
            Create Budget
          </Button>

          <Button className="w-full flex items-center justify-start gap-2" variant="secondary">
            <Plus className="h-4 w-4" />
            New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
