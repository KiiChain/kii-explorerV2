import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface Block {
  block: {
    header: {
      height: string;
      time: string;
      chain_id: string;
    };
    data: {
      txs: string[];
    };
  };
}

interface TxResponse {
  height: string;
  txhash: string;
  timestamp: string;
  auth_info: {
    fee: {
      amount: Array<{
        amount: string;
      }>;
    };
  };
  tx: {
    body: {
      messages: Array<{
        from_address: string;
      }>;
    };
  };
}

interface Transaction {
  height: string;
  hash: string;
  displayHash: string;
  fees: string;
  sender: string;
  created_at: string;
}

export const getRelativeTime = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const useBlocksDashboard = () => {
  return useQuery({
    queryKey: ["blocks-dashboard"],
    queryFn: async (): Promise<Block[]> => {
      const latestResponse = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/latest`
      );
      const latestData = await latestResponse.json();
      const latestHeight = parseInt(latestData.block.header.height);

      const blockPromises = Array.from({ length: 50 }, (_, i) =>
        fetch(
          `${API_ENDPOINTS.LCD}/cosmos/base/tendermint/v1beta1/blocks/${
            latestHeight - i
          }`
        ).then((res) => res.json())
      );

      return Promise.all(blockPromises);
    },
    refetchInterval: 10000,
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/tx/v1beta1/txs?events=message.action=%27/cosmos.bank.v1beta1.MsgSend%27&order_by=2`
      );
      const data = await response.json();

      return data.tx_responses.map((tx: TxResponse) => ({
        height: tx.height,
        hash: tx.txhash,
        displayHash: tx.txhash.slice(0, 10) + "...",
        fees: tx.auth_info?.fee?.amount?.[0]?.amount || "0",
        sender: tx.tx.body.messages[0].from_address,
        created_at: new Date(tx.timestamp).toLocaleString(),
      }));
    },
    refetchInterval: 10000,
  });
};
