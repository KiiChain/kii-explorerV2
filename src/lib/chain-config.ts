export const KII_TESTNET = {
  chainId: "kiichain",
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
      coinMinimalDenom: "ukii",
      coinDecimals: 6,
      coinGeckoId: "kii",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "KII",
      coinMinimalDenom: "ukii",
      coinDecimals: 6,
      coinGeckoId: "kii",
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "KII",
    coinMinimalDenom: "ukii",
    coinDecimals: 6,
    coinGeckoId: "kii",
  },
  features: ["ibc-transfer", "ibc-go", "eth-address-gen", "eth-key-sign"],
  evmChainId: 1336,
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
