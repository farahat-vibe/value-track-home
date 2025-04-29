
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Wallet,
  Plus
} from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { UpcomingTransactions } from "@/components/dashboard/UpcomingTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John Doe</p>
      </div>
      
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
    </div>
  );
};

export default Dashboard;
