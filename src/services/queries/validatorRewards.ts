import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQueries } from "@tanstack/react-query";

interface DelegationInfo {
  delegation?: {
    validator_address: string;
  };
}

interface ValidatorReward {
  denom: string;
  amount: string;
}

export const useValidatorRewardsQueries = (
  cosmosAddress: string | undefined,
  delegations: DelegationInfo[]
) => {
  return useQueries({
    queries: delegations.map((delegation) => ({
      queryKey: [
        "validator-rewards",
        cosmosAddress,
        delegation.delegation?.validator_address,
      ],
      queryFn: async (): Promise<ValidatorReward[]> => {
        if (!cosmosAddress || !delegation.delegation?.validator_address) {
          throw new Error("Required addresses missing");
        }
        const response = await fetch(
          `${CHAIN_LCD_ENDPOINT}/cosmos/distribution/v1beta1/delegators/${cosmosAddress}/rewards/${delegation.delegation.validator_address}`
        );
        const data = await response.json();
        return data.rewards || [];
      },
      enabled: !!cosmosAddress && !!delegation.delegation?.validator_address,
      refetchInterval: 30000, // Refetch every 30 seconds
    })),
  });
};
