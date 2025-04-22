import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

export interface Proposal {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  plan: {
    name: string;
    time: string;
    height: string;
    info: string;
    upgradedClientState: string;
  };
  tally: {
    turnout: number;
    yes: number;
    no: number;
    noWithVeto: number;
    abstain: number;
  };
  timeline: {
    submitted: string;
    deposited: string;
    votingStart: string;
    votingEnd: string;
    upgradePlan: string;
  };
}

export interface ProposalVote {
  hasVoted: boolean;
  voteOption?: string;
}

export const useProposalQuery = (proposalId: string) => {
  return useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/proposals/${proposalId}`
        );

        const data = await response.json();

        if (!data.proposal) throw new Error("Invalid proposal data");

        const transformedProposal = {
          id: data.proposal.id,
          type: data.proposal.content["@type"],
          title: data.proposal.content.title,
          description: data.proposal.content.description,
          status: data.proposal.status,
          final_tally_result: data.proposal.final_tally_result,
          plan: {
            name: data.proposal.content.plan?.name,
            time: data.proposal.content.plan?.time,
            height: data.proposal.content.plan?.height,
            info: data.proposal.content.plan?.info,
            upgradedClientState:
              data.proposal.content.plan?.upgraded_client_state,
          },
          tally: {
            turnout: Math.min(
              parseFloat(data.proposal.final_tally_result?.turnout || "0") *
                100,
              100
            ),
            yes: Math.min(
              parseFloat(data.proposal.final_tally_result?.yes || "0") * 100,
              100
            ),
            no: Math.min(
              parseFloat(data.proposal.final_tally_result?.no || "0") * 100,
              100
            ),
            noWithVeto: Math.min(
              parseFloat(
                data.proposal.final_tally_result?.no_with_veto || "0"
              ) * 100,
              100
            ),
            abstain: Math.min(
              parseFloat(data.proposal.final_tally_result?.abstain || "0") *
                100,
              100
            ),
          },
          timeline: {
            submitted: data.proposal.submit_time,
            deposited: data.proposal.deposit_end_time,
            votingStart: data.proposal.voting_start_time,
            votingEnd: data.proposal.voting_end_time,
            upgradePlan: data.proposal.content.plan?.time,
          },
        };

        return transformedProposal;
      } catch (error) {
        console.error("Error in useProposalQuery:", error);
        throw error;
      }
    },
    enabled: !!proposalId,
  });
};

export const useProposalVoteStatus = (
  proposalId: string,
  cosmosAddress?: string
) => {
  return useQuery({
    queryKey: ["proposal-vote", proposalId, cosmosAddress],
    queryFn: async () => {
      if (!cosmosAddress) return { hasVoted: false };

      try {
        const response = await fetch(
          `${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${cosmosAddress}`
        );

        if (!response.ok) {
          return { hasVoted: false };
        }

        const data = await response.json();
        return {
          hasVoted: true,
          voteOption: data.vote?.option || "VOTED",
        };
      } catch (error) {
        console.error("Error checking vote status:", error);
        return { hasVoted: false };
      }
    },
    enabled: !!cosmosAddress && !!proposalId,
  });
};

export const useProposalsQuery = () => {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/proposals`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch proposals");
        }
        const data = await response.json();
        return data.proposals || [];
      } catch (error) {
        console.error("Error fetching proposals:", error);
        throw error;
      }
    },
  });
};
