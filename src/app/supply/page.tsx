import { SupplyDashboard } from "@/components/Supply/SupplyDashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";

export default function SupplyPage() {
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
          <SupplyDashboard />
        </main>
      </div>
    </SidebarProvider>
  );
}
