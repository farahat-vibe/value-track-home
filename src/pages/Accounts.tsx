
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
  ChevronRight,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/hooks/useAccounts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NewAccount } from "@/services/accountService";
import { supabase } from "@/integrations/supabase/client";

const Accounts = () => {
  const { accounts, createAccount, updateAccount, deleteAccount } = useAccounts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<Omit<NewAccount, 'user_id'>>({ 
    name: "", 
    type: "bank", 
    balance: 0 
  });

  const handleSubmit = async () => {
    if (!newAccount.name) {
      return;
    }

    if (isEditMode && currentAccountId) {
      await updateAccount.mutateAsync({ 
        id: currentAccountId, 
        updates: newAccount 
      });
    } else {
      await createAccount.mutateAsync(newAccount);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (account: any) => {
    setCurrentAccountId(account.id);
    setNewAccount({
      name: account.name,
      type: account.type,
      balance: account.balance
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteAccount.mutateAsync(id);
  };

  const resetForm = () => {
    setNewAccount({ name: "", type: "bank", balance: 0 });
    setIsEditMode(false);
    setCurrentAccountId(null);
  };

  const openNewAccountDialog = () => {
    resetForm();
    setIsDialogOpen(true);
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

  const totalBalance = accounts.data?.reduce((sum, account) => sum + Number(account.balance), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Button className="flex items-center gap-2" onClick={openNewAccountDialog}>
          <Plus className="h-4 w-4" />
          New Account
        </Button>
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

      {accounts.isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.isError ? (
        <Card className="p-6">
          <p className="text-center text-red-500">
            Error loading accounts: {accounts.error?.message || "Unknown error"}
          </p>
        </Card>
      ) : accounts.data?.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            You don't have any accounts yet. Create one to get started.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.data?.map((account) => (
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
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                    onClick={() => handleEdit(account)}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this account? This action cannot be undone.
                          All transactions associated with this account will also be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(account.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Number(account.balance).toFixed(2)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-2 bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(account.updated_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit account" : "Create new account"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update your account details." 
                : "Add a new account to track your finances."}
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
                onValueChange={(value: 'cash' | 'bank' | 'credit' | 'other') => 
                  setNewAccount({ ...newAccount, type: value })
                }
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
                {isEditMode ? "Balance" : "Initial Balance"}
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  $
                </span>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ 
                    ...newAccount, 
                    balance: parseFloat(e.target.value) || 0 
                  })}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={createAccount.isPending || updateAccount.isPending}>
              {(createAccount.isPending || updateAccount.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update Account" : "Create Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
