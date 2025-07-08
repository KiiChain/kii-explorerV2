import { ethers } from "ethers";
import { useQuery } from "wagmi/query";
import * as kiiEvm from "@kiichain/kiijs-evm";
import { CHAIN_ASSET_LIST_URL } from "@/config/chain";

interface EvmBalance {
  contractAddress: string;
  amount: bigint;
}

export interface IBCToken {
  amount: number | string;
  denom: string;
  exponent: number;
  base: string;
  name: string;
}

interface assetList {
  chain_name: string;
  assets: asset[];
}

interface asset {
  description: string;
  denom_units: {
    denom: string;
    exponent: number;
  }[];
  base: string;
  name: string;
  display: string;
  symbol: string;
}

// useCosmosTokens retrieves the user tokens on its cosmos-side account using the Bank precompile
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCosmosTokens = (walletClient: any) => {
  return useQuery<EvmBalance[], Error, EvmBalance[], ["user", "cosmosTokens"]>({
    queryKey: ["user", "cosmosTokens"],
    queryFn: async (): Promise<EvmBalance[]> => {
      try {
        if (!walletClient) throw new Error("Wallet not connected");

        const ethersProvider = new ethers.BrowserProvider(
          walletClient.transport
        );
        const signer = await ethersProvider.getSigner();
        const address = await signer.getAddress();

        const bankPrecompile = kiiEvm.getBankPrecompileEthersV6Contract(signer);
        const rawBalances = await bankPrecompile.balances(address);

        const parsed: EvmBalance[] = rawBalances.map(
          ([contractAddress, amount]: [string, bigint]) => ({
            contractAddress,
            amount,
          })
        );

        return parsed;
      } catch (error) {
        console.error("Error fetching Cosmos tokens:", error);
        return [];
      }
    },
    enabled: !!walletClient,
    staleTime: 300000,
  });
};

// useQueryAssetList queries the Kiichain assetlist and returns the IBC assets
export const useQueryIBCAssetList = () => {
  return useQuery<IBCToken[], Error, IBCToken[], ["assetList"]>({
    queryKey: ["assetList"],
    queryFn: async (): Promise<IBCToken[]> => {
      try {
        const res = await fetch(CHAIN_ASSET_LIST_URL);
        const json: assetList = await res.json();

        const ibcAssets = json.assets.filter((a) => a.base.startsWith("ibc/"));

        const mappedBalances: IBCToken[] = ibcAssets.map((asset) => {
          const exponent =
            asset.denom_units.find((d) => d.denom === asset.display)
              ?.exponent ?? 6;

          return {
            denom: asset.display,
            name: asset.symbol,
            exponent,
            base: asset.base,
            amount: "",
          };
        });

        return mappedBalances;
      } catch (error) {
        console.error("Error loading asset list:", error);
        return [];
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};
