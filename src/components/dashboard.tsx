"use client";

import { Card, CardContent } from "./ui/card";

import { useQuery } from "@tanstack/react-query";
import { useBalance } from "wagmi";

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

import { StatCard } from "./StatCard";

import { BlockTable } from "./BlockTable";

import { ApplicationVersions } from "./ApplicationVersions";
import { useAccount } from "wagmi";
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";
import { cosmosService } from "@/services/cosmos";
import { API_ENDPOINTS } from "@/constants/endpoints";

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

interface EVMTransaction {
  from_address: string;
  to_address: string;
  value: string;
  method: string;
  hash: string;
  timestamp: string;
}

export function connectWallet() {
  console.log("Connecting wallet...");
}

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const formatBalance = (value: string | number): string => {
    return Number(value).toFixed(2);
  };

  const { data: cosmosBalances } = useQuery({
    queryKey: ["cosmos-balances", address],
    queryFn: async () => {
      if (!address) return null;

      const cosmosData = await cosmosService.getKiiAddress(address);
      if (!cosmosData?.kii_address) return null;

      const [totalStaked, totalRewards] = await Promise.all([
        cosmosService.getDelegations(cosmosData.kii_address),
        cosmosService.getRewards(cosmosData.kii_address),
      ]);

      return {
        stakingBalance: totalStaked,
        rewardsBalance: totalRewards,
      };
    },
    enabled: !!address,
    refetchInterval: 30000,
  });

  const session: WalletSession = {
    balance: `${formatBalance(balanceData?.formatted ?? "0")} ${
      balanceData?.symbol ?? "KII"
    }`,
    staking: `${formatBalance(cosmosBalances?.stakingBalance ?? "0")} KII`,
    reward: `${formatBalance(cosmosBalances?.rewardsBalance ?? "0")} KII`,
    withdrawals: formatBalance("0") + " KII",
    stakes: [],
  };

  console.log("Connected account:", address);

  const { data: chainData } = useQuery({
    queryKey: ["chain-data"],
    queryFn: async () => {
      const [genesisResponse, stakingResponse, communityPoolResponse] =
        await Promise.all([
          fetch(`${API_ENDPOINTS.RPC}/genesis`).catch(() => null),
          fetch(`${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/pool`).catch(
            () => null
          ),
          fetch(
            `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/community_pool`
          ).catch(() => null),
        ]);

      const genesisData = genesisResponse ? await genesisResponse.json() : null;
      const stakingData = stakingResponse ? await stakingResponse.json() : null;
      const communityPoolData = communityPoolResponse
        ? await communityPoolResponse.json()
        : null;

      const bondedKii = stakingData
        ? (parseInt(stakingData.pool.bonded_tokens) / 1_000_000).toFixed(4)
        : "0.0000";

      const communityPoolAmount = communityPoolData?.pool?.find(
        (item: { denom: string }) => item.denom === "ukii"
      )?.amount;

      const communityPoolKii = communityPoolAmount
        ? (parseFloat(communityPoolAmount) / 1_000_000).toFixed(4)
        : "0.0000";

      return {
        validatorCount: genesisData?.genesis.validators.length ?? 0,
        bondedTokens: bondedKii,
        communityPool: communityPoolKii,
      };
    },
    refetchInterval: 30000,
  });

  const { data: validatorSetData } = useQuery({
    queryKey: ["validator-set"],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/validatorsets/latest`
      );
      const data: ValidatorSetResponse = await response.json();
      return data.validators.length;
    },
    refetchInterval: 10000,
  });

  const { data: latestBlocks = [] } = useQuery({
    queryKey: ["latest-blocks"],
    queryFn: async () => {
      const blocks = [];
      const latestBlockResponse = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/latest`
      );
      const latestBlockData = await latestBlockResponse.json();
      const latestHeight = parseInt(latestBlockData.block.header.height);

      for (let i = 0; i < 20; i++) {
        const height = latestHeight - i;
        try {
          const blockResponse = await fetch(
            `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/${height}`
          );
          const blockData = await blockResponse.json();

          if (blockData && blockData.block && blockData.block_id) {
            blocks.push({
              height: blockData.block.header.height,
              hash: blockData.block_id.hash || "N/A",
              timestamp: new Date(blockData.block.header.time).toLocaleString(),
              txCount: blockData.block.data.txs?.length || 0,
              proposer: blockData.block.header.proposer_address || "N/A",
              transactions: [],
            });
          }
        } catch (blockError) {
          console.error(`Error processing block ${height}:`, blockError);
        }
      }
      return blocks;
    },
    refetchInterval: 30000,
  });

  const { data: latestTransactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.EVM_INDEXER}/transactions?order=timestamp.desc&limit=200&offset=0`
      );
      const transactions: EVMTransaction[] = await response.json();
      return transactions.map((tx) => ({
        from: tx.from_address,
        to: tx.to_address,
        amount:
          tx.method === "0x00000000"
            ? (BigInt(tx.value) / BigInt(1e18)).toString()
            : "EVM Contract Call",
        denom: tx.method === "0x00000000" ? "KII" : "",
        timestamp: tx.timestamp,
        hash: tx.hash,
      }));
    },
    refetchInterval: 30000,
  });

  const handleNavigation = (path: string) => {
    if (!address || !session) {
      return;
    }
    if (path === "/account") {
      router.push(`/account/${address}`);
    } else if (path === "/staking") {
      router.push("/staking");
    } else {
      router.push(path);
    }
  };

  const renderWalletSection = () => {
    if (!isConnected) {
      return <WagmiConnectButton />;
    }

    return (
      <Card
        style={{ backgroundColor: theme.boxColor }}
        className="border-0 mt-6"
      >
        <CardContent className="p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p style={{ color: theme.secondaryTextColor }}>{address}</p>
            </div>
            <div>
              <p style={{ color: theme.primaryTextColor }}>Balance</p>
              <p style={{ color: theme.secondaryTextColor }}>
                {session.balance}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            >
              <p style={{ color: theme.primaryTextColor }}>Balance</p>
              <p style={{ color: theme.secondaryTextColor }}>
                {session.balance}
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            >
              <p style={{ color: theme.primaryTextColor }}>Staked</p>
              <p style={{ color: theme.secondaryTextColor }}>
                {formatBalance(cosmosBalances?.stakingBalance ?? "0")} KII
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            >
              <p style={{ color: theme.primaryTextColor }}>Rewards</p>
              <p style={{ color: theme.secondaryTextColor }}>
                {formatBalance(cosmosBalances?.rewardsBalance ?? "0")} KII
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            >
              <p style={{ color: theme.primaryTextColor }}>Withdrawals</p>
              <p style={{ color: theme.secondaryTextColor }}>
                {session.withdrawals}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-80"
              style={{ backgroundColor: theme.boxColor }}
              onClick={() => router.push(`/account/${address}`)}
            >
              My Account
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-80"
              style={{ backgroundColor: theme.boxColor }}
              onClick={() => router.push("/staking")}
            >
              Create Stake
            </button>
          </div>
        </CardContent>
      </Card>
    );
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
            value={validatorSetData?.toString() ?? "0"}
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
            value={chainData?.bondedTokens ?? "0.00"}
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
            value={chainData?.communityPool ?? "0.00"}
            icon={
              <CommunityPoolIcon
                className="w-5 h-5"
                style={{ color: theme.secondaryTextColor }}
              />
            }
            variant="horizontal"
          />
        </div>

        {renderWalletSection()}

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
