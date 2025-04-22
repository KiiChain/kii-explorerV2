import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

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
        `${CHAIN_LCD_ENDPOINT}/cosmos/base/tendermint/v1beta1/validatorsets/latest`
      );
      const data: ValidatorSetResponse = await response.json();
      return data.validators.length;
    },
    refetchInterval: 10000,
  });
};
