"use client";

import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  HeightIcon,
  ValidatorsIcon,
  CashIcon,
  BondedTokensIcon,
  InflationIcon,
  CommunityPoolIcon,
} from "./ui/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { getWeb3Provider } from "@/lib/web3";
import { useWallet } from "@/context/WalletContext";
import { StatCard } from "./StatCard";
import { WalletInfo } from "./WalletInfo";
import { BlockTable } from "./BlockTable";

import { ApplicationVersions } from "./ApplicationVersions";

interface CosmosBalance {
  denom: string;
  amount: string;
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

interface Transaction {
  from: string;
  to: string;
  amount: string;
  denom: string;
  timestamp: string;
  hash: string;
}

interface TransactionResponse {
  txs: Array<{
    body: {
      messages: Array<{
        from_address: string;
        to_address: string;
        amount: Array<{
          denom: string;
          amount: string;
        }>;
      }>;
    };
    hash: string;
    timestamp: string;
  }>;
  pagination: {
    next_key: string | null;
    total: string;
  };
}

interface Block {
  height: string;
  hash: string;
  timestamp: string;
  txCount: number;
  proposer: string;
  transactions: Transaction[];
}

interface ValidatorSetResponse {
  validators: {
    address: string;
    pub_key: {
      "@type": string;
      key: string;
    };
    voting_power: string;
    proposer_priority: string;
  }[];
  pagination: {
    total: string;
  };
}

export function connectWallet() {
  console.log("Connecting wallet...");
}

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { account, session, setSession } = useWallet();
  const [validatorCount, setValidatorCount] = useState<number>(0);
  const [bondedTokens, setBondedTokens] = useState<string>("0");
  const [communityPool, setCommunityPool] = useState<string>("0");
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>(
    []
  );

  console.log("Connected account:", account);

  useEffect(() => {
    const getBalance = async () => {
      if (!account) {
        setSession({
          balance: "0 KII",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
        return;
      }

      const existingSession = localStorage.getItem("walletSession");
      if (existingSession) {
        const { account: storedAccount, session: storedSession } =
          JSON.parse(existingSession);
        if (storedAccount === account) {
          console.log("Using cached wallet session");
          setSession(storedSession);
          return;
        }
      }

      try {
        if (account.startsWith("kii1")) {
          const response = await fetch(
            `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${account}`
          );
          const data = await response.json();

          const ukiiBalance =
            data.balances.find((b: CosmosBalance) => b.denom === "ukii")
              ?.amount || "0";
          const formattedBalance = `${(
            parseInt(ukiiBalance) / 1_000_000
          ).toString()} KII`;
          console.log("Cosmos Account balance:", formattedBalance);

          const sessionData = {
            balance: formattedBalance,
            staking: "0 KII",
            reward: "0 KII",
            withdrawals: "0 KII",
            stakes: [],
          };

          setSession(sessionData);
          localStorage.setItem(
            "walletSession",
            JSON.stringify({ account, session: sessionData })
          );
        } else {
          try {
            const provider = new ethers.JsonRpcProvider(
              "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/",
              {
                chainId: 1336,
                name: "kii-testnet",
              }
            );

            const balance = await provider.getBalance(account);
            const formattedBalance = ethers.formatEther(balance);

            const sessionData = {
              balance: `${formattedBalance} KII`,
              staking: "0 KII",
              reward: "0 KII",
              withdrawals: "0 KII",
              stakes: [],
            };

            setSession(sessionData);
            localStorage.setItem(
              "walletSession",
              JSON.stringify({ account, session: sessionData })
            );
          } catch (evmError) {
            console.error("EVM error:", evmError);
            const sessionData = {
              balance: "0 KII",
              staking: "0 KII",
              reward: "0 KII",
              withdrawals: "0 KII",
              stakes: [],
            };
            setSession(sessionData);
            localStorage.setItem(
              "walletSession",
              JSON.stringify({ account, session: sessionData })
            );
          }
        }
      } catch (error) {
        console.error("Error getting balance:", error);
        const sessionData = {
          balance: "0 KII",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        };
        setSession(sessionData);
        localStorage.setItem(
          "walletSession",
          JSON.stringify({ account, session: sessionData })
        );
      }
    };

    getBalance();
  }, [account, setSession]);

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const [genesisResponse, stakingResponse, communityPoolResponse] =
          await Promise.all([
            fetch(
              "https://rpc.dos.sentry.testnet.v3.kiivalidator.com/genesis",
              {
                signal: controller.signal,
              }
            ).catch(() => null),
            fetch(
              "https://dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/pool",
              {
                signal: controller.signal,
              }
            ).catch(() => null),
            fetch(
              "https://dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/community_pool",
              {
                signal: controller.signal,
              }
            ).catch(() => null),
          ]);

        clearTimeout(timeoutId);

        if (genesisResponse) {
          const genesisData: GenesisResponse = await genesisResponse.json();
          setValidatorCount(genesisData.genesis.validators.length);
        }

        if (stakingResponse) {
          const stakingData: StakingPoolResponse = await stakingResponse.json();
          const bondedKii = (
            parseInt(stakingData.pool.bonded_tokens) / 1_000_000
          ).toLocaleString();
          setBondedTokens(bondedKii);
        }

        if (communityPoolResponse) {
          const communityPoolData = await communityPoolResponse.json();
          const communityPoolAmount = communityPoolData.pool.find(
            (item: { denom: string }) => item.denom === "ukii"
          )?.amount;

          const communityPoolKii = communityPoolAmount
            ? (parseFloat(communityPoolAmount) / 1_000_000).toLocaleString()
            : "0";

          setCommunityPool(communityPoolKii);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error("Fetch aborted due to timeout:", error);
          } else {
            console.error("Error fetching chain data:", error);
          }
        }
      }
    };

    fetchChainData();
    const interval = setInterval(fetchChainData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchValidatorCount = async () => {
      try {
        const response = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/validatorsets/latest"
        );

        if (response.ok) {
          const data: ValidatorSetResponse = await response.json();
          const count = data.validators.length;
          setValidatorCount(count);
        }
      } catch (error) {
        console.error("Error fetching validator count:", error);
        setValidatorCount(0);
      }
    };

    fetchValidatorCount();

    const interval = setInterval(fetchValidatorCount, 10000);

    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!Array.isArray(accounts) || accounts.length === 0) {
        return;
      }

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x538" }],
        });
      } catch (switchError: unknown) {
        if (switchError instanceof Error && "code" in switchError) {
          const errorCode = (switchError as { code: number }).code;
          if (errorCode === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x538",
                    chainName: "Kii Chain",
                    nativeCurrency: {
                      name: "KII",
                      symbol: "KII",
                      decimals: 18,
                    },
                    rpcUrls: ["https://rpc.kiichain.net"],
                    blockExplorerUrls: ["https://explorer.kiichain.net"],
                  },
                ],
              });
            } catch {
              return;
            }
          } else {
            return;
          }
        }
      }

      const provider = getWeb3Provider();
      const account = accounts[0];

      try {
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        console.log("Account balance:", formattedBalance, "KII");

        setSession({
          balance: formattedBalance,
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      } catch {
        setSession({
          balance: "0",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      }
    } catch {
      return;
    }
  };

  const fetchLatestBlocksAndTxs = async () => {
    try {
      const controller = new AbortController();
      const blocks = [];
      const latestBlockResponse = await fetch(
        "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/latest",
        { signal: controller.signal }
      );
      const latestBlockData = await latestBlockResponse.json();
      const latestHeight = parseInt(latestBlockData.block.header.height);

      for (let i = 0; i < 20; i++) {
        const height = latestHeight - i;

        try {
          const blockResponse = await fetch(
            `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/${height}`,
            { signal: controller.signal }
          );
          const blockData = await blockResponse.json();

          if (blockData && blockData.block && blockData.block_id) {
            const blockInfo = {
              height: blockData.block.header.height,
              hash: blockData.block_id.hash || "N/A",
              timestamp: new Date(blockData.block.header.time).toLocaleString(),
              txCount: blockData.block.data.txs?.length || 0,
              proposer: blockData.block.header.proposer_address || "N/A",
              transactions: [],
            };

            blocks.push(blockInfo);
            console.log(`Block ${height} processed:`, blockInfo);
          } else {
            console.error(
              `Invalid block data structure for height ${height}:`,
              blockData
            );
          }
        } catch (blockError) {
          console.error(`Error processing block ${height}:`, blockError);
        }
      }

      console.log("Final blocks array:", blocks);
      setLatestBlocks(blocks);
    } catch (error) {
      console.error("Error in fetchLatestBlocksAndTxs:", error);
    }
  };

  const fetchLatestTransactions = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        "https://dos.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=message.action=%27/cosmos.bank.v1beta1.MsgSend%27&order_by=2&page=1",
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      const data: TransactionResponse = await response.json();

      const formattedTransactions = data.txs.map((tx) => ({
        from: tx.body.messages[0].from_address,
        to: tx.body.messages[0].to_address,
        amount: tx.body.messages[0].amount[0].amount,
        denom: tx.body.messages[0].amount[0].denom,
        timestamp: tx.timestamp,
        hash: tx.hash,
      }));

      setLatestTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchLatestBlocksAndTxs();
    const interval = setInterval(fetchLatestBlocksAndTxs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchLatestTransactions();
    const interval = setInterval(fetchLatestTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (account && account !== "") {
          const evmTxs = await fetch(
            "https://kii.backend.kiivalidator.com/explorer/transactions"
          ).then((res) => res.json());
          console.log("EVM transactions:", evmTxs?.quantity);
        } else {
          const cosmosTxs = await fetch(
            'https://rpc.uno.sentry.testnet.v3.kiivalidator.com/tx_search?query="tx.height>0"&prove=false&page=1&per_page=1&order_by="asc"'
          ).then((res) => res.json());
          console.log("Cosmos transactions:", cosmosTxs?.total_count);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [account]);

  const handleNavigation = (path: string) => {
    if (!account || !session) {
      return;
    }
    if (path === "/account") {
      router.push(`/account/${account}`);
    } else if (path === "/stake") {
      router.push("/staking");
    } else {
      router.push(path);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="px-6 pt-12"></div>

      <div
        className="rounded-xl mb-6"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          style={{ backgroundColor: theme.bgColor }}
        >
          <StatCard title="KII Price" value="N/A" unit="TESTNET" />
          <StatCard title="Gas Price" value="2500" unit="Ukii" />

          <StatCard
            title="Block Height"
            value={latestBlocks[0]?.height || "0"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Height"
            value={latestBlocks[0]?.height || "0"}
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
          <CardContent className="p-6 rounded-lg">
            <WalletInfo connectWallet={connectWallet} />
            {account && session && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-80"
                  style={{ backgroundColor: theme.boxColor }}
                  onClick={() => handleNavigation("/account")}
                >
                  My Account
                </button>
                <button
                  className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-80"
                  style={{ backgroundColor: theme.boxColor }}
                  onClick={() => handleNavigation("/stake")}
                >
                  Create Stake
                </button>
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
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: theme.boxColor }}
            >
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
              <BlockTable
                latestBlocks={latestBlocks}
                latestTransactions={latestTransactions}
                handleBlockClick={handleNavigation}
                handleAddressClick={handleNavigation}
              />
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
            <ApplicationVersions />
          </Card>
        </div>
      </div>
    </div>
  );
}
