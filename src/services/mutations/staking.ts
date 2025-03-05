import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers, Contract } from "ethers";
import {
  STAKING_PRECOMPILE_ABI,
  STAKING_PRECOMPILE_ADDRESS,
} from "@/lib/abi/staking";
import { toast } from "sonner";
import { type WalletClient } from "viem";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { bech32 } from "bech32";

interface StakingMutationParams {
  walletClient: WalletClient;
  amount: string;
}

interface RedelegateMutationParams {
  validatorAddress: string;
  destinationAddr: string;
  amount: string;
  walletClient: WalletClient;
}

interface UndelegateMutationParams extends StakingMutationParams {
  validatorAddress: string;
}

interface DelegateMutationParams {
  walletClient: WalletClient;
  amount: string;
  validatorAddress: string;
}

interface RedelegationResponse {
  redelegation: {
    validator_dst_address: string;
  };
  entries: Array<{
    redelegation_entry: {
      completion_time: string;
    };
  }>;
}

interface RedelegationEntry {
  redelegation_entry: {
    completion_time: string;
  };
}

interface ContractError extends Error {
  data?: string;
}

const getStakingContract = async (walletClient: WalletClient) => {
  const provider = new ethers.BrowserProvider(walletClient.transport);
  const signer = await provider.getSigner();
  return new Contract(
    STAKING_PRECOMPILE_ADDRESS,
    STAKING_PRECOMPILE_ABI,
    signer
  );
};

const evmToCosmosAddress = (evmAddress: string): string => {
  try {
    const addressBytes = Buffer.from(evmAddress.slice(2), "hex");

    const words = bech32.toWords(addressBytes);
    return bech32.encode("kii", words);
  } catch (error) {
    console.error("Error converting address:", error);
    return "";
  }
};

export const useRedelegateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      validatorAddress,
      destinationAddr,
      amount,
      walletClient,
    }: RedelegateMutationParams) => {
      try {
        if (!walletClient?.account) {
          throw new Error("Wallet not connected");
        }

        const cosmosAddress = evmToCosmosAddress(walletClient.account.address);
        if (!cosmosAddress) {
          throw new Error("Failed to convert address");
        }

        const redelegationsResponse = await fetch(
          `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegators/${cosmosAddress}/redelegations`
        );
        const redelegationsData = await redelegationsResponse.json();

        const hasActiveRedelegation =
          redelegationsData.redelegation_responses?.some(
            (r: RedelegationResponse) => {
              return (
                r.redelegation.validator_dst_address === destinationAddr &&
                r.entries.some((entry: RedelegationEntry) => {
                  const completionTime = new Date(
                    entry.redelegation_entry.completion_time
                  );
                  return completionTime > new Date();
                })
              );
            }
          );

        if (hasActiveRedelegation) {
          throw new Error("Active redelegation exists for this validator");
        }

        const stakingContract = await getStakingContract(walletClient);
        const amountInWei = ethers.parseUnits(amount, 6);

        console.log("Redelegation Details:", {
          sourceValidator: validatorAddress,
          destinationValidator: destinationAddr,
          amount,
          amountInWei: amountInWei.toString(),
        });

        const tx = await stakingContract.redelegate(
          validatorAddress,
          destinationAddr,
          amountInWei
        );

        return await tx.wait();
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("Active redelegation exists")) {
            throw new Error(
              "Cannot redelegate: active redelegation exists for this validator"
            );
          }

          const errorData = (error as ContractError).data;
          if (errorData && typeof errorData === "string") {
            try {
              const decodedError = Buffer.from(
                errorData.slice(2),
                "hex"
              ).toString();
              console.error("Decoded Error:", decodedError);
              throw new Error(decodedError);
            } catch {
              throw error;
            }
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Successfully relocated your stake", {
        description: "Your tokens have been relocated to the new validator",
      });
      queryClient.invalidateQueries({ queryKey: ["delegations", "validator"] });
    },
    onError: (error) => {
      console.error("Redelegation error:", error);
      toast.error("Failed to relocate stake", {
        description:
          "Please try again or contact support if the problem persists",
      });
    },
  });
};

export const useUndelegateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      validatorAddress,
      amount,
      walletClient,
    }: UndelegateMutationParams) => {
      const stakingContract = await getStakingContract(walletClient);
      const amountInWei = ethers.parseUnits(amount, 6);

      const tx = await stakingContract.undelegate(
        validatorAddress,
        amountInWei
      );

      return await tx.wait();
    },
    onSuccess: () => {
      toast.success("Successfully withdrawn your stake", {
        description: "Your tokens will be available after the unbonding period",
      });
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
    },
    onError: (error) => {
      console.error("Undelegation error:", error);
      toast.error("Failed to withdraw stake", {
        description:
          "Please try again or contact support if the problem persists",
      });
    },
  });
};

export const useDelegateMutation = () => {
  return useMutation({
    mutationFn: async ({
      walletClient,
      amount,
      validatorAddress,
    }: DelegateMutationParams) => {
      const stakingContract = await getStakingContract(walletClient);
      const amountInWei = ethers.parseUnits(amount, 6);
      const amountIn18Dec = amountInWei * BigInt(10 ** 12);

      const provider = new ethers.BrowserProvider(walletClient.transport);
      const feeData = await provider.getFeeData();

      const tx = await stakingContract.delegate(validatorAddress, {
        value: amountIn18Dec,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 300000,
      });

      return await tx.wait();
    },
    onError: (error: unknown) => {
      console.error("Delegation error:", error);
      toast.error("Failed to delegate tokens. Please try again later.");
    },
    onSuccess: () => {
      toast.success("Delegation successful!");
    },
  });
};
