import * as kiiEvm from "@kiichain/kiijs-evm";
import { defineChain } from "viem";

export const CHAIN_LCD_ENDPOINT = "https://lcd.plata-404.kiivalidator.com";
export const EVM_INDEXER = "https://evm-indexer.testnet.v3.kiivalidator.com";
export const CHAIN_RPC_ENDPOINT = "https://rpc.plata-404.kiivalidator.com";
export const CHAIN_JSON_RPC_ENDPOINT = "https://json-rpc.plata-404.com/";
export const BACKEND_ENDPOINT = "https://backend.testnet.kiivalidator.com";

// export const TESTNET_ORO_EVM = kiiEvm.TESTNET_ORO_EVM;
export const KIICHAIN_BASE_DENOM = kiiEvm.KIICHAIN_BASE_DENOM;
export const KIICHAIN_SYMBOL = kiiEvm.TESTNET_ORO_EVM.nativeCurrency.symbol;

// Devnet connection
export const TESTNET_ORO_EVM = defineChain({
  id: 404,
  caipNetworkId: "eip155:1336",
  chainNamespace: "eip155",
  name: "Kii Testnet Oro",
  nativeCurrency: {
    decimals: 18,
    name: "Kii",
    symbol: "KII",
  },
  rpcUrls: {
    default: {
      http: ["https://json-rpc.plata-404.kiivalidator.com/"],
      webSocket: ["https://json-rpc.plata-404.kiivalidator.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "KiiExplorer",
      url: "https://explorer.kiichain.io/testnet",
    },
  },
  contracts: {},
});
