import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useProposalQuery, useProposalVoteStatus } from "../queries/proposals";
import { useKiiAddressQuery } from "@/services/queries/kiiAddress";

const GOVERNANCE_ABI = [
  {
    inputs: [
      { name: "proposalID", type: "uint64" },
      { name: "option", type: "int32" },
    ],
    name: "vote",
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "proposalID", type: "uint64" }],
    name: "deposit",
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export const useProposalDetail = (proposalId: string) => {
  const { address } = useAccount();
  const { data: kiiAddressData } = useKiiAddressQuery(address);
  const cosmosAddress = kiiAddressData?.kii_address;

  const { data: proposal, isLoading, error } = useProposalQuery(proposalId);
  const { data: voteStatus = { hasVoted: false } } = useProposalVoteStatus(
    proposalId,
    cosmosAddress
  );

  const { writeContract, isPending: isWritePending } = useWriteContract();
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const canVote = proposal?.status === "PROPOSAL_STATUS_VOTING_PERIOD";
  const canDeposit = proposal?.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD";

  const handleVote = async () => {
    if (!address || !proposal) return;

    if (!canVote) {
      toast.error(
        proposal.status === "PROPOSAL_STATUS_PASSED"
          ? "This proposal has already passed"
          : proposal.status === "PROPOSAL_STATUS_REJECTED"
          ? "This proposal has been rejected"
          : proposal.status === "PROPOSAL_STATUS_FAILED"
          ? "This proposal has failed"
          : proposal.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD"
          ? "This proposal is in deposit period"
          : "Voting is not available for this proposal",
        {
          description: "The proposal's current status doesn't allow voting",
        }
      );
      return;
    }

    try {
      setVoteSuccess(false);
      if (isWritePending) return;

      await writeContract({
        address: "0x0000000000000000000000000000000000001006",
        abi: GOVERNANCE_ABI,
        functionName: "vote",
        args: [BigInt(proposal.id), 1],
      });

      setVoteSuccess(true);
      toast.success("Vote submitted successfully", {
        description: "Your vote has been recorded on the blockchain",
      });
      setTimeout(() => setVoteSuccess(false), 2000);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleDeposit = async () => {
    if (!address || !proposal) return;

    if (!canDeposit) {
      toast.error(
        proposal.status === "PROPOSAL_STATUS_VOTING_PERIOD"
          ? "This proposal is in voting period"
          : proposal.status === "PROPOSAL_STATUS_PASSED"
          ? "This proposal has already passed"
          : proposal.status === "PROPOSAL_STATUS_REJECTED"
          ? "This proposal has been rejected"
          : proposal.status === "PROPOSAL_STATUS_FAILED"
          ? "This proposal has failed"
          : "Deposits are not available for this proposal",
        {
          description: "The proposal's current status doesn't allow deposits",
        }
      );
      return;
    }

    try {
      setDepositSuccess(false);
      if (isWritePending) return;

      await writeContract({
        address: "0x0000000000000000000000000000000000001006",
        abi: GOVERNANCE_ABI,
        functionName: "deposit",
        args: [BigInt(proposal.id)],
        value: parseEther("1"),
      });

      setDepositSuccess(true);
      toast.success("Deposit submitted successfully", {
        description: "Your deposit has been recorded on the blockchain",
      });
      setTimeout(() => setDepositSuccess(false), 2000);
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Failed to submit deposit", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return {
    proposal,
    isLoading,
    error,
    voteStatus,
    isWritePending,
    voteSuccess,
    depositSuccess,
    canVote,
    canDeposit,
    handleVote,
    handleDeposit,
  };
};
