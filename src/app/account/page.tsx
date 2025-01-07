"use client";

import React, { useEffect, useState } from "react";
import { BlocksHeader } from "@/components/headerDashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";
import { WalletSession } from "@/components/dashboard";
import { AddressCard } from "@/components/Account/AddressCard";
import { BalanceAndAssets } from "@/components/Account/BalanceAndAssets";
import { WithdrawalsTable } from "@/components/Account/WithdrawalsTable";
import { StakesTable } from "@/components/Account/StakesTable";
import { TransactionsTable } from "@/components/Account/TransactionsTable";
import { AccountInfo } from "@/components/Account/AccountInfo";

export default function AccountPage() {
  const [account, setAccount] = useState("");
  const [session, setSession] = useState<WalletSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("walletSession");
    if (savedSession) {
      const { account: savedAccount, session: savedWalletSession } =
        JSON.parse(savedSession);
      setAccount(savedAccount);
      setSession(savedWalletSession);
    }
  }, []);

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
        <main className="flex-1 relative overflow-y-auto">
          <div className="p-6 bg-[#05000F]">
            <BlocksHeader activeTab="blocks" onTabChange={() => {}} />

            <AddressCard account={account} />

            <BalanceAndAssets
              assets={[
                {
                  name: "Balance",
                  amount: "335,099,989.9",
                  value: "$365,099,989.9",
                  percentage: "99.86%",
                },
                {
                  name: "Stake",
                  amount: "100.1",
                  value: "$100.05",
                  percentage: "0%",
                },
                {
                  name: "Reward",
                  amount: "449.905",
                  value: "$449.905",
                  percentage: "0.13%",
                },
                {
                  name: "Withdrawals",
                  amount: "50,000",
                  value: "$50,000",
                  percentage: "0.01%",
                },
              ]}
              totalValue="$355,599,994.96"
            />

            <WithdrawalsTable
              withdrawals={[
                {
                  creationHeight: "0xa3f2...",
                  initialBalance: "50,000 KII",
                  balance: "-1,000 KII",
                  completionTime: "2 Days 11 Hours 15 Minutes 32 Seconds",
                },
              ]}
            />

            <StakesTable stakes={session?.stakes || []} />
            <TransactionsTable />
            <AccountInfo account={account} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
