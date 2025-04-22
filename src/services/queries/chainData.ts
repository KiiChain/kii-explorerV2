import { CHAIN_LCD_ENDPOINT, CHAIN_RPC_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

interface ChainData {
  validatorCount: number;
  bondedTokens: string;
  communityPool: string;
  totalSupply: string;
}

export const useChainData = () => {
  return useQuery({
    queryKey: ["chain-data"],
    queryFn: async (): Promise<ChainData> => {
      const [
        genesisResponse,
        stakingResponse,
        communityPoolResponse,
        totalSupplyResponse,
      ] = await Promise.all([
        fetch(`${CHAIN_RPC_ENDPOINT}/genesis`).catch(() => null),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/pool`).catch(
          () => null
        ),
        fetch(
          `${CHAIN_LCD_ENDPOINT}/cosmos/distribution/v1beta1/community_pool`
        ).catch(() => null),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/bank/v1beta1/supply`).catch(
          () => null
        ),
      ]);

      const genesisData = genesisResponse ? await genesisResponse.json() : null;
      const stakingData = stakingResponse ? await stakingResponse.json() : null;
      const communityPoolData = communityPoolResponse
        ? await communityPoolResponse.json()
        : null;
      const totalSupplyData = totalSupplyResponse
        ? await totalSupplyResponse.json()
        : null;

      const bondedKii = stakingData
        ? (
            parseInt(stakingData.pool.bonded_tokens) / 1_000_000_000_000_000_000
          ).toFixed(2)
        : "0.0";

      const communityPoolAmount = communityPoolData?.pool?.find(
        (item: { denom: string }) => item.denom === "akii"
      )?.amount;

      const communityPoolKii = communityPoolAmount
        ? (parseFloat(communityPoolAmount) / 1_000_000_000_000_000_000).toFixed(
            1
          )
        : "0.0";

      const totalSupply = totalSupplyData?.supply?.find(
        (item: { denom: string }) => item.denom === "akii"
      );

      const totalSupplyKii = totalSupply
        ? (parseFloat(totalSupply.amount) / 1_000_000_000_000_000_000).toFixed(
            1
          )
        : "0.0";

      return {
        validatorCount: genesisData?.genesis.validators.length ?? 0,
        bondedTokens: bondedKii,
        communityPool: communityPoolKii,
        totalSupply: totalSupplyKii,
      };
    },
    refetchInterval: 30000,
  });
};
