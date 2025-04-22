import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

interface DelegationInfo {
  validator_address: string;
  total_delegated: string;
  delegation_count: number;
  redelegations: Array<{
    amount: string;
    completion_time: string;
  }>;
  unbondings: Array<{
    amount: string;
    completion_time: string;
  }>;
}

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

interface RedelegationEntry {
  balance: string;
  completion_time: string;
}

interface RedelegationResponse {
  redelegation: {
    validator_dst_address: string;
  };
  entries: RedelegationEntry[];
}

interface UnbondingEntry {
  balance: string;
  completion_time: string;
}

interface UnbondingResponse {
  validator_address: string;
  entries: UnbondingEntry[];
}

export function useDelegationHistory(delegatorAddress: string | undefined) {
  return useQuery({
    queryKey: ["delegationHistory", delegatorAddress],
    queryFn: async () => {
      if (!delegatorAddress) return null;

      const [delegationsRes, redelegationsRes, unbondingRes] =
        await Promise.all([
          fetch(
            `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`
          ),
          fetch(
            `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/redelegations`
          ),
          fetch(
            `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/unbonding_delegations`
          ),
        ]);

      if (!delegationsRes.ok || !redelegationsRes.ok || !unbondingRes.ok) {
        throw new Error("Network response was not ok");
      }

      const [delegations, redelegations, unbondings] = await Promise.all([
        delegationsRes.json(),
        redelegationsRes.json(),
        unbondingRes.json(),
      ]);

      const history: Record<string, DelegationInfo> = {};

      // Procesar delegaciones actuales
      delegations.delegation_responses.forEach((del: DelegationResponse) => {
        const validatorAddr = del.delegation.validator_address;
        if (!history[validatorAddr]) {
          history[validatorAddr] = {
            validator_address: validatorAddr,
            total_delegated: "0",
            delegation_count: 0,
            redelegations: [],
            unbondings: [],
          };
        }
        history[validatorAddr].total_delegated = del.balance.amount;
        history[validatorAddr].delegation_count += 1;
      });

      // Añadir redelegaciones
      redelegations.redelegation_responses?.forEach(
        (redel: RedelegationResponse) => {
          const validatorAddr = redel.redelegation.validator_dst_address;
          if (!history[validatorAddr]) {
            history[validatorAddr] = {
              validator_address: validatorAddr,
              total_delegated: "0",
              delegation_count: 0,
              redelegations: [],
              unbondings: [],
            };
          }
          redel.entries.forEach((entry: RedelegationEntry) => {
            history[validatorAddr].redelegations.push({
              amount: entry.balance,
              completion_time: entry.completion_time,
            });
          });
        }
      );

      // Añadir unbondings
      unbondings.unbonding_responses?.forEach((unbond: UnbondingResponse) => {
        const validatorAddr = unbond.validator_address;
        if (!history[validatorAddr]) {
          history[validatorAddr] = {
            validator_address: validatorAddr,
            total_delegated: "0",
            delegation_count: 0,
            redelegations: [],
            unbondings: [],
          };
        }
        unbond.entries.forEach((entry: UnbondingEntry) => {
          history[validatorAddr].unbondings.push({
            amount: entry.balance,
            completion_time: entry.completion_time,
          });
        });
      });

      return Object.values(history);
    },
    enabled: !!delegatorAddress,
  });
}
