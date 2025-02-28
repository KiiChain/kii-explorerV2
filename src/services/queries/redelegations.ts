import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface RedelegationEntry {
  redelegation_entry: {
    completion_time: string;
    initial_balance: string;
  };
  balance: string;
}

interface RedelegationResponse {
  redelegation: {
    delegator_address: string;
    validator_src_address: string;
    validator_dst_address: string;
  };
  entries: RedelegationEntry[];
}

interface RedelegationsData {
  redelegation_responses: RedelegationResponse[];
}

const fetchRedelegations = async (
  cosmosAddress: string
): Promise<RedelegationsData> => {
  const response = await fetch(
    `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegators/${cosmosAddress}/redelegations`
  );
  return response.json();
};

export const useRedelegations = (cosmosAddress?: string) => {
  return useQuery({
    queryKey: ["redelegations", cosmosAddress],
    queryFn: () => fetchRedelegations(cosmosAddress!),
    enabled: !!cosmosAddress,
  });
};

export const hasActiveRedelegation = (
  redelegations: RedelegationsData | undefined,
  validatorAddress: string
): { hasRedelegation: boolean; completionTime?: string } => {
  if (!redelegations) {
    return { hasRedelegation: false };
  }

  const now = new Date();
  const activeRedelegation = redelegations.redelegation_responses?.find((r) => {
    const isInvolved =
      r.redelegation.validator_src_address === validatorAddress ||
      r.redelegation.validator_dst_address === validatorAddress;

    if (!isInvolved) return false;

    return r.entries.some(
      (entry) => new Date(entry.redelegation_entry.completion_time) > now
    );
  });

  if (activeRedelegation) {
    const latestCompletion = activeRedelegation.entries.reduce(
      (latest, entry) => {
        const completionTime = new Date(
          entry.redelegation_entry.completion_time
        );
        return completionTime > latest ? completionTime : latest;
      },
      new Date(0)
    );

    return {
      hasRedelegation: true,
      completionTime: latestCompletion.toLocaleString(),
    };
  }

  return { hasRedelegation: false };
};
