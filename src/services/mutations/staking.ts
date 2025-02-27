import { useMutation } from "@tanstack/react-query";
import { ethers, Contract } from "ethers";
import { STAKING_PRECOMPILE_ABI } from "@/lib/abi/staking";
import { toast } from "react-toastify";
import { type WalletClient } from "viem";

const STAKING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000001005";

interface StakingMutationParams {
  walletClient: WalletClient;
  amount: string;
}

interface RedelegateMutationParams extends StakingMutationParams {
  validatorAddress: string;
  destinationValidator: string;
}

interface UndelegateMutationParams extends StakingMutationParams {
  validatorAddress: string;
}

const getStakingContract = async (walletClient: WalletClient) => {
  const provider = new ethers.BrowserProvider(walletClient.transport);
  const signer = await provider.getSigner();
  return new Contract(STAKING_CONTRACT_ADDRESS, STAKING_PRECOMPILE_ABI, signer);
};

export const useRedelegateMutation = () => {
  return useMutation({
    mutationFn: async ({
      walletClient,
      amount,
      validatorAddress,
      destinationValidator,
    }: RedelegateMutationParams) => {
      const stakingContract = await getStakingContract(walletClient);
      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await stakingContract.redelegate(
        validatorAddress,
        destinationValidator,
        amountInWei
      );
      return await tx.wait();
    },
    onSuccess: () => {
      toast.success("Redelegation successful!");
    },
    onError: (error) => {
      console.error("Redelegation error:", error);
      toast.error("Failed to redelegate tokens");
    },
  });
};

export const useUndelegateMutation = () => {
  return useMutation({
    mutationFn: async ({
      walletClient,
      amount,
      validatorAddress,
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
      toast.success("Undelegation successful!");
    },
    onError: (error) => {
      console.error("Undelegation error:", error);
      toast.error("Failed to undelegate tokens");
    },
  });
};
