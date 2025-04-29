
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
  Outbox,
  CreditCard,
  Landmark,
  Receipt,
  Repeat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
                  <a href="/" className="flex items-center">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/accounts" className="flex items-center">
                    <Wallet className="mr-3 h-4 w-4" />
                    <span>Accounts</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/income" className="flex items-center">
                    <TrendingUp className="mr-3 h-4 w-4" />
                    <span>Income</span>
                  </a>
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
                        <a href="/expenses/purchases">
                          <Receipt className="mr-2 h-3.5 w-3.5" />
                          <span>Purchases</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/expenses/bills">
                          <CreditCard className="mr-2 h-3.5 w-3.5" />
                          <span>Bills</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/expenses/subscriptions">
                          <Repeat className="mr-2 h-3.5 w-3.5" />
                          <span>Subscriptions</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/budgets" className="flex items-center">
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Budgets</span>
                  </a>
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
                        <a href="/reports/overview">
                          <LineChart className="mr-2 h-3.5 w-3.5" />
                          <span>Overview</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/reports/categories">
                          <PieChart className="mr-2 h-3.5 w-3.5" />
                          <span>Categories</span>
                        </a>
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
                <a href="/notifications" className="flex items-center">
                  <Bell className="mr-3 h-4 w-4" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
