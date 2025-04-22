import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

interface NodeInfo {
  default_node_info: {
    protocol_version: {
      p2p: string;
      block: string;
      app: string;
    };
    network: string;
    version: string;
    moniker: string;
  };
  application_version: {
    name: string;
    app_name: string;
    version: string;
    git_commit: string;
    go_version: string;
    cosmos_sdk_version: string;
    build_deps: Array<{
      path: string;
      version: string;
      sum: string;
    }>;
  };
}

export const useNodeInfo = () => {
  return useQuery({
    queryKey: ["node-info"],
    queryFn: async (): Promise<NodeInfo> => {
      const response = await fetch(
        `${CHAIN_LCD_ENDPOINT}/cosmos/base/tendermint/v1beta1/node_info`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch node info");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};
