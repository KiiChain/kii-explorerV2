import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

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
        `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/validators/${validatorId}`
      );
      const data = await response.json();
      return data.validator as Validator;
    },
    refetchInterval: 30000,
  });
};
