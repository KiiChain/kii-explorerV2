import { CHAIN_LCD_ENDPOINT } from "@/config/chain";

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
  getKiiAddress: async (evmAddress: string) => {
    const response = await fetch(
      `${CHAIN_LCD_ENDPOINT}/kiichain/evm/kii_address?evm_address=${evmAddress}`
    );
    return await response.json();
  },

  getDelegations: async (kiiAddress: string) => {
    const response = await fetch(
      `${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/delegations/${kiiAddress}`
    );
    const data = await response.json();
    return (
      data.delegation_responses?.reduce(
        (acc: number, curr: DelegationResponse) => {
          const amount = curr.balance?.amount
            ? parseFloat(curr.balance.amount) / 1_000_000_000_000_000_000
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
          (r: Reward) => r.denom === "ukii"
        );
        const amount = kiiReward
          ? parseFloat(kiiReward.amount) / 1_000_000_000_000_000_000
          : 0;
        return acc + amount;
      }, 0) || 0
    );
  },
};
