import { defineChain } from "@reown/appkit/networks";

export const ORO_DENOM =
  "factory/kii1ef2eurf9ls4kmhc6adcazscmzn8en73tuh2nvq/ORO";
export const CHAIN_LCD_ENDPOINT = "https://lcd.plata-404.kiivalidator.com";
export const EVM_INDEXER = "https://evm-indexer.testnet.v3.kiivalidator.com";
export const CHAIN_RPC_ENDPOINT = "https://rpc.plata-404.kiivalidator.com";
export const CHAIN_JSON_RPC_ENDPOINT = "https://json-rpc.plata-404.com/";
export const BACKEND_ENDPOINT = "https://backend.testnet.kiivalidator.com";

export const KIICHAIN_BASE_DENOM = "ukii";

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

export const ORO_ASSET = {
  type: "ERC20",
  options: {
    address: "0x5a47EF9C19dae206e99382955eb9eD5ca510A7Fa",
    symbol: "ORO",
    decimals: 18,
    image:
      "https://raw.githubusercontent.com/KiiChain/testnets/refs/heads/main/testnet_oro/assets/coin_256_256.png",
  },
} as const;
