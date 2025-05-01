
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
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, TrendingDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for expenses - to be replaced with Supabase data
const mockExpenses = [
  {
    id: 1,
    amount: 85.5,
    description: "Groceries",
    category: "Purchases",
    subcategory: "Groceries",
    account: "Chase Bank",
    date: new Date("2023-05-01"),
    recurring: false,
  },
  {
    id: 2,
    amount: 1200,
    description: "Rent",
    category: "Bills",
    subcategory: "Housing",
    account: "Chase Bank",
    date: new Date("2023-05-01"),
    recurring: true,
  },
  {
    id: 3,
    amount: 14.99,
    description: "Netflix",
    category: "Subscriptions",
    subcategory: "Entertainment",
    account: "Credit Card",
    date: new Date("2023-05-04"),
    recurring: true,
  },
  {
    id: 4,
    amount: 250,
    description: "Car Loan Payment",
    category: "Debts",
    subcategory: "Loans",
    account: "Chase Bank",
    date: new Date("2023-05-10"),
    recurring: true,
  },
];

// Mock data for accounts
const mockAccounts = [
  { id: 1, name: "Cash Wallet" },
  { id: 2, name: "Chase Bank" },
  { id: 3, name: "Credit Card" },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [date, setDate] = useState<Date>();
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    description: "",
    category: "Purchases",
    subcategory: "",
    account: "",
    date: new Date(),
    recurring: false,
  });
  const { toast } = useToast();

  const handleAddExpense = () => {
    if (
      !newExpense.amount ||
      !newExpense.description ||
      !newExpense.account ||
      !newExpense.subcategory
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      date: date || new Date(),
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      amount: 0,
      description: "",
      category: "Purchases",
      subcategory: "",
      account: "",
      date: new Date(),
      recurring: false,
    });
    setDate(undefined);

    toast({
      title: "Expense added",
      description: `${expense.description} has been added successfully.`,
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
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
                  value={newExpense.account}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, account: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
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
                  value={newExpense.recurring ? "yes" : "no"}
                  onValueChange={(value) =>
                    setNewExpense({
                      ...newExpense,
                      recurring: value === "yes",
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
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense}>Save Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
          <CardDescription>Your total expenses this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            ${totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <Card key={expense.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(expense.date), "MMM dd, yyyy")} •{" "}
                      {expense.category} • {expense.subcategory}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600 dark:text-red-400">
                      -${expense.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {expense.account} • {expense.recurring ? "Recurring" : "One-time"}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="purchases">
          <div className="grid gap-4">
            {expenses
              .filter((expense) => expense.category === "Purchases")
              .map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "MMM dd, yyyy")} •{" "}
                        {expense.subcategory}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.account}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="bills">
          <div className="grid gap-4">
            {expenses
              .filter((expense) => expense.category === "Bills")
              .map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "MMM dd, yyyy")} •{" "}
                        {expense.subcategory}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.account}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="subscriptions">
          <div className="grid gap-4">
            {expenses
              .filter((expense) => expense.category === "Subscriptions")
              .map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "MMM dd, yyyy")} •{" "}
                        {expense.subcategory}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.account}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="debts">
          <div className="grid gap-4">
            {expenses
              .filter((expense) => expense.category === "Debts")
              .map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-red-100 p-3 rounded-full dark:bg-red-900/20">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "MMM dd, yyyy")} •{" "}
                        {expense.subcategory}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.account}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
