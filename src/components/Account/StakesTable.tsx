import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";

import { toast } from "react-toastify";
import { useRedelegations } from "../../services/queries/redelegations";

import { useValidatorQueries } from "@/services/queries/validators";
import { useValidatorRewardsQueries } from "@/services/queries/validatorRewards";
import {
  useRedelegateMutation,
  useUndelegateMutation,
} from "@/services/mutations/staking";
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";
import { useDelegationHistory } from "../../services/queries/delegationHistory";
import { Table } from "@/components/ui/Table/Table";
import { formatAmount } from "../../utils/format";
import { useHexToBech } from "@/services/hooks/addressConvertion";

interface Theme {
  boxColor: string;
  primaryTextColor: string;
  bgColor: string;
  accentColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

interface DelegationResponse {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
    moniker?: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
}

interface ValidatorReward {
  denom: string;
  amount: string;
}

interface StakeProps {
  delegations: DelegationResponse[];
  validators: Record<string, string>;
  theme: Theme;
  selectedValidator: string;
  setSelectedValidator: (validator: string) => void;
  setIsRedelegateModalOpen: (isOpen: boolean) => void;
  setIsUndelegateModalOpen: (isOpen: boolean) => void;
  isRedelegateModalOpen: boolean;
  isUndelegateModalOpen: boolean;
  isOwner: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  validators: Record<string, string>;
  selectedValidator: string;
  onRedelegate: (
    validatorAddress: string,
    destinationAddr: string,
    amount: string
  ) => Promise<void>;
}

interface UndelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  selectedValidator: string;
}

interface RedelegationEntry {
  redelegation_entry: {
    completion_time: string;
  };
}

interface RedelegationResponse {
  redelegation: {
    validator_dst_address: string;
    validator_src_address: string;
  };
  entries: RedelegationEntry[];
}

const RedelegateModal = ({
  isOpen,
  onClose,
  theme,
  validators,
  selectedValidator,
  onRedelegate,
}: ModalProps) => {
  const [amount, setAmount] = useState("");
  const [destinationValidator, setDestinationValidator] = useState("");

  const validatorOptions = Object.entries(validators).filter(
    ([address]) => address !== selectedValidator
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 w-96"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 className="text-xl mb-4" style={{ color: theme.primaryTextColor }}>
          Redelegate from {validators[selectedValidator] || "Unknown"}
        </h2>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              setAmount(value);
            }
          }}
          className="w-full p-2 mb-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
            border: `1px solid ${theme.borderColor}`,
          }}
        />
        <select
          value={destinationValidator}
          onChange={(e) => setDestinationValidator(e.target.value)}
          className="w-full p-2 mb-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          <option value="">Select Destination Validator</option>
          {validatorOptions.map(([address, moniker]) => (
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
              border: `1px solid ${theme.borderColor}`,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onRedelegate(selectedValidator, destinationValidator, amount)
            }
            disabled={!amount || !destinationValidator}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
              opacity: !amount || !destinationValidator ? 0.5 : 1,
            }}
          >
            Redelegate
          </button>
        </div>
      </div>
    </div>
  );
};

const UndelegateModal = ({
  isOpen,
  onClose,
  theme,
  selectedValidator,
}: UndelegateModalProps) => {
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const undelegateMutation = useUndelegateMutation();

  const handleUndelegate = async () => {
    if (!walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await undelegateMutation.mutateAsync({
        validatorAddress: selectedValidator,
        amount,
        walletClient,
      });

      toast.success(
        "Successfully undelegated tokens\nYour tokens will be available after the unbonding period of 21 days"
      );
      onClose();
    } catch (error) {
      console.error("Undelegation error:", error);
      toast.error(
        "Failed to undelegate tokens\nPlease try again or check your wallet connection"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              setAmount(value);
            }
          }}
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
            }}
          >
            {undelegateMutation.isPending ? "In Process" : "Undelegate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export function StakesTable({
  delegations,
  validators = {},
  theme,
  selectedValidator,
  setSelectedValidator,
  setIsRedelegateModalOpen,
  setIsUndelegateModalOpen,
  isRedelegateModalOpen,
  isUndelegateModalOpen,
  isOwner,
}: StakeProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { cosmosAddress } = useHexToBech(address!);
  const { data: redelegations } = useRedelegations(cosmosAddress!);
  const validatorQueries = useValidatorQueries(delegations);
  const rewardsQueries = useValidatorRewardsQueries(
    cosmosAddress!,
    delegations
  );
  const redelegateMutation = useRedelegateMutation();
  const { data: delegationHistory } = useDelegationHistory(cosmosAddress!);

  const [relocateButtonStates, setRelocateButtonStates] = useState<{
    [key: string]: string;
  }>({});
  const [withdrawButtonStates, setWithdrawButtonStates] = useState<{
    [key: string]: string;
  }>({});

  console.log("Cosmos Address:", cosmosAddress);
  console.log("Redelegations:", redelegations);

  const getValidatorMoniker = (operatorAddress: string): string => {
    if (!operatorAddress) return "Unknown";

    const queryIndex = delegations.findIndex(
      (d) => d.delegation?.validator_address === operatorAddress
    );
    const query = validatorQueries[queryIndex];

    if (query?.isLoading) return "Loading...";
    if (query?.isError) return "Error loading validator";
    if (query?.data) return query.data.moniker;

    return "Unknown";
  };

  const handleRedelegate = async (
    validatorAddress: string,
    destinationAddr: string,
    amount: string
  ) => {
    if (!walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }
    redelegateMutation.mutate(
      { validatorAddress, destinationAddr, amount, walletClient },
      {
        onSuccess: () => setIsRedelegateModalOpen(false),
      }
    );
  };

  const hasActiveRedelegation = useCallback(
    (redelegations: RedelegationResponse[], validatorAddress: string) => {
      const activeRedelegation = redelegations.find((r) => {
        const isInvolved =
          r.redelegation.validator_src_address === validatorAddress ||
          r.redelegation.validator_dst_address === validatorAddress;

        if (!isInvolved) return false;

        return r.entries.some((entry) => {
          const completionTime = new Date(
            entry.redelegation_entry.completion_time
          );
          return completionTime > new Date();
        });
      });

      if (activeRedelegation && activeRedelegation.entries.length > 0) {
        const latestCompletion = activeRedelegation.entries.reduce(
          (latest, entry) => {
            const completionTime = new Date(
              entry.redelegation_entry.completion_time
            );
            return completionTime > latest ? completionTime : latest;
          },
          new Date(0)
        );

        return {
          hasRedelegation: true,
          completionTime: latestCompletion.toLocaleString(),
        };
      }

      return {
        hasRedelegation: false,
        completionTime: "",
      };
    },
    []
  );

  const getValidatorRewards = useCallback(
    (validatorAddress: string): ValidatorReward[] => {
      const queryIndex = delegations.findIndex(
        (d) => d.delegation?.validator_address === validatorAddress
      );
      const query = rewardsQueries[queryIndex];
      return query?.data || [];
    },
    [delegations, rewardsQueries]
  );

  const handleRedelegateClick = useCallback((validatorAddress: string) => {
    setRelocateButtonStates((prev) => ({
      ...prev,
      [validatorAddress]: "Processing...",
    }));
    setSelectedValidator(validatorAddress);
    setIsRedelegateModalOpen(true);
  }, []);

  const handleUndelegateClick = useCallback((validatorAddress: string) => {
    setWithdrawButtonStates((prev) => ({
      ...prev,
      [validatorAddress]: "In Process",
    }));
    setSelectedValidator(validatorAddress);
    setIsUndelegateModalOpen(true);
  }, []);

  useEffect(() => {
    if (!isUndelegateModalOpen && selectedValidator) {
      setWithdrawButtonStates((prev) => ({
        ...prev,
        [selectedValidator]: "Withdraw",
      }));
    }
  }, [isUndelegateModalOpen, selectedValidator]);

  const columns = useMemo(
    () => [
      {
        header: "Validator",
        key: "validator",
        render: (delegation: DelegationResponse) => {
          const validatorAddress = delegation.delegation?.validator_address;
          const moniker = getValidatorMoniker(validatorAddress);
          return (
            <div className="min-w-[150px]">
              <div
                className="text-base font-medium"
                style={{ color: theme.primaryTextColor }}
              >
                {moniker}
              </div>
            </div>
          );
        },
      },
      {
        header: "Shares",
        key: "shares",
        render: (delegation: DelegationResponse) =>
          delegation.delegation.shares,
      },
      {
        header: "Balance",
        key: "balance",
        render: (delegation: DelegationResponse) => {
          const validatorAddress = delegation.delegation?.validator_address;
          const validatorRewards = getValidatorRewards(validatorAddress);
          const formattedRewards = validatorRewards
            .filter((reward) => reward.denom === "ukii")
            .map((reward) => formatAmount(reward.amount))
            .join(" ");

          return (
            <div>
              <div>
                {delegation.balance.amount} {delegation.balance.denom}
              </div>
              {formattedRewards && (
                <div className={`text-xs text-[${theme.secondaryTextColor}]`}>
                  Claimable: {formattedRewards} KII
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Delegation History",
        key: "history",
        render: (delegation: DelegationResponse) => {
          const validatorHistory = delegationHistory?.find(
            (hist) =>
              hist.validator_address === delegation.delegation.validator_address
          );

          return (
            <div className="min-w-[250px] space-y-2 p-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Total Delegated:
                </span>
                <span
                  className="ml-2"
                  style={{ color: theme.secondaryTextColor }}
                >
                  {formatAmount(validatorHistory?.total_delegated || "0")} KII
                </span>
              </div>

              {(validatorHistory?.redelegations ?? []).length > 0 && (
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Redelegations:
                  </span>
                  {(validatorHistory?.redelegations ?? []).map((redel, idx) => (
                    <div
                      key={idx}
                      className="ml-2 flex items-center justify-between"
                    >
                      <span style={{ color: theme.secondaryTextColor }}>
                        {formatAmount(redel.amount)} KII
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: theme.secondaryTextColor }}
                      >
                        (completes{" "}
                        {new Date(redel.completion_time).toLocaleDateString()})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {(validatorHistory?.unbondings ?? []).length > 0 && (
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Unbondings:
                  </span>
                  {(validatorHistory?.unbondings ?? []).map((unbond, idx) => (
                    <div
                      key={idx}
                      className="ml-2 flex items-center justify-between"
                    >
                      <span style={{ color: theme.secondaryTextColor }}>
                        {formatAmount(unbond.amount)} KII
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: theme.secondaryTextColor }}
                      >
                        (completes{" "}
                        {new Date(unbond.completion_time).toLocaleDateString()})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Action",
        key: "action",
        render: (delegation: DelegationResponse) => {
          const validatorAddress = delegation.delegation?.validator_address;
          const { hasRedelegation, completionTime } = hasActiveRedelegation(
            redelegations?.redelegation_responses || [],
            validatorAddress || ""
          );

          return !isConnected ? (
            <div className="flex gap-2 justify-center">
              <WagmiConnectButton />
            </div>
          ) : isOwner ? (
            <div className="flex gap-2 justify-center">
              <button
                className={`px-4 py-2 rounded-lg ${
                  hasRedelegation
                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                    : `bg-[${theme.boxColor}] hover:opacity-80`
                }`}
                onClick={() => handleRedelegateClick(validatorAddress)}
                disabled={hasRedelegation}
                title={
                  hasRedelegation
                    ? `Redelegation in progress until ${completionTime}`
                    : "Relocate stake"
                }
              >
                {relocateButtonStates[validatorAddress] ||
                  (hasRedelegation ? "In Progress" : "Relocate")}
              </button>
              <button
                className={`px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                onClick={() => handleUndelegateClick(validatorAddress)}
              >
                {withdrawButtonStates[validatorAddress] || "Withdraw"}
              </button>
            </div>
          ) : null;
        },
      },
    ],
    [
      theme,
      isOwner,
      isConnected,
      hasActiveRedelegation,
      redelegations,
      handleRedelegateClick,
      handleUndelegateClick,
      relocateButtonStates,
      withdrawButtonStates,
      delegationHistory,
      getValidatorMoniker,
    ]
  );

  if (!delegations || delegations.length === 0) {
    return (
      <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Stakes
        </div>
        <Table
          columns={columns}
          data={[]}
          theme={theme}
          emptyMessage="No stakes found"
        />
      </div>
    );
  }

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className="mb-6">
        <div
          className={`text-[${theme.primaryTextColor}] mb-4 text-xl pb-2 border-b border-[${theme.borderColor}]`}
        >
          Stakes
        </div>
        <div className="overflow-x-auto">
          <div className="w-full min-w-[800px]">
            <Table columns={columns} data={delegations} theme={theme} />
          </div>
        </div>
      </div>
      <RedelegateModal
        isOpen={isRedelegateModalOpen}
        onClose={() => setIsRedelegateModalOpen(false)}
        theme={theme}
        validators={validators}
        selectedValidator={selectedValidator}
        onRedelegate={handleRedelegate}
      />
      <UndelegateModal
        isOpen={isUndelegateModalOpen}
        onClose={() => setIsUndelegateModalOpen(false)}
        theme={theme}
        selectedValidator={selectedValidator}
      />
    </div>
  );
}
