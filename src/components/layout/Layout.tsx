
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="mb-6 flex items-center">
            {isMobile && <SidebarTrigger className="mr-4" />}
            <h1 className="text-2xl font-bold">Finance Tracker</h1>
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
