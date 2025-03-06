import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface Proposal {
  proposal_id: string;
  content?: {
    title?: string;
  };
  voting_start_time: string;
  voting_end_time: string;
  final_tally_result?: {
    yes?: string;
    no?: string;
    abstain?: string;
    no_with_veto?: string;
  };
}

interface GovernanceParams {
  voting_params: {
    voting_period: string;
  };
  deposit_params: {
    min_deposit: Array<{
      denom: string;
      amount: string;
    }>;
  };
  tally_params: {
    quorum: string;
    threshold: string;
    veto_threshold: string;
  };
}

export const useProposals = (searchTerm: string = "") => {
  return useQuery({
    queryKey: ["proposals", searchTerm],
    queryFn: async (): Promise<Proposal[]> => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/gov/v1beta1/proposals`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      const data = await response.json();
      const proposals = data.proposals || [];

      if (!searchTerm) return proposals;

      return proposals.filter((proposal: Proposal) =>
        proposal.content?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    },
    staleTime: 30000,
  });
};

export const useGovernanceParams = (paramsType: string) => {
  return useQuery({
    queryKey: ["governance-params", paramsType],
    queryFn: async (): Promise<GovernanceParams> => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/gov/v1beta1/params/${paramsType}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ${paramsType} params`);
      }
      return response.json();
    },
    staleTime: 300000,
  });
};

export const calculateVotingMetrics = (proposal: Proposal) => {
  const votingStartTime = dayjs(proposal.voting_start_time);
  const votingEndTime = dayjs(proposal.voting_end_time);
  const votingPeriodDays = votingEndTime.diff(votingStartTime, "days");

  const yesVotes = parseInt(proposal.final_tally_result?.yes || "0");
  const noVotes = parseInt(proposal.final_tally_result?.no || "0");
  const abstainVotes = parseInt(proposal.final_tally_result?.abstain || "0");
  const noWithVetoVotes = parseInt(
    proposal.final_tally_result?.no_with_veto || "0"
  );

  const totalVotes = yesVotes + noVotes + abstainVotes + noWithVetoVotes;
  const yesPercentage = totalVotes
    ? Math.round((yesVotes / totalVotes) * 100)
    : 0;

  return {
    votingPeriodDays,
    yesPercentage,
    totalVotes,
  };
};
