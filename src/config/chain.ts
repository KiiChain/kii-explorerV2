import * as kiiEvm from "@kiichain/kiijs-evm";

export const EVM_INDEXER = "https://evm-indexer.testnet.v3.kiivalidator.com";
export const BACKEND_ENDPOINT = "https://backend.testnet.kiivalidator.com";
export const CHAIN_LCD_ENDPOINT =
  "https://lcd.uno.sentry.testnet.v3.kiivalidator.com";
export const CHAIN_RPC_ENDPOINT =
  "https://rpc.uno.sentry.testnet.v3.kiivalidator.com";
export const CHAIN_JSON_RPC_ENDPOINT =
  "https://json-rpc.uno.sentry.testnet.v3.com/";

export const TESTNET_ORO_EVM = kiiEvm.TESTNET_ORO_EVM;
export const KIICHAIN_BASE_DENOM = kiiEvm.KIICHAIN_BASE_DENOM;
export const KIICHAIN_SYMBOL = kiiEvm.TESTNET_ORO_EVM.nativeCurrency.symbol;
export const KIICHAIN_ORO_DENOM = kiiEvm.ORO_DENOM;

export const testnetV3COSMOS = {
  chainId: "kiichain3",
  chainName: "KiiChain Testnet Oro",
  rpc: "https://rpc.uno.sentry.testnet.v3.kiivalidator.com",
  rest: "https://lcd.uno.sentry.testnet.v3.kiivalidator.com",
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
        low: 0.025,
        average: 0.025,
        high: 0.035,
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
