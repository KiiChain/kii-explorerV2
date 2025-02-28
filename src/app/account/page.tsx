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
import { useBalance, useAccount, useWalletClient } from "wagmi";
import { useValidators } from "../../services/queries/validators";
import {
  useRedelegations,
  hasActiveRedelegation,
} from "@/services/queries/redelegations";

import { toast } from "react-toastify";
import {
  useRedelegateMutation,
  useUndelegateMutation,
} from "@/services/mutations/staking";

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

const RedelegateModal = ({
  isOpen,
  onClose,
  validatorAddress,
  theme,
  validators,
}: RedelegateModalProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const [destinationValidator, setDestinationValidator] = useState("");
  const { data: redelegations } = useRedelegations(address);

  const { hasRedelegation, completionTime } = hasActiveRedelegation(
    redelegations,
    destinationValidator
  );

  const redelegateMutation = useRedelegateMutation();

  const handleRedelegate = async () => {
    if (!address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    redelegateMutation.mutate(
      {
        walletClient,
        amount,
        validatorAddress,
        destinationValidator,
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
          {Object.entries(validators).map(([address, moniker]) => {
            const { hasRedelegation, completionTime } = hasActiveRedelegation(
              redelegations,
              address
            );
            return (
              <option key={address} value={address} disabled={hasRedelegation}>
                {moniker}{" "}
                {hasRedelegation ? `(Available after ${completionTime})` : ""}
              </option>
            );
          })}
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
            disabled={!amount || !destinationValidator || hasRedelegation}
            className={`px-4 py-2 rounded ${
              hasRedelegation || !amount || !destinationValidator
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
            }}
          >
            {hasRedelegation
              ? `Redelegation in Progress (until ${completionTime})`
              : "Redelegate"}
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
  const [isLoading, setIsLoading] = useState(false);

  const undelegateMutation = useUndelegateMutation();

  const handleUndelegate = async () => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);
      await undelegateMutation.mutateAsync({
        walletClient,
        amount,
        validatorAddress,
      });
      onClose();
    } catch (error) {
      console.error("Error undelegating:", error);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
            }}
          >
            {isLoading ? "Processing..." : "Undelegate"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const { data: validators = {} } = useValidators();
  const [selectedValidator, setSelectedValidator] = useState("");
  const [isRedelegateModalOpen, setIsRedelegateModalOpen] = useState(false);
  const [isUndelegateModalOpen, setIsUndelegateModalOpen] = useState(false);

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
        await fetchAccountData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [address, router, balance]);

  const fetchAccountData = async () => {
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
          const [stakingResponse, rewardsResponse] = await Promise.all([
            fetch(
              `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${kiiAddress}`
            ),
            fetch(
              `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${kiiAddress}/rewards`
            ),
          ]);

          const stakingData = await stakingResponse.json();
          const rewardsData = await rewardsResponse.json();

          let totalStaking = 0;
          if (stakingData.delegation_responses) {
            totalStaking = stakingData.delegation_responses.reduce(
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
          const stakingBalance = parseFloat(
            formatAmount(totalStaking.toString())
          );

          const totalBalance = normalBalance + stakingBalance;

          walletData.balance = totalBalance.toFixed(4);
          walletData.staking = `${formatAmount(totalStaking.toString())} KII`;
          walletData.reward = `${formatAmount(totalRewards.toString())} KII`;

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
                    validators[del.delegation.validator_address] || "Unknown",
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
      <WithdrawalsTable withdrawals={[]} />
      <StakesTable
        delegations={delegations}
        validators={validators}
        theme={theme}
        selectedValidator={selectedValidator}
        setSelectedValidator={setSelectedValidator}
        setIsRedelegateModalOpen={setIsRedelegateModalOpen}
        setIsUndelegateModalOpen={setIsUndelegateModalOpen}
        isRedelegateModalOpen={isRedelegateModalOpen}
        isUndelegateModalOpen={isUndelegateModalOpen}
      />
      <TransactionsTable transactions={transactions} />
      <AccountInfo account={typeof address === "string" ? address : ""} />

      <RedelegateModal
        isOpen={isRedelegateModalOpen}
        onClose={() => setIsRedelegateModalOpen(false)}
        validatorAddress={selectedValidator}
        theme={theme}
        validators={validators}
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
