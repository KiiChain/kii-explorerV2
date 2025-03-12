import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface ValidatorSetResponse {
  validators: {
    address: string;
    pub_key: {
      "@type": string;
      key: string;
    };
    voting_power: string;
    proposer_priority: string;
  }[];
  pagination: {
    total: string;
  };
}

export const useValidatorSet = () => {
  return useQuery({
    queryKey: ["validator-set"],
    queryFn: async (): Promise<number> => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/validatorsets/latest`
      );
      const data: ValidatorSetResponse = await response.json();
      return data.validators.length;
    },
    refetchInterval: 10000,
  });
};
