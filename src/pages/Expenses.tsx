
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Plus, TrendingDown, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransaction } from "@/services/transactionService";
import { useLocation } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Expenses = () => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();
  const defaultCategory = path !== 'expenses' ? path : undefined;
  
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newExpense, setNewExpense] = useState<NewTransaction>({
    amount: 0,
    description: "",
    category: "Purchases",
    subcategory: "",
    account_id: "",
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_type: "expense",
    is_recurring: false,
  });

  const { accounts } = useAccounts();
  const { transactions, createTransaction, deleteTransaction } = useTransactions({ 
    transaction_type: 'expense',
    category: selectedCategory
  });

  // Update category when URL path changes
  useEffect(() => {
    if (path !== 'expenses' && path) {
      setSelectedCategory(path);
    }
  }, [path]);

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description || !newExpense.account_id || !newExpense.subcategory) {
      return;
    }

    await createTransaction.mutateAsync({
      ...newExpense,
      transaction_date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id);
  };

  const resetForm = () => {
    setNewExpense({
      amount: 0,
      description: "",
      category: "Purchases",
      subcategory: "",
      account_id: "",
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_type: "expense",
      is_recurring: false,
    });
    setDate(undefined);
  };

  const categories = [
    { value: "Purchases", label: "Purchases" },
    { value: "Bills", label: "Bills" },
    { value: "Subscriptions", label: "Subscriptions" },
    { value: "Debts", label: "Debts" },
    { value: "Other", label: "Other" },
  ];

  const subcategories = {
    Purchases: [
      { value: "Groceries", label: "Groceries" },
      { value: "Dining", label: "Dining Out" },
      { value: "Shopping", label: "Shopping" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Transportation", label: "Transportation" },
      { value: "Other", label: "Other" },
    ],
    Bills: [
      { value: "Housing", label: "Housing" },
      { value: "Utilities", label: "Utilities" },
      { value: "Insurance", label: "Insurance" },
      { value: "Phone", label: "Phone/Internet" },
      { value: "Other", label: "Other" },
    ],
    Subscriptions: [
      { value: "Entertainment", label: "Entertainment" },
      { value: "Software", label: "Software" },
      { value: "Health", label: "Health & Fitness" },
      { value: "News", label: "News & Information" },
      { value: "Other", label: "Other" },
    ],
    Debts: [
      { value: "Loans", label: "Loans" },
      { value: "Credit", label: "Credit Cards" },
      { value: "Mortgage", label: "Mortgage" },
      { value: "Other", label: "Other" },
    ],
    Other: [{ value: "Other", label: "Other" }],
  };

  const totalExpenses = transactions.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
          <CardDescription>Your total expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            ${totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full" value={selectedCategory || "all"}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" onClick={() => setSelectedCategory(undefined)}>All</TabsTrigger>
          <TabsTrigger value="Purchases" onClick={() => setSelectedCategory("Purchases")}>Purchases</TabsTrigger>
          <TabsTrigger value="Bills" onClick={() => setSelectedCategory("Bills")}>Bills</TabsTrigger>
          <TabsTrigger value="Subscriptions" onClick={() => setSelectedCategory("Subscriptions")}>Subscriptions</TabsTrigger>
          <TabsTrigger value="Debts" onClick={() => setSelectedCategory("Debts")}>Debts</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {transactions.isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.isError ? (
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-red-500">
                  Error loading transactions: {transactions.error?.message || "Unknown error"}
                </p>
              </div>
            </Card>
          ) : transactions.data?.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No expenses found. Add one to get started.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {transactions.data?.map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.transaction_date), "MMM dd, yyyy")} •{" "}
                        {expense.category} • {expense.subcategory}
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="font-medium text-red-600 dark:text-red-400">
                        -${Number(expense.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.accounts?.name} • {expense.is_recurring ? "Recurring" : "One-time"}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this expense? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Grocery Shopping"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, category: value, subcategory: "" })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategory" className="text-right">
                Subcategory
              </Label>
              <Select
                value={newExpense.subcategory}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, subcategory: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories[newExpense.category as keyof typeof subcategories]?.map(
                    (subcat) => (
                      <SelectItem key={subcat.value} value={subcat.value}>
                        {subcat.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                Account
              </Label>
              <Select
                value={newExpense.account_id}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, account_id: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.data?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurring" className="text-right">
                Recurring
              </Label>
              <Select
                value={newExpense.is_recurring ? "yes" : "no"}
                onValueChange={(value) =>
                  setNewExpense({
                    ...newExpense,
                    is_recurring: value === "yes",
                    recurring_frequency: value === "yes" ? "monthly" : undefined,
                    recurring_end_date: value === "yes" ? undefined : null,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Is this recurring?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newExpense.is_recurring && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Select
                    value={newExpense.recurring_frequency || "monthly"}
                    onValueChange={(value: any) =>
                      setNewExpense({
                        ...newExpense,
                        recurring_frequency: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAddExpense} disabled={createTransaction.isPending}>
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
