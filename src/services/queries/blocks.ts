import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { useTransactionsQuery } from "./transactions";

interface EVMTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  denom: string;
  timestamp: string;
}

interface CosmosTransaction {
  hash: string;
  height: string;
  displayHash?: string;
  fees?: string;
  sender?: string;
  created_at?: string;
}

interface Block {
  height: string;
  hash: string;
  timestamp: string;
  txCount: number;
  proposer: string;
  transactions: (EVMTransaction | CosmosTransaction)[];
}

export const useLatestBlocks = () => {
  const { data: transactionsData } = useTransactionsQuery();

  return useQuery({
    queryKey: ["latest-blocks"],
    queryFn: async (): Promise<Block[]> => {
      const blocks = [];
      const latestBlockResponse = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/latest`
      );
      const latestBlockData = await latestBlockResponse.json();
      const latestHeight = parseInt(latestBlockData.block.header.height);

      for (let i = 0; i < 20; i++) {
        const height = latestHeight - i;
        try {
          const blockResponse = await fetch(
            `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/${height}`
          );
          const blockData = await blockResponse.json();

          if (blockData && blockData.block && blockData.block_id) {
            blocks.push({
              height: blockData.block.header.height,
              hash: blockData.block_id.hash,
              timestamp: new Date(blockData.block.header.time).toLocaleString(),
              txCount: blockData.block.data.txs?.length || 0,
              proposer: blockData.block.header.proposer_address,
              transactions:
                transactionsData?.pages[0]?.txs.slice(i * 5, (i + 1) * 5) || [],
            });
          }
        } catch (blockError) {
          console.error(`Error processing block ${height}:`, blockError);
        }
      }
      return blocks;
    },
    refetchInterval: 30000,
  });
};
