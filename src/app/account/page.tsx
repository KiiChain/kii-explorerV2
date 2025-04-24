"use client";

import React, { useEffect, useState, useMemo } from "react";
import { WalletSession } from "@/components/dashboard";
import { AddressCard } from "@/components/Account/AddressCard";
import { BalanceAndAssets } from "@/components/Account/BalanceAndAssets";
import { WithdrawalsTable } from "@/components/Account/WithdrawalsTable";
import { StakesTable } from "@/components/Account/StakesTable";
import { TransactionsTable } from "@/components/Account/TransactionsTable";
import { AccountInfo } from "@/components/Account/AccountInfo";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, useParams } from "next/navigation";
import { useBalance, useAccount, useWalletClient } from "wagmi";
import { useValidators } from "@/services/queries/validators";

import { useWithdrawHistoryQuery } from "@/services/queries/withdrawals";
import { useTransactionsQuery } from "@/services/queries/transactions";
import { useDelegationsQuery } from "@/services/queries/delegations";
import { useRewardsQuery } from "@/services/queries/rewards";
import { useWithdrawalsQuery } from "@/services/queries/withdrawals";

import { toast } from "react-toastify";
import {
  useRedelegateMutation,
  useUndelegateMutation,
} from "@/services/mutations/staking";
import { useHexToBech } from "@/services/hooks/addressConvertion";

interface Theme {
  bgColor: string;
  boxColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
}

interface RedelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  validatorAddress: string;
  theme: Theme;
  validators: Record<string, string>;
}

interface DelegationResponse {
  delegation: {
    validator_address: string;
    shares: string;
  };
  balance: {
    amount: string;
    denom: string;
  };
}

interface FormattedDelegation {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
    moniker?: string;
  };
  balance: {
    amount: string;
    denom: string;
  };
}

const RedelegateModal = ({
  isOpen,
  onClose,
  validatorAddress,
  theme,
  validators,
}: RedelegateModalProps) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const [destinationValidator, setDestinationValidator] = useState("");

  const redelegateMutation = useRedelegateMutation();

  const handleRedelegate = async () => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    redelegateMutation.mutate(
      {
        walletClient,
        amount,
        validatorAddress,
        destinationAddr: destinationValidator,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 w-96"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 className="text-xl mb-4" style={{ color: theme.primaryTextColor }}>
          Redelegate Tokens
        </h2>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
          }}
        />
        <select
          value={destinationValidator}
          onChange={(e) => setDestinationValidator(e.target.value)}
          className="w-full p-2 mb-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
          }}
        >
          <option value="">Select Destination Validator</option>
          {Object.entries(validators).map(([address, moniker]) => (
            <option key={address} value={address}>
              {moniker}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.bgColor,
              color: theme.primaryTextColor,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleRedelegate}
            disabled={redelegateMutation.isPending}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
            }}
          >
            {redelegateMutation.isPending ? "Processing..." : "Redelegate"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface UndelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  validatorAddress: string;
  theme: Theme;
}

const UndelegateModal = ({
  isOpen,
  onClose,
  validatorAddress,
  theme,
}: UndelegateModalProps) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const [buttonText, setButtonText] = useState("Undelegate");

  const undelegateMutation = useUndelegateMutation();

  const handleUndelegate = async () => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    setButtonText("Processing...");

    try {
      await undelegateMutation.mutateAsync({
        walletClient,
        amount,
        validatorAddress,
      });
      toast.success(
        "Successfully undelegated tokens\nYour tokens will be available after the unbonding period of 21 days"
      );
      onClose();
    } catch (error) {
      console.error("Error undelegating:", error);
      toast.error(
        "Failed to undelegate tokens\nPlease try again or check your wallet connection"
      );
      setButtonText("Undelegate");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 w-96"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 className="text-xl mb-4" style={{ color: theme.primaryTextColor }}>
          Undelegate Tokens
        </h2>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.bgColor,
              color: theme.primaryTextColor,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUndelegate}
            disabled={undelegateMutation.isPending}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
              opacity: undelegateMutation.isPending ? 0.7 : 1,
              cursor: undelegateMutation.isPending ? "not-allowed" : "pointer",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AddressPage() {
  const { address: paramAddress } = useParams();
  const { address: connectedAddress } = useAccount();
  const validAddress =
    typeof paramAddress === "string" && paramAddress.startsWith("0x")
      ? (paramAddress as `0x${string}`)
      : undefined;
  const { data: balance } = useBalance({ address: validAddress });
  const router = useRouter();
  const [session, setSession] = useState<WalletSession | null>(null);
  const { theme } = useTheme();
  const [delegations, setDelegations] = useState<FormattedDelegation[]>([]);
  const { data: validators } = useValidators();
  const validatorMap = useMemo(
    () => validators?.validatorMap || ({} as Record<string, string>),
    [validators?.validatorMap]
  );
  const [selectedValidator, setSelectedValidator] = useState("");
  const [isRedelegateModalOpen, setIsRedelegateModalOpen] = useState(false);
  const [isUndelegateModalOpen, setIsUndelegateModalOpen] = useState(false);
  const [percentages, setPercentages] = useState({
    balancePercentage: "0",
    stakingPercentage: "0",
    rewardsPercentage: "0",
    withdrawalsPercentage: "0",
  });

  const { cosmosAddress } = useHexToBech(paramAddress as string);

  const formatAmount = (amount: string, decimals: number = 6) => {
    const value = parseInt(amount);
    if (isNaN(value)) return "0";
    return (value / Math.pow(10, decimals)).toFixed(2);
  };

  const {
    data: transactionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsQuery(cosmosAddress!);

  const { data: delegationsData } = useDelegationsQuery(cosmosAddress!);
  const { data: rewardsData } = useRewardsQuery(cosmosAddress!);
  const { data: withdrawalsData } = useWithdrawalsQuery(cosmosAddress!);

  const { data: withdrawHistoryData } = useWithdrawHistoryQuery(
    cosmosAddress!,
    withdrawalsData?.withdraw_address
  );

  const isOwner =
    connectedAddress?.toLowerCase() === validAddress?.toLowerCase();

  useEffect(() => {
    if (!paramAddress) {
      router.push("/");
      return;
    }

    if (
      delegationsData &&
      rewardsData &&
      withdrawalsData &&
      withdrawHistoryData
    ) {
      const walletData: WalletSession = {
        balance: balance?.formatted || "0",
        staking: "0 KII",
        reward: "0 KII",
        withdrawals: "0 KII",
        stakes: [],
      };

      let totalStaking = 0;
      if (delegationsData.delegation_responses) {
        totalStaking = delegationsData.delegation_responses.reduce(
          (sum: number, del: { balance: { amount: string } }) =>
            sum + parseInt(del.balance.amount),
          0
        );
      }

      let totalRewards = 0;
      if (rewardsData.total) {
        const ukiiRewards = rewardsData.total.find(
          (reward: { denom: string }) => reward.denom === "ukii"
        );
        if (ukiiRewards) {
          totalRewards = parseInt(ukiiRewards.amount);
        }
      }

      const normalBalance = parseFloat(balance?.formatted || "0");
      const stakingBalance = parseFloat(formatAmount(totalStaking.toString()));
      const totalBalance = normalBalance + stakingBalance;

      let totalWithdrawn = 0;
      if (withdrawHistoryData?.rewards) {
        const ukiiWithdraws = withdrawHistoryData.rewards.find(
          (reward: { denom: string }) => reward.denom === "ukii"
        );
        if (ukiiWithdraws) {
          totalWithdrawn = parseInt(ukiiWithdraws.amount);
        }
      }

      const withdrawBalance = parseFloat(
        formatAmount(totalWithdrawn.toString())
      );
      const totalWithWithdraws = totalBalance + withdrawBalance;

      setPercentages({
        balancePercentage: ((normalBalance / totalWithWithdraws) * 100).toFixed(
          2
        ),
        stakingPercentage: ((stakingBalance / totalWithdrawn) * 100).toFixed(2),
        rewardsPercentage: (
          (totalRewards / Math.pow(10, 6) / totalWithdrawn) *
          100
        ).toFixed(2),
        withdrawalsPercentage: (
          (withdrawBalance / totalWithdrawn) *
          100
        ).toFixed(2),
      });

      walletData.staking = `${formatAmount(totalStaking.toString())} KII`;
      walletData.reward = `${formatAmount(totalRewards.toString())} KII`;
      walletData.withdrawals = `${formatAmount(totalWithdrawn.toString())} KII`;

      if (delegationsData.delegation_responses) {
        const formattedDelegations = delegationsData.delegation_responses.map(
          (del: DelegationResponse) => ({
            delegation: {
              ...del.delegation,
              delegator_address: cosmosAddress!,
              shares: formatAmount(del.delegation.shares),
              moniker:
                validatorMap[del.delegation.validator_address] || "Unknown",
            },
            balance: {
              ...del.balance,
              amount: formatAmount(del.balance.amount),
            },
          })
        );
        setDelegations(formattedDelegations);
      }

      setSession(walletData);
    }
  }, [
    paramAddress,
    router,
    balance,
    delegationsData,
    rewardsData,
    withdrawalsData,
    withdrawHistoryData,
    validatorMap,
    cosmosAddress,
  ]);

  const transactions =
    transactionsData?.pages.flatMap((page) =>
      page.txs.map((tx) => ({
        height: "0",
        hash: tx.hash,
        messages:
          tx.amount === "EVM Contract Call"
            ? "Contract Interaction"
            : `Transfer ${tx.amount} ${tx.denom}`,
        time: tx.timestamp,
      }))
    ) || [];

  return (
    <div className={`mx-6 px-6 bg-[${theme.bgColor}]`}>
      <AddressCard
        account={typeof paramAddress === "string" ? paramAddress : ""}
      />
      <BalanceAndAssets
        assets={[
          {
            name: "Balance",
            amount: session?.balance || "0.0000",
            value: `$${session?.balance || "0.0000"}`,
            percentage: `${percentages.balancePercentage}%`,
          },
          {
            name: "Stake",
            amount: session?.staking || "0.0000 KII",
            value: `$${session?.staking?.replace(" KII", "") || "0.0000"}`,
            percentage: `${percentages.stakingPercentage}%`,
          },
          {
            name: "Reward",
            amount: session?.reward || "0.0000 KII",
            value: `$${session?.reward?.replace(" KII", "") || "0.0000"}`,
            percentage: `${percentages.rewardsPercentage}%`,
          },
          {
            name: "Withdrawals",
            amount: session?.withdrawals || "0.0000 KII",
            value: `$${session?.withdrawals?.replace(" KII", "") || "0.0000"}`,
            percentage: `${percentages.withdrawalsPercentage}%`,
          },
        ]}
      />
      <WithdrawalsTable withdrawals={[]} />
      <StakesTable
        delegations={delegations}
        validators={validatorMap}
        theme={theme}
        selectedValidator={selectedValidator}
        setSelectedValidator={setSelectedValidator}
        setIsRedelegateModalOpen={setIsRedelegateModalOpen}
        setIsUndelegateModalOpen={setIsUndelegateModalOpen}
        isRedelegateModalOpen={isRedelegateModalOpen}
        isUndelegateModalOpen={isUndelegateModalOpen}
        isOwner={isOwner}
      />
      <TransactionsTable
        transactions={transactions}
        onLoadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
      />
      <AccountInfo
        account={typeof paramAddress === "string" ? paramAddress : ""}
      />

      <RedelegateModal
        isOpen={isRedelegateModalOpen}
        onClose={() => setIsRedelegateModalOpen(false)}
        validatorAddress={selectedValidator}
        theme={theme}
        validators={validatorMap}
      />
      <UndelegateModal
        isOpen={isUndelegateModalOpen}
        onClose={() => setIsUndelegateModalOpen(false)}
        validatorAddress={selectedValidator}
        theme={theme}
      />
    </div>
  );
}
