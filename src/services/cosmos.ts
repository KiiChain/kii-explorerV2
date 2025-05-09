import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { formatAmount } from "@/utils/format";
import { KIICHAIN_BASE_DENOM } from "@kiichain/kiijs-evm";

interface DelegationResponse {
  balance?: {
    amount: string;
  };
}

interface Reward {
  denom: string;
  amount: string;
}

interface ValidatorReward {
  reward?: Reward[];
}

export const cosmosService = {
  getDelegations: async (kiiAddress: string) => {
    const response = await fetch(
      `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegations/${kiiAddress}`
    );
    const data = await response.json();
    return (
      data.delegation_responses?.reduce(
        (acc: number, curr: DelegationResponse) => {
          const amount = curr.balance?.amount
            ? parseFloat(formatAmount(curr.balance.amount))
            : 0;
          return acc + amount;
        },
        0
      ) || 0
    );
  },

  getRewards: async (kiiAddress: string) => {
    const response = await fetch(
      `${CHAIN_LCD_ENDPOINT}/cosmos/distribution/v1beta1/delegators/${kiiAddress}/rewards`
    );
    const data = await response.json();
    return (
      data.rewards?.reduce((acc: number, reward: ValidatorReward) => {
        const kiiReward = reward.reward?.find(
          (r: Reward) => r.denom === KIICHAIN_BASE_DENOM
        );
        const amount = kiiReward
          ? parseFloat(formatAmount(kiiReward.amount))
          : 0;
        return acc + amount;
      }, 0) || 0
    );
  },
};
