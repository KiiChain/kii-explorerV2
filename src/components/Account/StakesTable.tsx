import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Contract, ethers } from "ethers";
import { STAKING_PRECOMPILE_ABI } from "@/lib/abi/staking";
import { toast } from "react-toastify";
import { useRedelegations } from "../../services/queries/redelegations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCosmosAddress } from "@/services/queries/cosmosAddress";
import { API_ENDPOINTS } from "@/constants/endpoints";

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
  onUndelegate: (validatorAddress: string, amount: string) => Promise<void>;
  validators: Record<string, string>;
}

interface ValidatorDetails {
  moniker: string;
  operator_address: string;
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
  onUndelegate,
}: UndelegateModalProps) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!amount) return;
    await onUndelegate(selectedValidator, amount);
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
            onClick={handleSubmit}
            disabled={!amount}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
              opacity: !amount ? 0.5 : 1,
            }}
          >
            Undelegate
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
}: StakeProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: cosmosAddress } = useCosmosAddress(address);

  const { data: redelegations } = useRedelegations(cosmosAddress);

  console.log("Cosmos Address:", cosmosAddress);
  console.log("Redelegations:", redelegations);

  const [validatorDetails, setValidatorDetails] = useState<
    Record<string, ValidatorDetails>
  >({});

  useEffect(() => {
    const fetchValidatorDetails = async (operatorAddress: string) => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators/${operatorAddress}`
        );
        const data = await response.json();

        if (data.validator) {
          setValidatorDetails((prev) => ({
            ...prev,
            [operatorAddress]: {
              moniker: data.validator.description.moniker,
              operator_address: data.validator.operator_address,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Error fetching validator details for ${operatorAddress}:`,
          error
        );
      }
    };

    if (delegations) {
      delegations.forEach((delegation) => {
        const operatorAddress = delegation.delegation?.validator_address;
        if (operatorAddress && !validatorDetails[operatorAddress]) {
          fetchValidatorDetails(operatorAddress);
        }
      });
    }
  }, [delegations]);

  const getValidatorMoniker = (operatorAddress: string): string => {
    if (!operatorAddress) return "Unknown";

    const details = validatorDetails[operatorAddress];
    if (details) {
      return details.moniker;
    }

    return "Loading...";
  };

  const queryClient = useQueryClient();

  const redelegateMutation = useMutation({
    mutationFn: async ({
      validatorAddress,
      destinationAddr,
      amount,
    }: {
      validatorAddress: string;
      destinationAddr: string;
      amount: string;
    }) => {
      if (!address || !walletClient) {
        throw new Error("Please connect your wallet first");
      }

      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const stakingContract = new Contract(
        "0x0000000000000000000000000000000000001005",
        STAKING_PRECOMPILE_ABI,
        signer
      );

      const amountInWei = ethers.parseUnits(amount, 6);

      console.log("Redelegation Details:", {
        sourceValidator: validatorAddress,
        destinationValidator: destinationAddr,
        amount: amount,
        amountInWei: amountInWei.toString(),
      });

      const tx = await stakingContract.redelegate(
        validatorAddress,
        destinationAddr,
        amountInWei
      );
      await tx.wait();
    },
    onSuccess: () => {
      toast.success("Redelegation successful!");
      setIsRedelegateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["delegations"] }); // Adjust query key as needed
    },
    onError: (error) => {
      console.error("Redelegation error:", error);
      toast.error(
        "Failed to redelegate tokens. Please check the console for details."
      );
    },
  });

  const handleRedelegate = async (
    validatorAddress: string,
    destinationAddr: string,
    amount: string
  ) => {
    redelegateMutation.mutate({ validatorAddress, destinationAddr, amount });
  };

  const undelegateMutation = useMutation({
    mutationFn: async ({
      validatorAddress,
      amount,
    }: {
      validatorAddress: string;
      amount: string;
    }) => {
      if (!address || !walletClient) {
        throw new Error("Please connect your wallet first");
      }

      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const stakingContract = new Contract(
        "0x0000000000000000000000000000000000001005",
        STAKING_PRECOMPILE_ABI,
        signer
      );

      const amountInWei = ethers.parseUnits(amount, 6);

      console.log("Undelegation Details:", {
        validator: validatorAddress,
        amount: amount,
        amountInWei: amountInWei.toString(),
      });

      const tx = await stakingContract.undelegate(
        validatorAddress,
        amountInWei
      );
      await tx.wait();
    },
    onSuccess: () => {
      toast.success("Undelegation successful!");
      setIsUndelegateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
    },
    onError: (error) => {
      console.error("Undelegation error:", error);
      toast.error(
        "Failed to undelegate tokens. Please check the console for details."
      );
    },
  });

  const handleUndelegate = async (validatorAddress: string, amount: string) => {
    undelegateMutation.mutate({ validatorAddress, amount });
  };

  const hasActiveRedelegation = (
    redelegations: RedelegationResponse[],
    validatorAddress: string
  ): { hasRedelegation: boolean; completionTime: string } => {
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
  };

  const fetchValidatorRewards = async (
    delegatorAddress: string,
    validatorAddress: string
  ) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}`
      );
      const data = await response.json();
      return data.rewards || [];
    } catch (error) {
      console.error("Error fetching validator rewards:", error);
      return [];
    }
  };

  const formatAmount = (amount: string, decimals: number = 6) => {
    const value = parseInt(amount);
    if (isNaN(value)) return "0";
    return (value / Math.pow(10, decimals)).toFixed(2);
  };

  const [rewardsMap, setRewardsMap] = useState<
    Record<string, ValidatorReward[]>
  >({});

  useEffect(() => {
    delegations.forEach((delegation) => {
      const validatorAddress = delegation.delegation?.validator_address;
      if (cosmosAddress && validatorAddress) {
        fetchValidatorRewards(cosmosAddress, validatorAddress).then((rewards) =>
          setRewardsMap((prev) => ({
            ...prev,
            [validatorAddress]: rewards,
          }))
        );
      }
    });
  }, [cosmosAddress, delegations]);

  if (!delegations || delegations.length === 0) {
    return (
      <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Stakes
        </div>
        <div className={`text-[${theme.secondaryTextColor}] text-center py-4`}>
          No stakes found
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl pb-2`}>
          Stakes
        </div>
        <table className="w-full">
          <thead>
            <tr className={`text-left text-[${theme.secondaryTextColor}]`}>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Validator
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Shares
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Balance
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {delegations.map((delegation, index) => {
              const validatorAddress = delegation.delegation?.validator_address;
              const moniker = getValidatorMoniker(validatorAddress);
              const { hasRedelegation, completionTime } = hasActiveRedelegation(
                redelegations?.redelegation_responses || [],
                validatorAddress || ""
              );

              const validatorRewards = rewardsMap[validatorAddress] || [];
              const formattedRewards = validatorRewards
                .filter((reward) => reward.denom === "ukii")
                .map((reward) => formatAmount(reward.amount))
                .join(" ");

              console.log(
                "Checking redelegation for:",
                validatorAddress,
                hasRedelegation
              );

              return (
                <tr
                  key={index}
                  className={`border border-solid border-[${theme.borderColor}]`}
                  style={{
                    backgroundColor: theme.bgColor,
                  }}
                >
                  <td
                    className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                  >
                    <div>
                      <div className={`text-[${theme.primaryTextColor}]`}>
                        {moniker}
                      </div>
                      <div
                        className={`text-xs text-[${theme.secondaryTextColor}]`}
                      ></div>
                    </div>
                  </td>
                  <td
                    className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                  >
                    {delegation.delegation.shares}
                  </td>
                  <td
                    className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                  >
                    <div>
                      <div className={`text-[${theme.primaryTextColor}]`}>
                        {delegation.balance.amount} {delegation.balance.denom}
                      </div>
                      {formattedRewards && (
                        <div
                          className={`text-xs text-[${theme.secondaryTextColor}]`}
                        >
                          Claimable: {formattedRewards} KII
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        hasRedelegation
                          ? "bg-gray-400 cursor-not-allowed opacity-50"
                          : `bg-[${theme.boxColor}] hover:opacity-80`
                      }`}
                      onClick={() => {
                        if (!hasRedelegation) {
                          setSelectedValidator(validatorAddress || "");
                          setIsRedelegateModalOpen(true);
                        }
                      }}
                      disabled={hasRedelegation}
                      title={
                        hasRedelegation
                          ? `Redelegation in progress until ${completionTime}`
                          : "Relocate stake"
                      }
                    >
                      {hasRedelegation ? "In Progress" : "Relocate"}
                    </button>
                    <button
                      className={`ml-2 px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                      onClick={() => {
                        setSelectedValidator(
                          delegation.delegation.validator_address
                        );
                        setIsUndelegateModalOpen(true);
                      }}
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        onUndelegate={handleUndelegate}
        validators={validators}
      />
    </div>
  );
}
