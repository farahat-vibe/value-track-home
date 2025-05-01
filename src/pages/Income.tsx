
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { CalendarIcon, Plus, TrendingUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for income sources - to be replaced with Supabase data
const mockIncomes = [
  {
    id: 1,
    amount: 3500,
    description: "Monthly Salary",
    category: "Salary",
    account: "Chase Bank",
    date: new Date("2023-05-01"),
    recurring: true,
  },
  {
    id: 2,
    amount: 1200,
    description: "Freelance Project",
    category: "Freelance",
    account: "PayPal",
    date: new Date("2023-05-03"),
    recurring: false,
  },
  {
    id: 3,
    amount: 500,
    description: "Rental Income",
    category: "Passive",
    account: "Chase Bank",
    date: new Date("2023-05-10"),
    recurring: true,
  },
];

// Mock data for accounts
const mockAccounts = [
  { id: 1, name: "Cash Wallet" },
  { id: 2, name: "Chase Bank" },
  { id: 3, name: "PayPal" },
];

const Income = () => {
  const [incomes, setIncomes] = useState(mockIncomes);
  const [date, setDate] = useState<Date>();
  const [newIncome, setNewIncome] = useState({
    amount: 0,
    description: "",
    category: "Salary",
    account: "",
    date: new Date(),
    recurring: false,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddIncome = () => {
    if (!newIncome.amount || !newIncome.description || !newIncome.account) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const income = {
      id: incomes.length + 1,
      ...newIncome,
      date: date || new Date(),
    };

    setIncomes([...incomes, income]);
    setNewIncome({
      amount: 0,
      description: "",
      category: "Salary",
      account: "",
      date: new Date(),
      recurring: false,
    });
    setDate(undefined);

    toast({
      title: "Income added",
      description: `${income.description} has been added successfully.`,
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  const categories = [
    { value: "Salary", label: "Salary" },
    { value: "Freelance", label: "Freelance" },
    { value: "Business", label: "Business" },
    { value: "Passive", label: "Passive Income" },
    { value: "Gift", label: "Gift" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Income</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
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
                  value={newIncome.account}
                  onValueChange={(value) =>
                    setNewIncome({ ...newIncome, account: value })
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
                  value={newIncome.recurring ? "yes" : "no"}
                  onValueChange={(value) =>
                    setNewIncome({
                      ...newIncome,
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
              <Button onClick={handleAddIncome}>Save Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>Your total income this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">
            ${totalIncome.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="one-time">One-time</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-4">
            {incomes.map((income) => (
              <Card key={income.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{income.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(income.date), "MMM dd, yyyy")} •{" "}
                      {income.category} • {income.account}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600 dark:text-green-400">
                      +${income.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {income.recurring ? "Recurring" : "One-time"}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recurring">
          <div className="grid gap-4">
            {incomes
              .filter((income) => income.recurring)
              .map((income) => (
                <Card key={income.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{income.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(income.date), "MMM dd, yyyy")} •{" "}
                        {income.category} • {income.account}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        +${income.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Recurring
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="one-time">
          <div className="grid gap-4">
            {incomes
              .filter((income) => !income.recurring)
              .map((income) => (
                <Card key={income.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{income.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(income.date), "MMM dd, yyyy")} •{" "}
                        {income.category} • {income.account}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        +${income.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        One-time
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

export default Income;
