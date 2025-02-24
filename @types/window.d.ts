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
        method: "wallet_switchEthereumChain";
        params: [{ chainId: string }];
      }): Promise<null>;
      request(args: {
        method: "wallet_addEthereumChain";
        params: [
          {
            chainId: string;
            chainName: string;
            nativeCurrency: {
              name: string;
              symbol: string;
              decimals: number;
            };
            rpcUrls: string[];
            blockExplorerUrls?: string[];
          }
        ];
      }): Promise<null>;
      isMetaMask?: boolean;
    };
  }
}

export {};
