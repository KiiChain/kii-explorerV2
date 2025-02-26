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

export default function AddressPage() {
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
  const [validators, setValidators] = useState<Record<string, string>>({});

  const formatAmount = (amount: string, decimals: number = 6) => {
    const value = parseInt(amount);
    if (isNaN(value)) return "0";
    return (value / Math.pow(10, decimals)).toFixed(2);
  };

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch validators first
        const validatorsResponse = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators"
        );
        const validatorsData = await validatorsResponse.json();
        const validatorsMap = validatorsData.validators.reduce(
          (
            acc: Record<string, string>,
            validator: {
              operator_address: string;
              description: { moniker: string };
            }
          ) => {
            acc[validator.operator_address] = validator.description.moniker;
            return acc;
          },
          {}
        );
        setValidators(validatorsMap);

        // Then fetch account data with the map
        await fetchAccountData(validatorsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [address, router, balance]);

  const fetchAccountData = async (validatorsMap: Record<string, string>) => {
    let kiiAddress = "";

    try {
      const walletData: WalletSession = {
        balance: balance?.formatted || "0",
        staking: "0 KII",
        reward: "0 KII",
        withdrawals: "0 KII",
        stakes: [],
      };

      if (typeof address === "string") {
        kiiAddress = address;

        if (address.startsWith("0x")) {
          const kiiAddressResponse = await fetch(
            `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/kiichain/evm/kii_address?evm_address=${address}`
          );
          const kiiAddressData = await kiiAddressResponse.json();
          if (kiiAddressData.associated) {
            kiiAddress = kiiAddressData.kii_address;
          }
        }

        if (kiiAddress) {
          const [balanceResponse, stakingResponse, rewardsResponse] =
            await Promise.all([
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${kiiAddress}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${kiiAddress}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${kiiAddress}/rewards`
              ),
            ]);

          const stakingData = await stakingResponse.json();

          if (stakingData.delegation_responses) {
            const formattedDelegations = stakingData.delegation_responses.map(
              (del: {
                delegation: {
                  validator_address: string;
                  delegator_address: string;
                  shares: string;
                };
                balance: {
                  amount: string;
                  denom: string;
                };
              }) => ({
                delegation: {
                  ...del.delegation,
                  shares: formatAmount(del.delegation.shares),
                  moniker:
                    validatorsMap[del.delegation.validator_address] ||
                    "Unknown",
                },
                balance: {
                  ...del.balance,
                  amount: formatAmount(del.balance.amount),
                },
              })
            );
            setDelegations(formattedDelegations);
          }

          const txResponse = await fetch(
            `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=message.sender='${kiiAddress}'`
          );

          if (txResponse.ok) {
            const txData = await txResponse.json();
            if (txData && Array.isArray(txData.tx_responses)) {
              const formattedTxs = txData.tx_responses.map(
                (tx: TxResponse) => ({
                  height: tx.height,
                  hash: tx.txhash,
                  messages: tx.tx.body.messages[0]?.["@type"] || "Unknown",
                  time: new Date(tx.timestamp).toLocaleString(),
                })
              );
              setTransactions(formattedTxs);
            }
          }
        }
      }

      setSession(walletData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  return (
    <div className={`mx-6 px-6 bg-[${theme.bgColor}]`}>
      <AddressCard account={typeof address === "string" ? address : ""} />
      <BalanceAndAssets
        assets={[
          {
            name: "Balance",
            amount: session?.balance || "0.0000",
            value: `$${session?.balance || "0.0000"}`,
            percentage: "99.86%",
          },
          {
            name: "Stake",
            amount: session?.staking || "0.0000 KII",
            value: `$${session?.staking?.replace(" KII", "") || "0.0000"}`,
            percentage: "0%",
          },
          {
            name: "Reward",
            amount: session?.reward || "0.0000 KII",
            value: `$${session?.reward?.replace(" KII", "") || "0.0000"}`,
            percentage: "0.13%",
          },
          {
            name: "Withdrawals",
            amount: session?.withdrawals || "0.0000 KII",
            value: `$${session?.withdrawals?.replace(" KII", "") || "0.0000"}`,
            percentage: "0.01%",
          },
        ]}
      />
      <WithdrawalsTable withdrawals={withdrawals} />
      <StakesTable delegations={delegations} />
      <TransactionsTable transactions={transactions} />
      <AccountInfo account={typeof address === "string" ? address : ""} />
    </div>
  );
}
