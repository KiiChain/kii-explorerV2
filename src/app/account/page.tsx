"use client";

import React, { useEffect, useState } from "react";
import { WalletSession } from "@/components/dashboard";
import { AddressCard } from "@/components/Account/AddressCard";
import { BalanceAndAssets } from "@/components/Account/BalanceAndAssets";
import { WithdrawalsTable } from "@/components/Account/WithdrawalsTable";
import { StakesTable } from "@/components/Account/StakesTable";
import { TransactionsTable } from "@/components/Account/TransactionsTable";
import { AccountInfo } from "@/components/Account/AccountInfo";
import { useTheme } from "@/context/ThemeContext";

interface Withdrawal {
  creationHeight: string;
  initialBalance: string;
  balance: string;
  completionTime: string;
}

interface UnbondingResponse {
  creation_height: string;
  initial_balance: string;
  balance: string;
  completion_time: string;
}

export default function AccountPage() {
  const [account, setAccount] = useState("");
  const [session, setSession] = useState<WalletSession | null>(null);
  const { theme } = useTheme();
  const [delegations, setDelegations] = useState([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const savedSession = localStorage.getItem("walletSession");
    if (savedSession) {
      const { account: savedAccount, session: savedWalletSession } =
        JSON.parse(savedSession);
      setAccount(savedAccount);
      setSession(savedWalletSession);
    }
  }, []);

  useEffect(() => {
    const fetchDelegations = async () => {
      if (account) {
        try {
          const response = await fetch(
            `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${account}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setDelegations(data.delegation_responses || []);
        } catch (error) {
          console.error("Error fetching delegations:", error);
          setDelegations([]);
        }
      }
    };

    fetchDelegations();
  }, [account]);

  useEffect(() => {
    const fetchWithdrawAddress = async () => {
      if (account) {
        try {
          const response = await fetch(
            `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegators/${account}/unbonding_delegations`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data && Array.isArray(data.unbonding_responses)) {
            const formattedWithdrawals = data.unbonding_responses.map(
              (unbonding: UnbondingResponse) => ({
                creationHeight: unbonding.creation_height,
                initialBalance: unbonding.initial_balance,
                balance: unbonding.balance,
                completionTime: new Date(
                  unbonding.completion_time
                ).toLocaleString(),
              })
            );
            setWithdrawals(formattedWithdrawals);
          } else {
            setWithdrawals([]);
          }
        } catch (error) {
          console.error("Error fetching unbonding delegations:", error);
          setWithdrawals([]);
        }
      }
    };

    fetchWithdrawAddress();
  }, [account]);

  const totalValue = session
    ? parseFloat(session.balance) +
      parseFloat(session.staking.replace(" KII", "")) +
      parseFloat(session.reward.replace(" KII", "")) +
      parseFloat(session.withdrawals.replace(" KII", ""))
    : 0;

  return (
    <div className={`mx-6 px-6 bg-[${theme.bgColor}]`}>
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
      <WithdrawalsTable withdrawals={withdrawals} />
      <StakesTable delegations={delegations} />
      <TransactionsTable />
      <AccountInfo account={account} />
    </div>
  );
}
