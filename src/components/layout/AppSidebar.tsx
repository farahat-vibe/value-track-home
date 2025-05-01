
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart2,
  Settings,
  PlusCircle,
  Bell,
  ChevronDown,
  LineChart,
  PieChart,
  Inbox,
  Send,
  CreditCard,
  Landmark,
  Receipt,
  Repeat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-white">ValueTrack</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/accounts" className="flex items-center">
                    <Wallet className="mr-3 h-4 w-4" />
                    <span>Accounts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/income" className="flex items-center">
                    <TrendingUp className="mr-3 h-4 w-4" />
                    <span>Income</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={expensesOpen} onOpenChange={setExpensesOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center">
                        <TrendingDown className="mr-3 h-4 w-4" />
                        <span>Expenses</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expensesOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/expenses/purchases">
                          <Receipt className="mr-2 h-3.5 w-3.5" />
                          <span>Purchases</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/expenses/bills">
                          <CreditCard className="mr-2 h-3.5 w-3.5" />
                          <span>Bills</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/expenses/subscriptions">
                          <Repeat className="mr-2 h-3.5 w-3.5" />
                          <span>Subscriptions</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/budgets" className="flex items-center">
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Budgets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center">
                        <BarChart2 className="mr-3 h-4 w-4" />
                        <span>Reports</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${reportsOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/reports/overview">
                          <LineChart className="mr-2 h-3.5 w-3.5" />
                          <span>Overview</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/reports/categories">
                          <PieChart className="mr-2 h-3.5 w-3.5" />
                          <span>Categories</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 mt-4">
          <Button className="w-full flex items-center gap-2" size="sm">
            <PlusCircle className="h-4 w-4" />
            <span>New Transaction</span>
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/notifications" className="flex items-center">
                  <Bell className="mr-3 h-4 w-4" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
