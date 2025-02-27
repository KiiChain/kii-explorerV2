import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Contract, ethers } from "ethers";
import { STAKING_PRECOMPILE_ABI } from "@/lib/abi/staking";
import { toast } from "react-toastify";

interface Theme {
  boxColor: string;
  primaryTextColor: string;
  bgColor: string;
  accentColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

interface Validator {
  operator_address: string;
  description: {
    moniker: string;
  };
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
  theme,
  selectedValidator,
  setSelectedValidator,
  setIsRedelegateModalOpen,
  setIsUndelegateModalOpen,
  isRedelegateModalOpen,
  isUndelegateModalOpen,
}: Omit<StakeProps, "validators">) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [validators, setValidators] = useState<Record<string, string>>({});
  const [validatorDetails, setValidatorDetails] = useState<
    Record<string, ValidatorDetails>
  >({});

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const response = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
        );
        const data = await response.json();

        if (data.validators) {
          const validatorsMap: Record<string, string> = {};

          data.validators.forEach((validator: Validator) => {
            validatorsMap[validator.operator_address] =
              validator.description.moniker;

            const addressWithoutPrefix = validator.operator_address.replace(
              "kiivaloper",
              ""
            );
            validatorsMap[addressWithoutPrefix] = validator.description.moniker;
          });

          console.log("Validators mapping:", validatorsMap);
          setValidators(validatorsMap);
        }
      } catch (error) {
        console.error("Error fetching validators:", error);
      }
    };

    fetchValidators();
  }, []);

  useEffect(() => {
    const fetchValidatorDetails = async (operatorAddress: string) => {
      try {
        const response = await fetch(
          `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators/${operatorAddress}`
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

  const handleRedelegate = async (
    validatorAddress: string,
    destinationAddr: string,
    amount: string
  ) => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
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
      toast.success("Redelegation successful!");
      setIsRedelegateModalOpen(false);
      window.location.reload();
    } catch (error: unknown) {
      console.error("Redelegation error:", error);
      toast.error(
        "Failed to redelegate tokens. Please check the console for details."
      );
    }
  };

  const handleUndelegate = async (validatorAddress: string, amount: string) => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
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
      toast.success("Undelegation successful!");
      setIsUndelegateModalOpen(false);
      window.location.reload();
    } catch (error: unknown) {
      console.error("Undelegation error:", error);
      toast.error(
        "Failed to undelegate tokens. Please check the console for details."
      );
    }
  };

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
                    {`${delegation.balance.amount} ${delegation.balance.denom}`}
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                      onClick={() => {
                        setSelectedValidator(
                          delegation.delegation.validator_address
                        );
                        setIsRedelegateModalOpen(true);
                      }}
                    >
                      Relocate
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
