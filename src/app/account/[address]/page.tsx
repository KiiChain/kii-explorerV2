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
import { useRouter, useParams } from "next/navigation";
import { useBalance } from "wagmi";

interface Transaction {
  height: string;
  hash: string;
  messages: string;
  time: string;
}

interface TxResponse {
  height: string;
  txhash: string;
  timestamp: string;
  tx: {
    body: {
      messages: Array<{
        "@type": string;
      }>;
    };
  };
}

export default function AccountPage() {
  const { address } = useParams();
  const validAddress =
    typeof address === "string" && address.startsWith("0x")
      ? (address as `0x${string}`)
      : undefined;
  const { data: balance } = useBalance({ address: validAddress });
  const router = useRouter();
  const [session, setSession] = useState<WalletSession | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useTheme();
  const [delegations, setDelegations] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    const fetchAccountData = async () => {
      try {
        let walletData: WalletSession = {
          balance: balance?.formatted || "0",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        };

        if (typeof address === "string" && !address.startsWith("0x")) {
          const [balanceResponse, stakingResponse, rewardsResponse] =
            await Promise.all([
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${address}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${address}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${address}/rewards`
              ),
            ]);

          const balanceData = await balanceResponse.json();
          const stakingData = await stakingResponse.json();
          const rewardsData = await rewardsResponse.json();

          const balance =
            balanceData.balances.find(
              (b: { denom: string }) => b.denom === "ukii"
            )?.amount || "0";
          const formattedBalance = (parseInt(balance) / 1_000_000).toString();

          const totalStaked =
            stakingData.delegation_responses?.reduce(
              (sum: number, del: { balance: { amount: string } }) =>
                sum + parseInt(del.balance.amount),
              0
            ) || 0;
          const formattedStaking = (totalStaked / 1_000_000).toString();

          const totalRewards =
            rewardsData.total?.find(
              (r: { denom: string }) => r.denom === "ukii"
            )?.amount || "0";
          const formattedRewards = (
            parseInt(totalRewards) / 1_000_000
          ).toString();

          walletData = {
            ...walletData,
            balance: formattedBalance,
            staking: `${formattedStaking} KII`,
            reward: `${formattedRewards} KII`,
            stakes:
              stakingData.delegation_responses?.map(
                (del: {
                  delegation: { validator_address: string };
                  balance: { amount: string };
                }) => ({
                  validator: del.delegation.validator_address,
                  amount:
                    (parseInt(del.balance.amount) / 1_000_000).toString() +
                    " KII",
                  rewards: "0 KII",
                })
              ) || [],
          };

          setDelegations(stakingData.delegation_responses || []);
          const withdrawalResponse = await fetch(
            `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`
          );
          const withdrawalData = await withdrawalResponse.json();
          setWithdrawals(withdrawalData.unbonding_responses || []);
        }

        setSession(walletData);

        const txResponse = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=message.sender='${address}'`
        );

        if (!txResponse.ok) {
          console.error("Failed to fetch transactions:", txResponse.statusText);
          setTransactions([]);
          return;
        }

        const txData = await txResponse.json();

        if (!txData || !Array.isArray(txData.tx_responses)) {
          console.warn("No transactions found or invalid response format");
          setTransactions([]);
          return;
        }

        const formattedTxs = txData.tx_responses.map((tx: TxResponse) => ({
          height: tx.height,
          hash: tx.txhash,
          messages: tx.tx.body.messages[0]?.["@type"] || "Unknown",
          time: new Date(tx.timestamp).toLocaleString(),
        }));

        setTransactions(formattedTxs);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAccountData();
  }, [address, router, balance]);

  const totalValue = session
    ? parseFloat(session.balance) +
      parseFloat(session.staking.replace(" KII", "")) +
      parseFloat(session.reward.replace(" KII", "")) +
      parseFloat(session.withdrawals.replace(" KII", ""))
    : 0;

  return (
    <div className={`mx-6 px-6 bg-[${theme.bgColor}]`}>
      <AddressCard account={typeof address === "string" ? address : ""} />
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
        totalValue={`$${Number(totalValue.toFixed(2))}`}
      />
      <WithdrawalsTable withdrawals={withdrawals} />
      <StakesTable delegations={delegations} />
      <TransactionsTable transactions={transactions} />
      <AccountInfo account={typeof address === "string" ? address : ""} />
    </div>
  );
}
