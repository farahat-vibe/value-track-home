
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link to="/income" className="flex items-center">
            <div className="mr-3 bg-green-100 p-2 rounded-full dark:bg-green-900/20">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span>Add Income</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link to="/expenses" className="flex items-center">
            <div className="mr-3 bg-red-100 p-2 rounded-full dark:bg-red-900/20">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <span>Add Expense</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link to="/accounts" className="flex items-center">
            <div className="mr-3 bg-blue-100 p-2 rounded-full dark:bg-blue-900/20">
              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span>New Account</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link to="/budgets" className="flex items-center">
            <div className="mr-3 bg-purple-100 p-2 rounded-full dark:bg-purple-900/20">
              <BarChart2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>Create Budget</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
