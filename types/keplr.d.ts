interface Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>;
    getOfflineSigner: (chainId: string) => {
      getAccounts: () => Promise<
        Array<{ address: string; pubkey: Uint8Array }>
      >;
    };
    getKey: (chainId: string) => Promise<{
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: string;
      bech32Address: string;
    }>;
  };
}
