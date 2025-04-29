import {
  CHAIN_LCD_ENDPOINT,
  CHAIN_RPC_ENDPOINT,
  KIICHAIN_SYMBOL,
} from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

interface BankSupply {
  id: string;
  address: string;
  amount: string;
  percentage: string;
}

interface SupplyResponse {
  supply: {
    denom: string;
    amount: string;
  }[];
}

interface GenesisResponse {
  genesis: {
    app_state: {
      bank: {
        balances: {
          address: string;
          coins: {
            denom: string;
            amount: string;
          }[];
        }[];
      };
    };
  };
}

export const useSupplyData = () => {
  return useQuery({
    queryKey: ["supply-data"],
    queryFn: async (): Promise<BankSupply[]> => {
      try {
        const [supplyResponse, genesisResponse] = await Promise.all([
          fetch(
            `${CHAIN_LCD_ENDPOINT}/cosmos/bank/v1beta1/supply?pagination.limit=20&pagination.count_total=true`
          ),
          fetch(`${CHAIN_RPC_ENDPOINT}/genesis`),
        ]);

        const supplyData: SupplyResponse = await supplyResponse.json();
        const genesisData: GenesisResponse = await genesisResponse.json();

        const totalSupply = supplyData.supply.find(
          (s) => s.denom === KIICHAIN_SYMBOL
        )?.amount;

        if (!totalSupply) return [];

        const balances = genesisData.genesis.app_state.bank.balances
          .map((balance) => {
            const ukiiCoin = balance.coins.find(
              (coin) => coin.denom === KIICHAIN_SYMBOL
            );
            if (!ukiiCoin) return null;

            const percentage = (
              (Number(ukiiCoin.amount) / Number(totalSupply)) *
              100
            ).toFixed(2);

            return {
              id: balance.address,
              address: balance.address,
              amount: ukiiCoin.amount,
              percentage: `${percentage}%`,
            };
          })
          .filter((b): b is BankSupply => b !== null)
          .sort((a, b) => Number(b.amount) - Number(a.amount));

        return balances.slice(0, 20);
      } catch (error) {
        console.error("Error fetching supply data:", error);
        throw error;
      }
    },
    staleTime: 30000,
  });
};
