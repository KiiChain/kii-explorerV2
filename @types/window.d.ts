type EthereumRequestMethod =
  | "eth_requestAccounts"
  | "personal_sign"
  | "wallet_switchEthereumChain"
  | "wallet_addEthereumChain";

interface Ethereum {
  request(args: {
    method: EthereumRequestMethod;
    params?: unknown[];
  }): Promise<unknown>;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      request(args: {
        method: EthereumRequestMethod;
        params?: unknown[];
      }): Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export {};
