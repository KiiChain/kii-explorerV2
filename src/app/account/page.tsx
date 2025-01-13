"use client";

import React, { useEffect, useState } from "react";
import { BlocksHeader } from "@/components/headerDashboard";
import { WalletSession } from "@/components/dashboard";
import { AddressCard } from "@/components/Account/AddressCard";
import { BalanceAndAssets } from "@/components/Account/BalanceAndAssets";
import { WithdrawalsTable } from "@/components/Account/WithdrawalsTable";
import { StakesTable } from "@/components/Account/StakesTable";
import { TransactionsTable } from "@/components/Account/TransactionsTable";
import { AccountInfo } from "@/components/Account/AccountInfo";
import { useTheme } from "@/context/ThemeContext";

export default function AccountPage() {
  const [account, setAccount] = useState("");
  const [session, setSession] = useState<WalletSession | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const savedSession = localStorage.getItem("walletSession");
    if (savedSession) {
      const { account: savedAccount, session: savedWalletSession } =
        JSON.parse(savedSession);
      setAccount(savedAccount);
      setSession(savedWalletSession);
    }
  }, []);

  // Calculate total value
  const totalValue = session
    ? parseFloat(session.balance) +
      parseFloat(session.staking.replace(" KII", "")) +
      parseFloat(session.reward.replace(" KII", "")) +
      parseFloat(session.withdrawals.replace(" KII", ""))
    : 0;

  return (
    <div className={`px-6 bg-[${theme.bgColor}]`}>
      <BlocksHeader activeTab="blocks" onTabChange={() => {}} />
      <AddressCard account={account} />
      <BalanceAndAssets
        assets={[
          {
            name: "Balance",
            amount: session?.balance || "0",
            value: `$${session?.balance || "0"}`,
            percentage: "99.86%",
          },
          {
            name: "Stake",
            amount: session?.staking || "0 KII",
            value: `$${session?.staking?.replace(" KII", "") || "0"}`,
            percentage: "0%",
          },
          {
            name: "Reward",
            amount: session?.reward || "0 KII",
            value: `$${session?.reward?.replace(" KII", "") || "0"}`,
            percentage: "0.13%",
          },
          {
            name: "Withdrawals",
            amount: session?.withdrawals || "0 KII",
            value: `$${session?.withdrawals?.replace(" KII", "") || "0"}`,
            percentage: "0.01%",
          },
        ]}
        totalValue={`$${totalValue.toFixed(2)}`}
      />
      <WithdrawalsTable
        withdrawals={
          session?.withdrawals
            ? [
                {
                  creationHeight: session.withdrawals,
                  initialBalance: session.withdrawals,
                  balance: session.withdrawals,
                  completionTime: "Pending",
                },
              ]
            : []
        }
      />
      <StakesTable stakes={session?.stakes || []} />
      <TransactionsTable />
      <AccountInfo account={account} />
    </div>
  );
}
