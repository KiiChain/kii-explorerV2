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
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

interface Transaction {
  height: string;
  hash: string;
  messages: string;
  time: string;
  from: string;
  to: string;
  amount: string;
  denom: string;
}

interface TxResponse {
  height: string;
  txhash: string;
  timestamp: string;
  tx: {
    body: {
      messages: Array<{
        "@type": string;
        from_address?: string;
        to_address?: string;
        amount?: Array<{
          amount: string;
          denom: string;
        }>;
      }>;
    };
  };
}

interface EthereumProvider {
  request<T = unknown>(args: {
    method: string;
    params?: unknown[];
  }): Promise<T>;
  isMetaMask?: boolean;
}

export default function AccountPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [session, setSession] = useState<WalletSession | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useTheme();
  const [delegations, setDelegations] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    params.then(({ address }) => {
      if (!address || Array.isArray(address)) {
        router.push("/");
        return;
      }
      setAddress(address);

      const storedData = localStorage.getItem("walletSession");
      if (storedData) {
        const { account, session: storedSession } = JSON.parse(storedData);
        if (account === address) {
          setSession(storedSession);
        }
      }

      const fetchAccountData = async () => {
        try {
          const walletData: WalletSession = {
            balance: "0",
            staking: "0 KII",
            reward: "0 KII",
            withdrawals: "0 KII",
            stakes: [],
          };

          if (address.startsWith("0x")) {
            try {
              if (window.ethereum) {
                const provider = window.ethereum as unknown as EthereumProvider;
                try {
                  await provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x538" }],
                  });
                } catch (error: unknown) {
                  if (
                    error &&
                    typeof error === "object" &&
                    "code" in error &&
                    error.code === 4902
                  ) {
                    try {
                      await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [
                          {
                            chainId: "0x538",
                            chainName: "Kii Testnet Oro",
                            nativeCurrency: {
                              name: "KII",
                              symbol: "KII",
                              decimals: 18,
                            },
                            rpcUrls: [
                              "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/",
                            ],
                            blockExplorerUrls: ["https://app.kiichain.io"],
                          },
                        ],
                      });
                    } catch (addError: unknown) {
                      console.error("Error adding chain:", addError);
                    }
                  }
                  console.error("Error switching chain:", error);
                }
              }

              const provider = new ethers.JsonRpcProvider(
                "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/"
              );
              try {
                const balance = await provider.getBalance(address);
                const formattedBalance = ethers.formatEther(balance);
                walletData.balance = `${formattedBalance} KII`;
              } catch (balanceError) {
                console.error("Error getting EVM balance:", balanceError);
                walletData.balance = "0 KII";
              }

              setDelegations([]);
              setWithdrawals([]);
              setTransactions([]);

              if (mounted) {
                setSession(walletData);
              }
            } catch (error) {
              console.error("Error fetching EVM data:", error);
              if (mounted) {
                setSession(walletData);
              }
            }
          } else {
            try {
              const [
                balanceResponse,
                stakingResponse,
                rewardsResponse,
                txResponse,
              ] = await Promise.all([
                fetch(
                  `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${address}`,
                  { signal: controller.signal }
                ),
                fetch(
                  `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${address}`,
                  { signal: controller.signal }
                ),
                fetch(
                  `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
                  { signal: controller.signal }
                ),
                fetch(
                  `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=message.sender='${address}'&order_by=2`,
                  { signal: controller.signal }
                ),
              ]);

              const [balanceData, stakingData, rewardsData, txData] =
                await Promise.all([
                  balanceResponse.json(),
                  stakingResponse.json(),
                  rewardsResponse.json(),
                  txResponse.json(),
                ]);

              const balance =
                balanceData.balances.find(
                  (b: { denom: string }) => b.denom === "ukii"
                )?.amount || "0";

              walletData.balance = `${(
                parseInt(balance) / 1_000_000
              ).toString()} KII`;

              const totalStaked =
                stakingData.delegation_responses?.reduce(
                  (sum: number, del: { balance: { amount: string } }) =>
                    sum + parseInt(del.balance.amount),
                  0
                ) || 0;
              walletData.staking = `${(
                totalStaked / 1_000_000
              ).toString()} KII`;

              const totalRewards =
                rewardsData.total?.find(
                  (r: { denom: string }) => r.denom === "ukii"
                )?.amount || "0";
              walletData.reward = `${(
                parseInt(totalRewards) / 1_000_000
              ).toString()} KII`;

              walletData.stakes =
                stakingData.delegation_responses?.map(
                  (del: {
                    delegation: { validator_address: string };
                    balance: { amount: string };
                  }) => ({
                    validator: del.delegation.validator_address,
                    amount: `${(
                      parseInt(del.balance.amount) / 1_000_000
                    ).toString()} KII`,
                    rewards: "0 KII",
                  })
                ) || [];

              const formattedTransactions = txData.tx_responses.map(
                (txResponse: TxResponse) => ({
                  height: txResponse.height,
                  hash: txResponse.txhash,
                  messages:
                    txResponse.tx.body.messages[0]["@type"] || "Unknown",
                  time: new Date(txResponse.timestamp).toLocaleString(),
                  from: txResponse.tx.body.messages[0].from_address || address,
                  to: txResponse.tx.body.messages[0].to_address || "N/A",
                  amount:
                    txResponse.tx.body.messages[0].amount?.[0]?.amount || "0",
                  denom:
                    txResponse.tx.body.messages[0].amount?.[0]?.denom || "ukii",
                })
              );

              setTransactions(formattedTransactions);

              setDelegations(stakingData.delegation_responses || []);

              const withdrawalResponse = await fetch(
                `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`,
                { signal: controller.signal }
              );
              const withdrawalData = await withdrawalResponse.json();
              setWithdrawals(withdrawalData.unbonding_responses || []);

              if (mounted) {
                setSession(walletData);
              }
            } catch (error) {
              console.error("Error fetching Cosmos data:", error);
              if (mounted) {
                setSession(walletData);
              }
            }
          }
        } catch (error) {
          console.error("Error in fetchAccountData:", error);
          if (mounted) {
            setSession({
              balance: "0",
              staking: "0 KII",
              reward: "0 KII",
              withdrawals: "0 KII",
              stakes: [],
            });
          }
        }
      };

      const timeoutId = setTimeout(() => {
        if (mounted) {
          controller.abort();
        }
      }, 10000);

      fetchAccountData();
      const interval = setInterval(fetchAccountData, 30000);

      return () => {
        mounted = false;
        clearTimeout(timeoutId);
        clearInterval(interval);
        controller.abort();
      };
    });
  }, [params, router]);

  const totalValue = session
    ? parseFloat(session.balance?.replace(" KII", "") || "0") +
      parseFloat(session.staking?.replace(" KII", "") || "0") +
      parseFloat(session.reward?.replace(" KII", "") || "0") +
      parseFloat(session.withdrawals?.replace(" KII", "") || "0")
    : 0;

  return (
    <div className={`mx-6 px-6 bg-[${theme.bgColor}]`}>
      <AddressCard account={address || ""} />
      <BalanceAndAssets
        assets={[
          {
            name: "Balance",
            amount: session?.balance || "0 KII",
            value: `$${session?.balance?.replace(" KII", "") || "0"}`,
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
      <TransactionsTable transactions={transactions} />
      <AccountInfo account={address || ""} />
    </div>
  );
}
