import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

interface RedelegationEntry {
  redelegation_entry: {
    completion_time: string;
  };
}

interface RedelegationResponse {
  redelegation: {
    validator_dst_address: string;
    validator_src_address: string;
  };
  entries: RedelegationEntry[];
}

interface RedelegationsResponse {
  redelegation_responses: RedelegationResponse[];
}

export const useRedelegations = (delegatorAddress?: string) => {
  return useQuery({
    queryKey: ["redelegations", delegatorAddress],
    queryFn: async (): Promise<RedelegationsResponse> => {
      if (!delegatorAddress) {
        throw new Error("Delegator address is required");
      }

      const response = await fetch(
        `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/redelegations`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch redelegations");
      }

      return response.json();
    },
    enabled: !!delegatorAddress,
    refetchInterval: 30000,
  });
};

export const hasActiveRedelegation = (
  redelegations: RedelegationsResponse | undefined,
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
