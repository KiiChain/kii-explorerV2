import { parseEther } from "viem";
import { GOVERNANCE_ABI } from "../../constants/abis/governance";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

const GOVERNANCE_ADDRESS = "0x0000000000000000000000000000000000001006";

export const useGovernanceContract = () => {
  const vote = async (
    writeContract: ReturnType<typeof useWriteContract>["writeContract"],
    proposalId: string
  ) => {
    if (!writeContract) throw new Error("Write contract not initialized");
    try {
      await writeContract({
        address: GOVERNANCE_ADDRESS,
        abi: GOVERNANCE_ABI,
        functionName: "vote",
        args: [BigInt(proposalId), 1],
      });

      toast.success("Vote submitted successfully", {
        description: "Your vote has been recorded on the blockchain",
      });
      return true;
    } catch (error) {
      console.error("Error initiating vote:", error);
      toast.error("Failed to submit vote", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      throw error;
    }
  };

  const deposit = async (
    writeContract: ReturnType<typeof useWriteContract>["writeContract"],
    proposalId: string
  ) => {
    if (!writeContract) throw new Error("Write contract not initialized");
    try {
      await writeContract({
        address: GOVERNANCE_ADDRESS,
        abi: GOVERNANCE_ABI,
        functionName: "deposit",
        args: [BigInt(proposalId)],
        value: parseEther("1"),
      });

      toast.success("Deposit submitted successfully", {
        description: "Your deposit has been recorded on the blockchain",
      });
      return true;
    } catch (error) {
      console.error("Error initiating deposit:", error);
      toast.error("Failed to submit deposit", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      throw error;
    }
  };

  return {
    vote,
    deposit,
  };
};
