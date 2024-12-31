import React from "react";
import { UptimeDashboard } from "@/components/Uptime/UptimeDashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";

// Assuming you have some data to pass to UptimeDashboard
const validators = [
  // Example data
  {
    id: 1,
    name: "Validator 1",
    uptime: "99%",
    lastJailedTime: "None",
    signedPrecommits: "100%",
    startHeight: 100,
    tombstoned: false,
  },
  {
    id: 2,
    name: "Validator 2",
    uptime: "98%",
    lastJailedTime: "Yesterday",
    signedPrecommits: "99%",
    startHeight: 200,
    tombstoned: false,
  },
  // Add more validators as needed
];

export default function UptimePage() {
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
          <UptimeDashboard validators={validators} />
        </main>
      </div>
    </SidebarProvider>
  );
}
