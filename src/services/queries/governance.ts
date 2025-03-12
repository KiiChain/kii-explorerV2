import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface Proposal {
  proposal_id: string;
  content?: {
    title?: string;
    description?: string;
    plan?: {
      name?: string;
      time?: string;
      height?: string;
      info?: string;
      upgraded_client_state?: string;
    };
    "@type"?: string;
  };
  voting_start_time: string;
  voting_end_time: string;
  final_tally_result?: {
    yes?: string;
    no?: string;
    abstain?: string;
    no_with_veto?: string;
  };
  status: string;
  submit_time: string;
  deposit_end_time: string;
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
  const now = dayjs();
  const votingEndTime = dayjs(proposal.voting_end_time);

  let votingPeriodDays = 0;
  if (proposal.status === "PROPOSAL_STATUS_VOTING_PERIOD") {
    votingPeriodDays = Math.ceil(votingEndTime.diff(now, "day", true));
  } else if (proposal.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD") {
    const depositEndTime = dayjs(proposal.deposit_end_time);
    votingPeriodDays = Math.ceil(depositEndTime.diff(now, "day", true));
  }

  votingPeriodDays = Math.max(0, votingPeriodDays);

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

export const getProposalDetails = async (proposalId: string) => {
  try {
    console.log("API_ENDPOINTS.LCD:", API_ENDPOINTS.LCD);

    const baseUrl = API_ENDPOINTS.LCD.replace(/\/$/, "");
    const proposalUrl = `${baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}`;
    const tallyUrl = `${baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`;
    const votesUrl = `${baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/votes`;
    const depositsUrl = `${baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/deposits`;

    const proposalResponse = await fetch(proposalUrl);
    if (!proposalResponse.ok) {
      throw new Error(`Failed to fetch proposal: ${proposalUrl}`);
    }
    const proposalData = await proposalResponse.json();
    const proposal = proposalData.proposal;

    const tallyResponse = await fetch(tallyUrl);
    if (!tallyResponse.ok) {
      throw new Error(`Failed to fetch tally: ${tallyUrl}`);
    }
    const tallyData = await tallyResponse.json();

    const totalVotes =
      parseFloat(tallyData.tally?.yes || "0") +
      parseFloat(tallyData.tally?.no || "0") +
      parseFloat(tallyData.tally?.abstain || "0") +
      parseFloat(tallyData.tally?.no_with_veto || "0");

    const calculatePercentage = (value: string) =>
      totalVotes ? (parseFloat(value || "0") / totalVotes) * 100 : 0;

    const votesResponse = await fetch(votesUrl);
    if (!votesResponse.ok) {
      throw new Error("Failed to fetch votes");
    }
    const votesData = await votesResponse.json();

    const depositsResponse = await fetch(depositsUrl);
    if (!depositsResponse.ok) {
      throw new Error("Failed to fetch deposits");
    }
    const depositsData = await depositsResponse.json();

    return {
      id: proposal.proposal_id,
      type: proposal.content?.["@type"] || "",
      title: proposal.content?.title || "",
      description: proposal.content?.description || "",
      status: proposal.status,
      plan: {
        name: proposal.content?.plan?.name || "",
        time: proposal.content?.plan?.time || "",
        height: proposal.content?.plan?.height || "",
        info: proposal.content?.plan?.info || "",
        upgradedClientState:
          proposal.content?.plan?.upgraded_client_state || "",
      },
      tally: {
        turnout:
          Math.round(calculatePercentage(tallyData.tally?.yes) * 100) / 100,
        yes: Math.round(calculatePercentage(tallyData.tally?.yes) * 100) / 100,
        no: Math.round(calculatePercentage(tallyData.tally?.no) * 100) / 100,
        noWithVeto:
          Math.round(calculatePercentage(tallyData.tally?.no_with_veto) * 100) /
          100,
        abstain:
          Math.round(calculatePercentage(tallyData.tally?.abstain) * 100) / 100,
      },
      timeline: {
        submitted: proposal.submit_time || "",
        deposited: proposal.deposit_end_time || "",
        votingStart: proposal.voting_start_time || "",
        votingEnd: proposal.voting_end_time || "",
        upgradePlan: proposal.content?.plan?.time || "",
      },
      votes: votesData.votes || [],
      deposits: depositsData.deposits || [],
    };
  } catch (error) {
    console.error("Error fetching proposal details:", error);
    throw error;
  }
};
