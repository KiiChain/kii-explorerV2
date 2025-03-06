import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface ChainData {
  validatorCount: number;
  bondedTokens: string;
  communityPool: string;
}

export const useChainData = () => {
  return useQuery({
    queryKey: ["chain-data"],
    queryFn: async (): Promise<ChainData> => {
      const [genesisResponse, stakingResponse, communityPoolResponse] =
        await Promise.all([
          fetch(`${API_ENDPOINTS.RPC}/genesis`).catch(() => null),
          fetch(`${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/pool`).catch(
            () => null
          ),
          fetch(
            `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/community_pool`
          ).catch(() => null),
        ]);

      const genesisData = genesisResponse ? await genesisResponse.json() : null;
      const stakingData = stakingResponse ? await stakingResponse.json() : null;
      const communityPoolData = communityPoolResponse
        ? await communityPoolResponse.json()
        : null;

      const bondedKii = stakingData
        ? (parseInt(stakingData.pool.bonded_tokens) / 1_000_000).toFixed(4)
        : "0.0000";

      const communityPoolAmount = communityPoolData?.pool?.find(
        (item: { denom: string }) => item.denom === "ukii"
      )?.amount;

      const communityPoolKii = communityPoolAmount
        ? (parseFloat(communityPoolAmount) / 1_000_000).toFixed(4)
        : "0.0000";

      return {
        validatorCount: genesisData?.genesis.validators.length ?? 0,
        bondedTokens: bondedKii,
        communityPool: communityPoolKii,
      };
    },
    refetchInterval: 30000,
  });
};
