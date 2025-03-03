import { API_ENDPOINTS } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

interface ValidatorReward {
  denom: string;
  amount: string;
}

interface RewardsResponse {
  total: Array<{
    denom: string;
    amount: string;
  }>;
}

export const useValidatorRewards = (
  delegatorAddress?: string,
  validatorAddress?: string
) => {
  return useQuery({
    queryKey: ["validator-rewards", delegatorAddress, validatorAddress],
    queryFn: async (): Promise<ValidatorReward[]> => {
      if (!delegatorAddress || !validatorAddress) {
        throw new Error("Delegator and validator addresses are required");
      }

      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rewards");
      }

      const data = await response.json();
      return data.rewards || [];
    },
    enabled: !!delegatorAddress && !!validatorAddress,
    refetchInterval: 30000,
  });
};

export const useRewardsQuery = (delegatorAddress?: string) => {
  return useQuery({
    queryKey: ["rewards", delegatorAddress],
    queryFn: async (): Promise<RewardsResponse> => {
      if (!delegatorAddress) throw new Error("Delegator address is required");

      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`
      );

      if (!response.ok) throw new Error("Failed to fetch rewards");
      return response.json();
    },
    enabled: !!delegatorAddress,
    refetchInterval: 30000,
  });
};
