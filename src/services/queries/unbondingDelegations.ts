import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface UnbondingDelegation {
  delegator_address: string;
  validator_address: string;
  entries: Array<{
    creation_height: string;
    completion_time: string;
    initial_balance: string;
    balance: string;
  }>;
}

export const useUnbondingDelegationsQuery = (validatorId: string) => {
  return useQuery({
    queryKey: ["unbonding-delegations", validatorId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegators/${validatorId}/unbonding_delegations`
      );
      const data = await response.json();
      return (data.unbonding_responses || []) as UnbondingDelegation[];
    },
    refetchInterval: 30000,
  });
};
