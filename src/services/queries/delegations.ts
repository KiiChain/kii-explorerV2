import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface Delegation {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
}

interface DelegationsResponse {
  delegation_responses: Delegation[];
}

export const useDelegationsQuery = (kiiAddress?: string) => {
  return useQuery({
    queryKey: ["delegations", kiiAddress],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegations/${kiiAddress}`
      );
      const data = (await response.json()) as DelegationsResponse;
      return data.delegation_responses || [];
    },
    enabled: !!kiiAddress,
  });
};

export const useValidatorDelegationsQuery = (validatorId: string) => {
  return useQuery({
    queryKey: ["validator-delegations", validatorId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators/${validatorId}/delegations`
      );
      const data = (await response.json()) as DelegationsResponse;
      return data.delegation_responses || [];
    },
    refetchInterval: 30000,
  });
};
