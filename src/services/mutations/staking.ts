import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers, Contract } from "ethers";
import { toast } from "sonner";
import { type WalletClient } from "viem";
import * as kiiEvm from "@kiichain/kiijs-evm";

interface IStakingContractInfo {
  contract: Contract;
  address: string;
}

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

interface ContractError extends Error {
  data?: string;
}

const getStakingContract = async (
  walletClient: WalletClient
): Promise<IStakingContractInfo> => {
  const provider = new ethers.BrowserProvider(walletClient.transport);
  const signer = await provider.getSigner();
  const contract = kiiEvm.getStakingPrecompileEthersV6Contract(signer);

  return { contract, address: signer.address };
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

        // get staking contract
        const { contract, address } = await getStakingContract(walletClient);

        const amountInWei = ethers.parseUnits(amount, 6);
        const amountIn18Dec = amountInWei * BigInt(10 ** 12);

        return await contract.redelegate(
          address,
          validatorAddress,
          destinationAddr,
          amountIn18Dec
        );
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
      const { contract, address } = await getStakingContract(walletClient);
      const amountInWei = ethers.parseUnits(amount, 6);
      const amountIn18Dec = amountInWei * BigInt(10 ** 12);

      return await contract.undelegate(
        address,
        validatorAddress,
        amountIn18Dec
      );
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
      const { contract, address } = await getStakingContract(walletClient);

      const amountInWei = ethers.parseUnits(amount, 6);
      const amountIn18Dec = amountInWei * BigInt(10 ** 12);

      return await contract.delegate(address, validatorAddress, amountIn18Dec);
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
