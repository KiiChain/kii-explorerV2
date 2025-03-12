import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface EVMTransaction {
  from_address: string;
  to_address: string;
  value: string;
  method: string;
  hash: string;
  timestamp: string;
}

interface TransactionResponse {
  txs: {
    from: string;
    to: string;
    amount: string;
    denom: string;
    timestamp: string;
    hash: string;
  }[];
}

export const useTransactionsQuery = (address?: string) => {
  return useInfiniteQuery<TransactionResponse>({
    queryKey: ["transactions", address],
    queryFn: async (): Promise<TransactionResponse> => {
      const response = await fetch(`${API_ENDPOINTS.EVM_INDEXER}/transactions`);
      const transactions: EVMTransaction[] = await response.json();

      const formattedTxs = transactions.map((tx) => ({
        from: tx.from_address,
        to: tx.to_address,
        amount:
          tx.method === "0x00000000"
            ? (BigInt(tx.value) / BigInt("1000000000000000000")).toString()
            : "EVM CONTRACT CALL",
        denom: tx.method === "0x00000000" ? "KII" : "",
        timestamp: new Date(parseInt(tx.timestamp) * 1000).toLocaleString(),
        hash: tx.hash,
      }));

      return {
        txs: formattedTxs,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => pages.length,
    refetchInterval: 30000,
  });
};
