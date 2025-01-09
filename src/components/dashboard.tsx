"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  WalletIcon,
  ContractIcon,
  HeightIcon,
  ValidatorsIcon,
  CashIcon,
  BondedTokensIcon,
  InflationIcon,
  CommunityPoolIcon,
} from "./ui/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  variant?: "default" | "horizontal";

  className?: string;
  style?: React.CSSProperties;
}

function StatCard({
  title,
  value,
  unit,
  icon,
  variant = "default",
}: StatCardProps) {
  const { theme } = useTheme();

  if (variant === "horizontal") {
    return (
      <Card
        style={{
          backgroundColor: theme.boxColor,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="border-0"
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}

              <span
                className="text-sm xl:text-base font-normal"
                style={{ color: theme.secondaryTextColor }}
              >
                {title}
              </span>
            </div>
            <div
              className="text-xl md:text-2xl xl:text-3xl font-bold"
              style={{ color: theme.secondaryTextColor }}
            >
              {value}
              {unit && (
                <span
                  className="pl-1 ml-1 text-[10px] xl:text-xs"
                  style={{ color: theme.secondaryTextColor }}
                >
                  ({unit})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      style={{
        backgroundColor: theme.boxColor,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className="border-0"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className="text-sm xl:text-base font-normal"
          style={{ color: theme.secondaryTextColor }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="text-xl md:text-2xl xl:text-3xl font-bold"
          style={{ color: theme.secondaryTextColor }}
        >
          {value}
          {unit && (
            <span
              className="pl-1 ml-1 text-[10px] xl:text-xs"
              style={{ color: theme.secondaryTextColor }}
            >
              ({unit})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export interface WalletSession {
  balance: string;
  staking: string;
  reward: string;
  withdrawals: string;
  stakes: {
    validator: string;
    amount: string;
    rewards: string;
  }[];
}

interface GenesisResponse {
  genesis: {
    validators: Array<{
      address: string;
      power: string;
      name: string;
    }>;
    app_state: {
      bank: {
        supply: Array<{
          denom: string;
          amount: string;
        }>;
      };
    };
  };
}

interface StakingPoolResponse {
  pool: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}

interface BlockResponse {
  block: {
    header: {
      height: string;
      time: string;
      proposer_address: string;
    };
    data: {
      txs: string[];
    };
  };
  block_id: {
    hash: string;
  };
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  type: string;
  status: string;
  amount: string;
  fee: string;
  timestamp: string;
}

interface Block {
  height: string;
  hash: string;
  timestamp: string;
  txCount: number;
  proposer: string;
}

interface TxResponse {
  tx_responses: Array<{
    txhash: string;
    code: number;
    timestamp: string;
    tx: {
      body: {
        messages: Array<{
          "@type": string;
          from_address?: string;
          to_address?: string;
          amount?: Array<{
            denom: string;
            amount: string;
          }>;
        }>;
      };
    };
  }>;
}

export function Dashboard() {
  const { theme } = useTheme();
  const [account, setAccount] = useState<string>("");
  const [session, setSession] = useState<WalletSession | null>(null);
  const [validatorCount, setValidatorCount] = useState<number>(0);
  const [bondedTokens, setBondedTokens] = useState<string>("0");
  const [communityPool, setCommunityPool] = useState<string>("0");
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const genesisResponse = await fetch(
          "https://rpc.dos.sentry.testnet.v3.kiivalidator.com/genesis"
        );
        const genesisData: GenesisResponse = await genesisResponse.json();

        const stakingResponse = await fetch(
          "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/pool"
        );
        const stakingData: StakingPoolResponse = await stakingResponse.json();

        setValidatorCount(genesisData.genesis.validators.length);

        const bondedKii = (
          parseInt(stakingData.pool.bonded_tokens) / 1_000_000
        ).toLocaleString();
        setBondedTokens(bondedKii);

        const communityPoolResponse = await fetch(
          "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/community_pool"
        );
        const communityPoolData = await communityPoolResponse.json();

        const communityPoolAmount = communityPoolData.pool.find(
          (item: { denom: string }) => item.denom === "ukii"
        )?.amount;

        const communityPoolKii = communityPoolAmount
          ? (parseFloat(communityPoolAmount) / 1_000_000).toLocaleString()
          : "0";

        setCommunityPool(communityPoolKii);
      } catch (error) {
        console.error("Error fetching chain data:", error);
      }
    };

    fetchChainData();
    const interval = setInterval(fetchChainData, 30000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        setAccount(account);
        setSession({
          balance: "335,099,989.9",
          staking: "450,005.1 KII",
          reward: "0 KII",
          withdrawals: "50,000 KII",
          stakes: [
            {
              validator: "KIICHAIN-NODE-0",
              amount: "100.1",
              rewards: "0.0 KII",
            },
            {
              validator: "KIICHAIN-NODE-1",
              amount: "449.905",
              rewards: "0.0 KII",
            },
          ],
        });
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchBlockData = async (height: number) => {
    try {
      const response = await fetch(
        `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/${height}`
      );
      const data: BlockResponse = await response.json();

      return {
        height: data.block.header.height,
        hash:
          Buffer.from(data.block_id.hash, "base64")
            .toString("hex")
            .slice(0, 10) + "...",
        timestamp: new Date(data.block.header.time).toLocaleString(),
        txCount: data.block.data.txs?.length || 0,
        proposer: data.block.header.proposer_address,
      };
    } catch (error) {
      console.error(`Error fetching block ${height}:`, error);
      return null;
    }
  };

  const fetchLatestBlocksAndTxs = async () => {
    try {
      const heightResponse = await fetch(
        "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/latest"
      );
      const heightData: BlockResponse = await heightResponse.json();
      const latestHeight = parseInt(heightData.block.header.height);

      const blockPromises = Array.from({ length: 20 }, (_, i) =>
        fetchBlockData(latestHeight - i)
      );

      const blocks = (await Promise.all(blockPromises)).filter(
        (block): block is Block => block !== null
      );
      setLatestBlocks(blocks);

      const txsResponse = await fetch(
        `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=tx.height=${latestHeight}`
      );
      const txsData: TxResponse = await txsResponse.json();

      const transactions: Transaction[] = txsData.tx_responses.map(
        (txResponse) => {
          const msg = txResponse.tx.body.messages[0];
          return {
            hash: txResponse.txhash,
            from: msg.from_address || "N/A",
            to: msg.to_address || "N/A",
            type: msg["@type"].split(".").pop() || "Unknown",
            status: txResponse.code === 0 ? "Success" : "Failed",
            amount: msg.amount
              ? `${parseInt(msg.amount[0].amount) / 1_000_000} KII`
              : "N/A",
            fee: "N/A",
            timestamp: new Date(txResponse.timestamp).toLocaleString(),
          };
        }
      );

      setLatestTransactions(transactions);
    } catch (error) {
      console.error("Error fetching latest blocks and transactions:", error);
    }
  };

  useEffect(() => {
    fetchLatestBlocksAndTxs();
    const interval = setInterval(fetchLatestBlocksAndTxs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="px-6 pt-12"></div>

      <div
        className="rounded-xl mb-6"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
          style={{ backgroundColor: theme.bgColor }}
        >
          <StatCard title="KII Price" value="N/A" unit="TESTNET" />
          <StatCard title="Gas Price" value="2500" unit="Tekii" />
          <StatCard title="Transactions" value="333,422" />
          <StatCard title="Block Height" value="2,577,053" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Height"
            value="2,576,146"
            icon={
              <HeightIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
          <StatCard
            title="Validators"
            value={validatorCount.toString()}
            icon={
              <ValidatorsIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
          <StatCard
            title="Supply"
            value="1,800,000,000"
            icon={
              <CashIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Bonded Tokens"
            value={bondedTokens}
            unit="KII"
            icon={
              <BondedTokensIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
          <StatCard
            title="Inflation"
            value="0%"
            icon={
              <InflationIcon
                className="w-4 h-4"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
          <StatCard
            title="Community Pool"
            value={communityPool}
            icon={
              <CommunityPoolIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
        </div>

        <Card
          style={{
            backgroundColor: theme.boxColor,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          className="border-0 mt-6"
        >
          <CardContent className="p-6">
            {!account ? (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80"
                style={{ color: theme.primaryTextColor }}
              >
                <WalletIcon />
                Wallet not connected
              </button>
            ) : (
              <div className="space-y-6">
                <div
                  className="text-xl mb-4"
                  style={{ color: theme.primaryTextColor }}
                >
                  {account}
                </div>

                <div className="grid grid-cols-4 gap-4 ">
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Balance</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.balance}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${session?.balance}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Staking</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.staking}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${session?.staking}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Reward</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.reward}
                    </div>
                    <div className="text-sm text-gray-400">$0</div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Withdrawals</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.withdrawals}
                    </div>
                    <div className="text-sm text-gray-400">$500,000</div>
                  </div>
                </div>

                <div className="mt-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 w-full">
                        <th className="pb-4 w-1/4">Validator</th>
                        <th className="pb-4 w-1/4">Stakes</th>
                        <th className="pb-4 w-1/4">Rewards</th>
                        <th className="pb-4 w-1/4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session?.stakes.map((stake, index) => (
                        <tr
                          key={index}
                          className="border-t"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: theme.bgColor,
                          }}
                        >
                          <td
                            className="p-4"
                            style={{ color: theme.primaryTextColor }}
                          >
                            {stake.validator}
                          </td>
                          <td
                            className="p-4"
                            style={{ color: theme.primaryTextColor }}
                          >
                            {stake.amount}
                          </td>
                          <td
                            className="p-4"
                            style={{ color: theme.primaryTextColor }}
                          >
                            {stake.rewards}
                          </td>
                          <td className="p-4">
                            <button
                              className="px-4 py-2 rounded-lg hover:opacity-80"
                              style={{
                                backgroundColor: theme.boxColor,
                                color: theme.accentColor,
                                boxShadow:
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              }}
                            >
                              CLAIM REWARDS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    className="px-8 py-3 rounded-lg hover:opacity-80"
                    style={{
                      backgroundColor: theme.boxColor,
                      color: theme.primaryTextColor,
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    onClick={() => {
                      localStorage.setItem(
                        "walletSession",
                        JSON.stringify({ account, session })
                      );
                      router.push("/account/");
                    }}
                  >
                    My Account
                  </button>
                  <button
                    className="px-8 py-3 rounded-lg hover:opacity-80"
                    style={{
                      backgroundColor: theme.boxColor,
                      color: theme.primaryTextColor,
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    Create Stake
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card
            style={{
              backgroundColor: theme.boxColor,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            className="border-0"
          >
            <div className="p-6" style={{ backgroundColor: theme.boxColor }}>
              <div className="flex justify-between items-center">
                <div className="flex gap-6 flex-1">
                  <div style={{ color: theme.primaryTextColor }}>
                    Latest Blocks
                  </div>
                  <div
                    style={{ color: theme.primaryTextColor }}
                    className="ml-[30%]"
                  >
                    Latest transactions
                  </div>
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer whitespace-nowrap ml-4">
                  View All
                </div>
              </div>
              <div className="mt-4">
                <table className="w-full table-fixed">
                  <tbody className="space-y-4">
                    {latestBlocks.map((block, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: theme.bgColor }}
                        className="rounded-lg mb-4 w-full"
                      >
                        <td className="p-4 grid grid-cols-12 gap-4 items-center">
                          <span
                            className="col-span-2 flex items-center gap-2"
                            style={{ color: theme.accentColor }}
                          >
                            <ContractIcon className="w-4 h-4" />
                            <span style={{ color: theme.secondaryTextColor }}>
                              {block.height}
                            </span>
                          </span>
                          <div className="flex items-center gap-2 col-span-3">
                            <span style={{ color: theme.secondaryTextColor }}>
                              Fee Recipient
                            </span>
                            <span style={{ color: theme.accentColor }}>
                              {block.proposer}
                            </span>
                          </div>
                          <span
                            className="col-span-2 flex items-center gap-2"
                            style={{ color: theme.accentColor }}
                          >
                            <ContractIcon className="w-4 h-4" />
                            <span style={{ color: theme.secondaryTextColor }}>
                              {block.hash}
                            </span>
                          </span>
                          <div className="flex flex-col col-span-3">
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span
                                  style={{ color: theme.secondaryTextColor }}
                                >
                                  From:
                                </span>
                                <span style={{ color: theme.accentColor }}>
                                  0xf61aE263853B62Ce48...
                                </span>
                              </div>
                            </span>
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span
                                  style={{ color: theme.secondaryTextColor }}
                                >
                                  To:
                                </span>
                                <span style={{ color: theme.accentColor }}>
                                  0x7f32360b4ea9bf2682...
                                </span>
                              </div>
                            </span>
                          </div>
                          <span
                            style={{
                              backgroundColor: theme.boxColor,
                              color: theme.accentColor,
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            className="px-3 py-1 rounded-full col-span-2 text-center inline-block w-fit"
                          >
                            {block.txCount} KII
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="w-full mt-4">
                  <tbody>
                    {latestTransactions.map((tx) => (
                      <tr
                        key={tx.hash}
                        style={{ backgroundColor: theme.bgColor }}
                        className="rounded-lg mb-4"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span style={{ color: theme.accentColor }}>
                              {tx.hash}
                            </span>
                            <div className="flex gap-2 mt-1">
                              <span style={{ color: theme.secondaryTextColor }}>
                                From:
                              </span>
                              <span style={{ color: theme.accentColor }}>
                                {tx.from}
                              </span>
                              <span style={{ color: theme.secondaryTextColor }}>
                                To:
                              </span>
                              <span style={{ color: theme.accentColor }}>
                                {tx.to}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          className="p-4"
                          style={{ color: theme.secondaryTextColor }}
                        >
                          {tx.type}
                        </td>
                        <td
                          className="p-4"
                          style={{ color: theme.secondaryTextColor }}
                        >
                          {tx.amount}
                        </td>
                        <td
                          className="p-4"
                          style={{ color: theme.secondaryTextColor }}
                        >
                          {tx.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card
            style={{
              backgroundColor: theme.bgColor,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            className="border-0"
          >
            <div className="p-6">
              <h2
                className="text-xl mb-6"
                style={{ color: theme.primaryTextColor }}
              >
                Application Versions
              </h2>

              <table className="w-full">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Name
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Kiichain
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      App_name
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Kiichaind
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Version
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      26c1fe7
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Git_commit
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      87eefca1ad86ec69374874c25558f430afdb5555c8
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Build_tags
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      App_v1
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Go_version
                    </td>
                    <td
                      className="py-4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Go Version Go1.19 Linux/Amd64
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full mt-4">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td
                      className="py-4 w-1/4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Cloud.Google.Com/Go
                    </td>
                    <td
                      className="py-4 w-1/4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      V0.110.0
                    </td>
                    <td className="py-4" style={{ color: theme.accentColor }}>
                      H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td
                      className="py-4 w-1/4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Cloud.Google.Com/Go
                    </td>
                    <td
                      className="py-4 w-1/4"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      V0.110.0
                    </td>
                    <td className="py-4" style={{ color: theme.accentColor }}>
                      H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
