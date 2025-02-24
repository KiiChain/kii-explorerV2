declare module "@reown/appkit-adapter-wagmi" {
  import { Chain } from "viem";
  import { Config } from "wagmi";

  export class WagmiAdapter {
    constructor(config: { networks: Chain[]; projectId: string; ssr: boolean });
    wagmiConfig: Config;
  }
  // Add other exports as needed
}
