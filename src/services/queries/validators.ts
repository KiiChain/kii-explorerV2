import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface Validator {
  operator_address: string;
  description: {
    moniker: string;
  };
}

interface ValidatorsResponse {
  validators: Validator[];
}

const fetchValidators = async (): Promise<Record<string, string>> => {
  const response = await fetch(
    `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators`
  );
  const data: ValidatorsResponse = await response.json();

  return data.validators.reduce((acc: Record<string, string>, validator) => {
    acc[validator.operator_address] = validator.description.moniker;
    return acc;
  }, {});
};

export const useValidators = () => {
  return useQuery({
    queryKey: ["validators"],
    queryFn: fetchValidators,
  });
};
