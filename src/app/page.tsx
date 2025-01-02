"use client";

import { ProfileCard } from "@/components/Profile/ProfileCard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WalletSession } from "@/components/dashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";

export default function Page() {
  const [account] = useState("");
  const [session] = useState<WalletSession | null>(null);
  const router = useRouter();

  const connectWallet = async () => {
    // Implementar lógica de conexión
  };

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
        <main className="flex-1 relative overflow-auto p-6">
          <ProfileCard
            account={account}
            session={session}
            connectWallet={connectWallet}
            router={router}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
