import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface BlockInfo {
  height: string;
  hash: string;
}

export const useStateSyncInfo = () => {
  return useQuery({
    queryKey: ["state-sync-info"],
    queryFn: async (): Promise<BlockInfo> => {
      try {
        const latestResponse = await fetch(
          `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/latest`
        );
        const latestData = await latestResponse.json();
        const currentHeight = parseInt(latestData.block.header.height);
        const trustHeight = currentHeight - 500;

        const trustResponse = await fetch(
          `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/${trustHeight}`
        );
        const trustData = await trustResponse.json();

        return {
          height: trustHeight.toString(),
          hash: trustData.block_id.hash,
        };
      } catch (error) {
        console.error("Error fetching block info:", error);
        throw error;
      }
    },
    refetchInterval: 6000,
  });
};
