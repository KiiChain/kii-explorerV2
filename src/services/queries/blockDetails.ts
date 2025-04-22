import { useQuery } from "@tanstack/react-query";
import { CHAIN_LCD_ENDPOINT } from "@/config/chain";

interface BlockHeader {
  version: {
    block: string;
    app: string;
  };
  chain_id: string;
  height: string;
  time: string;
  proposer_address: string;
  app_hash: string;
}

interface BlockData {
  block_id: {
    hash: string;
  };
  block: {
    header: BlockHeader;
    data: {
      txs: string[];
    };
    last_commit: {
      signatures: Array<{
        validator_address: string;
        timestamp: string;
        signature: string;
      }>;
    };
  };
}

export const useBlockDetails = (height: string) => {
  return useQuery({
    queryKey: ["block-details", height],
    queryFn: async (): Promise<BlockData> => {
      const response = await fetch(
        `${CHAIN_LCD_ENDPOINT}/cosmos/base/tendermint/v1beta1/blocks/${height}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching block details: ${response.status}`);
      }
      return response.json();
    },
    enabled: Boolean(height),
  });
};
