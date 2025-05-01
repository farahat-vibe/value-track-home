
import { useState } from "react";
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
import { CalendarIcon, Plus, TrendingUp, Loader2, Trash2 } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Income = () => {
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();
  
  const [newIncome, setNewIncome] = useState<NewTransaction>({
    amount: 0,
    description: "",
    category: "Salary",
    subcategory: "",
    account_id: "",
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_type: "income",
    is_recurring: false,
  });

  const { accounts } = useAccounts();
  const { transactions, createTransaction, deleteTransaction } = useTransactions({ 
    transaction_type: 'income' 
  });

  const handleAddIncome = async () => {
    if (!newIncome.amount || !newIncome.description || !newIncome.account_id) {
      return;
    }

    await createTransaction.mutateAsync({
      ...newIncome,
      transaction_date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id);
  };

  const resetForm = () => {
    setNewIncome({
      amount: 0,
      description: "",
      category: "Salary",
      subcategory: "",
      account_id: "",
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_type: "income",
      is_recurring: false,
    });
    setDate(undefined);
  };

  const categories = [
    { value: "Salary", label: "Salary" },
    { value: "Freelance", label: "Freelance" },
    { value: "Business", label: "Business" },
    { value: "Passive", label: "Passive Income" },
    { value: "Gift", label: "Gift" },
    { value: "Other", label: "Other" },
  ];

  const filteredTransactions = filter === "recurring" 
    ? transactions.data?.filter(income => income.is_recurring)
    : filter === "one-time" 
    ? transactions.data?.filter(income => !income.is_recurring)
    : transactions.data;

  const totalIncome = transactions.data?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Income</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>Your total income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">
            ${totalIncome.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full" onValueChange={value => setFilter(value === "all" ? undefined : value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="one-time">One-time</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {transactions.isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.isError ? (
            <Card className="p-6">
              <p className="text-center text-red-500">
                Error loading income data: {transactions.error?.message || "Unknown error"}
              </p>
            </Card>
          ) : filteredTransactions?.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No income entries found. Add one to get started.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTransactions?.map((income) => (
                <Card key={income.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{income.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(income.transaction_date), "MMM dd, yyyy")} •{" "}
                        {income.category}
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        +${Number(income.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {income.accounts?.name} • {income.is_recurring ? "Recurring" : "One-time"}
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
                          <AlertDialogTitle>Delete Income</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this income entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(income.id)}
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
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription>
              Record a new income source. Click save when you're done.
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
                  value={newIncome.amount}
                  onChange={(e) =>
                    setNewIncome({
                      ...newIncome,
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
                value={newIncome.description}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, description: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Monthly Salary"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newIncome.category}
                onValueChange={(value) =>
                  setNewIncome({ ...newIncome, category: value })
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
              <Label htmlFor="account" className="text-right">
                Account
              </Label>
              <Select
                value={newIncome.account_id}
                onValueChange={(value) =>
                  setNewIncome({ ...newIncome, account_id: value })
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
                value={newIncome.is_recurring ? "yes" : "no"}
                onValueChange={(value) =>
                  setNewIncome({
                    ...newIncome,
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
            {newIncome.is_recurring && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Select
                    value={newIncome.recurring_frequency || "monthly"}
                    onValueChange={(value: any) =>
                      setNewIncome({
                        ...newIncome,
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
            <Button onClick={handleAddIncome} disabled={createTransaction.isPending}>
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Income"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Income;
