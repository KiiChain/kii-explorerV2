import {
  CHAIN_LCD_ENDPOINT,
  CHAIN_RPC_ENDPOINT,
  KIICHAIN_SYMBOL,
} from "@/config/chain";

export const KII_TESTNET = {
  chainId: "kiichain3",
  chainName: "KiiChain Testnet Oro",
  rpc: CHAIN_RPC_ENDPOINT,
  rest: CHAIN_LCD_ENDPOINT,
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "kii",
    bech32PrefixAccPub: "kiipub",
    bech32PrefixValAddr: "kiivaloper",
    bech32PrefixValPub: "kiivaloperpub",
    bech32PrefixConsAddr: "kiivalcons",
    bech32PrefixConsPub: "kiivalconspub",
  },
  currencies: [
    {
      coinDenom: "KII",
      coinMinimalDenom: KIICHAIN_SYMBOL,
      coinDecimals: 6,
      coinGeckoId: "kii",
      coinImageUrl:
        "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
    },
    {
      coinDenom: "ORO",
      coinMinimalDenom:
        "factory/kii1ef2eurf9ls4kmhc6adcazscmzn8en73tuh2nvq/ORO",
      coinDecimals: 6,
      coinImageUrl:
        "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "KII",
      coinMinimalDenom: KIICHAIN_SYMBOL,
      coinDecimals: 6,
      coinGeckoId: "kii",
      coinImageUrl:
        "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "KII",
    coinMinimalDenom: KIICHAIN_SYMBOL,
    coinDecimals: 6,
    coinGeckoId: "kii",
    coinImageUrl:
      "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
};

export async function setupKeplr() {
  if (!window.keplr) {
    throw new Error("Keplr wallet not found");
  }

  try {
    await window.keplr.experimentalSuggestChain(KII_TESTNET);
    await window.keplr.enable(KII_TESTNET.chainId);
  } catch (error) {
    console.error("Error setting up Keplr:", error);
    throw error;
  }
}
