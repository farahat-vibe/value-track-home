
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  CreditCard, 
  Landmark, 
  Plus, 
  Trash, 
  PenLine,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Mock data for accounts - to be replaced with Supabase data
const mockAccounts = [
  { id: 1, name: "Cash Wallet", type: "cash", balance: 350.75 },
  { id: 2, name: "Chase Bank", type: "bank", balance: 2540.33 },
  { id: 3, name: "Visa Credit", type: "credit", balance: -450.25 },
  { id: 4, name: "PayPal", type: "other", balance: 120.00 },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [newAccount, setNewAccount] = useState({ name: "", type: "bank", initialBalance: 0 });
  const { toast } = useToast();

  const handleAddAccount = () => {
    if (!newAccount.name) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    const account = {
      id: accounts.length + 1,
      name: newAccount.name,
      type: newAccount.type,
      balance: newAccount.initialBalance,
    };

    setAccounts([...accounts, account]);
    setNewAccount({ name: "", type: "bank", initialBalance: 0 });
    
    toast({
      title: "Account created",
      description: `${account.name} has been added successfully.`,
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Wallet className="h-5 w-5" />;
      case "credit":
        return <CreditCard className="h-5 w-5" />;
      case "bank":
        return <Landmark className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case "cash":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "credit":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "bank":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new account</DialogTitle>
              <DialogDescription>
                Add a new account to track your finances.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Chase Bank Account"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  Initial Balance
                </Label>
                <Input
                  id="balance"
                  type="number"
                  value={newAccount.initialBalance}
                  onChange={(e) => setNewAccount({ ...newAccount, initialBalance: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAccount}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
          <CardDescription>Across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${totalBalance.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => (
          <Card key={account.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-md ${getAccountColor(account.type)}`}>
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  <CardDescription>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <PenLine className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${account.balance.toFixed(2)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-2 bg-muted/50">
              <span className="text-sm text-muted-foreground">Last updated: Today</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
