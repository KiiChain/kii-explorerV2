import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface Validator {
  description: {
    moniker: string;
    website?: string;
  };
  operator_address: string;
  tokens: string;
  self_bonded?: string;
  commission: {
    commission_rates: {
      rate: string;
    };
  };
}

export const useValidatorQuery = (validatorId: string) => {
  return useQuery({
    queryKey: ["validator", validatorId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators/${validatorId}`
      );
      const data = await response.json();
      return data.validator as Validator;
    },
    refetchInterval: 30000,
  });
};
