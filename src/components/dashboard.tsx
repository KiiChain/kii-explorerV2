"use client";

import { Card, CardContent } from "./ui/card";

import { useQuery } from "@tanstack/react-query";
import { useBalance, useAccount } from "wagmi";

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
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";
import { cosmosService } from "@/services/cosmos";
import { useChainData } from "@/services/queries/chainData";
import { useValidatorSet } from "@/services/queries/validatorSet";
import { useLatestBlocks } from "@/services/queries/blocks";
import { useTransactionsQuery } from "@/services/queries/transactions";

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

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const { data: chainData } = useChainData();
  const { data: validatorSetData } = useValidatorSet();
  const { data: latestBlocks = [] } = useLatestBlocks();
  const { data: transactionsData } = useTransactionsQuery();

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

  const latestTransactions =
    transactionsData?.pages[0]?.txs.map((tx) => ({
      from_address: tx.from,
      to_address: tx.to,
      value: tx.amount,
      method: tx.denom === "KII" ? "0x00000000" : "0x",
      hash: tx.hash,
      timestamp: tx.timestamp,
    })) || [];

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
      return (
        <div className="mt-6 p-6">
          <WagmiConnectButton />
        </div>
      );
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
    <div
      className="p-6 rounded-xl mb-6 pt-12"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Upper and bigger cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        style={{ backgroundColor: theme.bgColor }}
      >
        <StatCard title="KII Price" value="N/A" unit="TESTNET" />
        <StatCard title="Gas Price" value="2500" unit="akii" />
        <StatCard title="Block Height" value={latestBlocks[0]?.height || "0"} />
      </div>

      {/* Small cards */}
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
          value={chainData?.totalSupply ?? "0.00"}
          unit="KII"
          icon={
            <CashIcon
              className="w-5 h-5"
              style={{ color: theme.secondaryTextColor }}
            />
          }
          variant="horizontal"
        />
      </div>

      {/* Medium cards */}
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

      {/* My wallet section */}
      {renderWalletSection()}

      {/* Latest transaction and blocks section */}
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

      {/* Application info section */}
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
  );
}
