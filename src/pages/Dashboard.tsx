
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Calendar
} from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { UpcomingTransactions } from "@/components/dashboard/UpcomingTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <BalanceChart />
              <TransactionsList />
            </div>
            
            <div className="md:col-span-4 space-y-6">
              <QuickActions />
              <UpcomingTransactions />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
