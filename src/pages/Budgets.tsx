import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, PiggyBank, Coins, Calendar, AlertTriangle } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAccounts } from "@/hooks/useAccounts";
import { CheckboxGroup, Checkbox } from "@/components/ui/checkbox-group";

const Budgets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  
  const { accounts } = useAccounts();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formValues, setFormValues] = useState({
    name: "",
    budget_type: "spending",
    amount: 0,
    category: "",
    subcategory: "",
  });
  
  // Fetch budgets
  const { data: budgets, isLoading, isError } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create budget mutation
  const createBudget = useMutation({
    mutationFn: async (budget: any) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert([budget])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Budget created",
        description: "Your budget has been created successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateBudget = () => {
    if (
      !formValues.name || 
      !formValues.amount || 
      !startDate || 
      !endDate || 
      selectedAccounts.length === 0
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createBudget.mutateAsync({
      name: formValues.name,
      budget_type: formValues.budget_type,
      amount: formValues.amount,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      category: formValues.category || null,
      subcategory: formValues.subcategory || null,
      accounts: selectedAccounts,
    });
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      budget_type: "spending",
      amount: 0,
      category: "",
      subcategory: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedAccounts([]);
  };

  const calculateProgress = (budget: any) => {
    const today = new Date();
    const startDate = new Date(budget.start_date);
    const endDate = new Date(budget.end_date);
    
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    return Math.min(Math.max(Math.round((elapsedDays / totalDays) * 100), 0), 100);
  };

  // Categories for budgets
  const categories = [
    { value: "Housing", label: "Housing" },
    { value: "Transportation", label: "Transportation" },
    { value: "Food", label: "Food" },
    { value: "Utilities", label: "Utilities" },
    { value: "Insurance", label: "Insurance" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Savings", label: "Savings" },
    { value: "Personal", label: "Personal" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        </div>
      ) : isError ? (
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-500">
              Error loading budgets. Please try again later.
            </p>
          </div>
        </Card>
      ) : budgets?.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a budget to track your spending and savings goals
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Create Your First Budget
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {budgets?.map((budget: any) => (
            <Card key={budget.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                    <CardDescription>
                      {budget.budget_type === "spending" ? "Spending Budget" : "Saving Goal"}
                    </CardDescription>
                  </div>
                  <div className={`p-2 rounded-md ${
                    budget.budget_type === "spending"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  }`}>
                    {budget.budget_type === "spending" ? (
                      <Coins className="h-5 w-5" />
                    ) : (
                      <PiggyBank className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{calculateProgress(budget)}%</span>
                  </div>
                  <Progress value={calculateProgress(budget)} className="h-2" />
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Amount</p>
                    <p className="font-medium">${Number(budget.amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{format(new Date(budget.end_date), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                
                {budget.category && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">{budget.category}</span>
                    {budget.subcategory && (
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">{budget.subcategory}</span>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/50 p-3 flex justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(budget.start_date), "MMM dd")} - {format(new Date(budget.end_date), "MMM dd, yyyy")}
                  </span>
                </div>
                <Button variant="ghost" size="sm">Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Set up a new budget to track your spending or saving goals.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Monthly Groceries"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget-type" className="text-right">
                Type
              </Label>
              <Select
                value={formValues.budget_type}
                onValueChange={(value) => setFormValues({ ...formValues, budget_type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spending">Spending Budget</SelectItem>
                  <SelectItem value="saving">Saving Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  value={formValues.amount}
                  onChange={(e) =>
                    setFormValues({ ...formValues, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formValues.category}
                onValueChange={(value) => setFormValues({ ...formValues, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category (optional)" />
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Accounts
              </Label>
              <div className="col-span-3 border rounded-md p-4">
                <CheckboxGroup value={selectedAccounts} onChange={setSelectedAccounts}>
                  {accounts.data?.map((account) => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <Checkbox 
                        value={account.id} 
                        id={`account-${account.id}`}
                      >
                        <Label htmlFor={`account-${account.id}`} className="ml-2">{account.name}</Label>
                      </Checkbox>
                    </div>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateBudget} disabled={createBudget.isPending}>
              {createBudget.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budgets;
