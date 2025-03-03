import { useQueries, useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface ValidatorDetails {
  moniker: string;
  operator_address: string;
}

interface ValidatorResponse {
  operator_address: string;
  description: {
    moniker: string;
  };
}

const fetchValidatorDetails = async (
  operatorAddress: string
): Promise<ValidatorDetails> => {
  const response = await fetch(
    `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators/${operatorAddress}`
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
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });
};

export const useValidators = () => {
  return useQuery({
    queryKey: ["validators"],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators`
      );
      const data = await response.json();
      const validators: Record<string, string> = {};
      data.validators.forEach((validator: ValidatorResponse) => {
        validators[validator.operator_address] = validator.description.moniker;
      });
      return validators;
    },
  });
};
