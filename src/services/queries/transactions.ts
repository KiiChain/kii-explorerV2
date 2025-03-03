import { API_ENDPOINTS } from "@/constants/endpoints";
import { useInfiniteQuery } from "@tanstack/react-query";
interface TxResponse {
  height: string;
  txhash: string;
  timestamp: string;
  tx: {
    body: {
      messages: Array<{
        "@type": string;
      }>;
    };
  };
}

export const useTransactionsQuery = (kiiAddress?: string) => {
  return useInfiniteQuery({
    queryKey: ["transactions", kiiAddress],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/tx/v1beta1/txs?events=message.sender='${kiiAddress}'&pagination.page=${pageParam}&pagination.limit=10`
      );
      const data = await response.json();
      return {
        txs:
          data.tx_responses?.map((tx: TxResponse) => ({
            height: tx.height,
            hash: tx.txhash,
            messages: tx.tx.body.messages[0]?.["@type"] || "Unknown",
            time: new Date(tx.timestamp).toLocaleString(),
          })) || [],
        nextPage: data.pagination?.next_key ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!kiiAddress,
  });
};
