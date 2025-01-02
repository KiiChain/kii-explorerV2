import React from "react";
import { SmartContractsDashboard } from "@/components/SmartContracts/SmartContractsDashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";

const SmartContractsPage: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <Logo />
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent />
        </Sidebar>
        <main className="flex-1 relative">
          <SmartContractsDashboard />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SmartContractsPage;
