import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface DelegationResponse {
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

interface UnbondingEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  balance: string;
}

interface UnbondingDelegation {
  delegator_address: string;
  validator_address: string;
  entries: UnbondingEntry[];
}

interface RedelegationEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  shares_dst: string;
  balance: string;
}

interface RedelegationResponse {
  redelegation: {
    delegator_address: string;
    validator_src_address: string;
    validator_dst_address: string;
    entries: RedelegationEntry[];
  };
  entries: Array<{
    balance: string;
    redelegation_entry: RedelegationEntry;
  }>;
}

interface ValidatorHistoryResponse {
  validator_address: string;
  total_delegated: string;
  delegations: DelegationResponse[];
  redelegations: {
    amount: string;
    completion_time: string;
    destination_validator?: string;
  }[];
  unbondings: {
    amount: string;
    completion_time: string;
  }[];
}

export const useValidatorHistory = (
  evmAddress: string | undefined,
  validatorAddr: string | undefined
) => {
  return useQuery({
    queryKey: ["validator-history", evmAddress, validatorAddr],
    queryFn: async (): Promise<ValidatorHistoryResponse[]> => {
      if (!evmAddress || !validatorAddr) {
        console.log("Missing required addresses:", {
          evmAddress,
          validatorAddr,
        });
        return [];
      }

      try {
        const kiiAddressUrl = `${API_ENDPOINTS.LCD}/kiichain/evm/kii_address?evm_address=${evmAddress}`;
        const kiiAddressRes = await fetch(kiiAddressUrl);
        if (!kiiAddressRes.ok) {
          throw new Error(
            `Error fetching Kii address: ${kiiAddressRes.status}`
          );
        }

        const kiiAddressData = await kiiAddressRes.json();
        const kiiAddress = kiiAddressData.kii_address;

        if (!kiiAddress) {
          console.log("No Kii address found for EVM address:", evmAddress);
          return [];
        }

        const delegationsUrl = `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegations/${kiiAddress}`;
        const delegationsRes = await fetch(delegationsUrl);
        const delegationsData = await delegationsRes.json();

        const redelegationsUrl = `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegators/${kiiAddress}/redelegations`;
        const redelegationsRes = await fetch(redelegationsUrl);
        const redelegationsData = await redelegationsRes.json();

        const unbondingUrl = `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/delegators/${kiiAddress}/unbonding_delegations`;
        const unbondingRes = await fetch(unbondingUrl);
        const unbondingData = await unbondingRes.json();

        const validatorDelegations =
          delegationsData.delegation_responses?.filter(
            (d: DelegationResponse) =>
              d.delegation.validator_address === validatorAddr
          ) || [];

        const validatorRedelegations =
          redelegationsData.redelegation_responses?.filter(
            (r: RedelegationResponse) =>
              r.redelegation.validator_src_address === validatorAddr
          ) || [];

        const validatorUnbondings =
          unbondingData.unbonding_responses?.filter(
            (u: UnbondingDelegation) => u.validator_address === validatorAddr
          ) || [];

        const history: ValidatorHistoryResponse = {
          validator_address: validatorAddr,
          total_delegated: validatorDelegations.reduce(
            (sum: string, d: DelegationResponse) =>
              (BigInt(sum) + BigInt(d.balance.amount || 0)).toString(),
            "0"
          ),
          delegations: validatorDelegations,
          redelegations: validatorRedelegations.map(
            (r: RedelegationResponse) => ({
              amount: r.entries[0]?.balance || "0",
              completion_time: r.redelegation.entries[0]?.completion_time,
              destination_validator: r.redelegation.validator_dst_address,
            })
          ),
          unbondings: validatorUnbondings.flatMap((u: UnbondingDelegation) =>
            u.entries.map((entry: UnbondingEntry) => ({
              amount: entry.balance,
              completion_time: entry.completion_time,
            }))
          ),
        };

        return [history];
      } catch (error) {
        console.error("Error in validator history query:", error);
        throw error;
      }
    },
    enabled: Boolean(evmAddress) && Boolean(validatorAddr),
  });
};
