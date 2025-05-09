import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useValidatorsData } from "./uptime";
import { CHAIN_LCD_ENDPOINT } from "@/config/chain";

interface ValidatorDetails {
  moniker: string;
  operator_address: string;
}

interface ValidatorResponse {
  operator_address: string;
  description: {
    moniker: string;
    website: string;
    identity: string;
    details: string;
  };
  tokens: string;
  commission: {
    commission_rates: {
      rate: string;
    };
  };
  status: string;
  jailed: boolean;
}

interface StakingParams {
  params: {
    unbonding_time: string;
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denom: string;
    min_commission_rate: string;
  };
}

const fetchValidatorDetails = async (
  operatorAddress: string
): Promise<ValidatorDetails> => {
  const response = await fetch(
    `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/validators/${operatorAddress}`
  );
  const data = await response.json();
  if (!data.validator) {
    throw new Error("Validator not found");
  }
  return {
    moniker: data.validator.description.moniker,
    operator_address: data.validator.operator_address,
  };
};

export const useValidatorQueries = (
  delegations: { delegation?: { validator_address: string } }[]
) => {
  return useQueries({
    queries: delegations.map((delegation) => ({
      queryKey: ["validator", delegation.delegation?.validator_address],
      queryFn: () => {
        const address = delegation.delegation?.validator_address;
        if (!address) throw new Error("Validator address is required");
        return fetchValidatorDetails(address);
      },
      enabled: !!delegation.delegation?.validator_address,
      staleTime: 5 * 60 * 1000,
    })),
  });
};

export const useValidators = () => {
  const validatorsRes = useValidatorsData();

  return useQuery({
    queryKey: ["validators-list"],
    enabled: !!validatorsRes.data,
    queryFn: async () => {
      try {
        const [paramsRes] = await Promise.all([
          fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/params`),
        ]);

        if (validatorsRes.isError || !paramsRes.ok) {
          throw new Error("Failed to fetch validators data");
        }

        const validatorsData = await validatorsRes.data;
        const paramsData: StakingParams = await paramsRes.json();

        const activeValidators = validatorsData.filter(
          (validator: ValidatorResponse) =>
            validator.status === "BOND_STATUS_BONDED" && !validator.jailed
        );

        const inactiveValidators = validatorsData.filter(
          (validator: ValidatorResponse) =>
            validator.status !== "BOND_STATUS_BONDED" || validator.jailed
        );

        const sortByVotingPower = (vals: ValidatorResponse[]) => {
          return [...vals].sort((a, b) => {
            const aTokens = BigInt(a.tokens || "0");
            const bTokens = BigInt(b.tokens || "0");
            return bTokens > aTokens ? 1 : bTokens < aTokens ? -1 : 0;
          });
        };

        const unbondingDays = Math.floor(
          parseInt(paramsData.params.unbonding_time.replace("s", "")) /
            (24 * 60 * 60)
        );

        return {
          active: sortByVotingPower(activeValidators),
          inactive: sortByVotingPower(inactiveValidators),
          params: {
            unbondingTime: `${unbondingDays} Days`,
            maxValidators: paramsData.params.max_validators,
            minCommissionRate: `${(
              parseFloat(paramsData.params.min_commission_rate) * 100
            ).toFixed(0)}%`,
            bondDenom: paramsData.params.bond_denom,
          },
          validatorMap: Object.fromEntries(
            validatorsData.map((v: ValidatorResponse) => [
              v.operator_address,
              v.description.moniker,
            ])
          ),
        };
      } catch (error) {
        console.error("Error fetching validators:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useFailedDomains = () => {
  return useQuery({
    queryKey: ["failed-validator-icons"],
    queryFn: () => new Set<string>(),
    staleTime: Infinity,
    initialData: new Set<string>(),
  });
};

export const useValidatorIcons = () => {
  const queryClient = useQueryClient();
  const { data: failedDomains = new Set<string>() } = useFailedDomains();

  const getValidatorIcon = (website: string | undefined) => {
    if (!website) return "/favicon.ico";

    try {
      const url = website.startsWith("http") ? website : `https://${website}`;
      const domain = new URL(url).hostname;

      if (failedDomains.has(domain)) {
        return "/favicon.ico";
      }

      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      console.error("Error parsing validator website:", e);
      return "/favicon.ico";
    }
  };

  const handleImageError = (website: string | undefined) => {
    if (website) {
      try {
        const domain = new URL(
          website.startsWith("http") ? website : `https://${website}`
        ).hostname;

        queryClient.setQueryData(
          ["failed-validator-icons"],
          (old: Set<string>) => new Set([...old, domain])
        );
      } catch (e) {
        console.error("Error handling image failure:", e);
      }
    }
  };

  return { getValidatorIcon, handleImageError };
};

export const useValidatorsWithUptime = () => {
  return useQuery({
    queryKey: ["validators-uptime"],
    queryFn: async () => {
      const response = await fetch(
        `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/validators`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch validators data");
      }
      const data = await response.json();

      return data.validators.map((v: ValidatorResponse) => ({
        operatorAddress: v.operator_address,
        moniker: v.description.moniker,
        status: v.status,
        tokens: v.tokens,
        commission: v.commission.commission_rates.rate,
        website: v.description.website,
        jailed: v.jailed,
        uptime: 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};
