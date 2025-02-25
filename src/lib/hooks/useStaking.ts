import { useWriteContract, useAccount } from "wagmi";
import {
  STAKING_PRECOMPILE_ABI,
  STAKING_PRECOMPILE_ADDRESS,
} from "../abi/staking";
import { parseEther } from "viem";

export function useStaking(validatorAddress: string, amount: string) {
  const { address } = useAccount();
  const { writeContract: stake, data, status, error } = useWriteContract();

  const handleStake = async () => {
    if (!address) throw new Error("Wallet not connected");

    // Convertimos el amount a 18 decimales
    const amountInWei = parseEther(amount);

    return stake({
      address: STAKING_PRECOMPILE_ADDRESS,
      abi: STAKING_PRECOMPILE_ABI,
      functionName: "delegate",
      args: [validatorAddress],
      value: amountInWei,
      account: address,
    });
  };

  return {
    stake: handleStake,
    isLoading: status === "pending",
    isSuccess: status === "success",
    error,
    hash: data,
  };
}
