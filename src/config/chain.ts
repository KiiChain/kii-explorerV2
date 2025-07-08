import * as kiiEvm from "@kiichain/kiijs-evm";

export const EVM_INDEXER = "https://evm-indexer.testnet.v3.kiivalidator.com";
export const BACKEND_ENDPOINT = "https://backend.testnet.kiivalidator.com";
export const CHAIN_LCD_ENDPOINT =
  "https://lcd.uno.sentry.testnet.v3.kiivalidator.com";
export const CHAIN_RPC_ENDPOINT =
  "https://rpc.uno.sentry.testnet.v3.kiivalidator.com";
export const CHAIN_JSON_RPC_ENDPOINT =
  "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/";
export const CHAIN_ASSET_LIST_URL =
  "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assetlist.json";

export const TESTNET_ORO_EVM = kiiEvm.TESTNET_ORO_EVM;
export const KIICHAIN_BASE_DENOM = kiiEvm.KIICHAIN_BASE_DENOM;
export const KIICHAIN_SYMBOL = kiiEvm.TESTNET_ORO_EVM.nativeCurrency.symbol;
export const KIICHAIN_ORO_DENOM = kiiEvm.ORO_DENOM;

export const IBC_CONNECTIONS = [
  {
    id: "cosmoshub",
    name: "Cosmos Hub Testnet",
    iconUrl: "/images/cosmos-logo.png",
    chainId: "provider",
    status: "active",
    channel: "channel-3",
    prefix: "cosmos",
    explorer: "https://explorer.polypore.xyz/provider",
  },
];
