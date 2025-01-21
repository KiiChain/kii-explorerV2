"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

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

interface Transaction {
  height: string;
  hash: string;
  displayHash: string;
  fees: string;
  sender: string;
  created_at: string;
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

const getRelativeTime = (timestamp: string) => {
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

export function BlocksDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setIsClient(true);

    const fetchBlocks = async () => {
      try {
        const latestResponse = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/latest"
        );
        const latestData = await latestResponse.json();
        const latestHeight = parseInt(latestData.block.header.height);

        const blockPromises = Array.from({ length: 50 }, (_, i) =>
          fetch(
            `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/${
              latestHeight - i
            }`
          ).then((res) => res.json())
        );

        const blocks = await Promise.all(blockPromises);
        setBlocks(blocks);
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    fetchBlocks();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs?events=message.action=%27/cosmos.bank.v1beta1.MsgSend%27&order_by=2"
        );
        const data = await response.json();

        const formattedTransactions = data.tx_responses.map(
          (tx: TxResponse) => ({
            height: tx.height,
            hash: tx.txhash,
            displayHash: tx.txhash.slice(0, 10) + "...",
            fees: tx.auth_info?.fee?.amount?.[0]?.amount || "0",
            sender: tx.tx.body.messages[0].from_address,
            created_at: new Date(tx.timestamp).toLocaleString(),
          })
        );

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (activeTab === "transactions") {
      fetchTransactions();
    }
  }, [activeTab]);

  const handleBlockClick = (height: string) => {
    router.push(`/blocksID/${height}`);
  };

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
      {isClient && (
        <>
          <div className="flex gap-6 mt-12">
            <button
              style={{
                backgroundColor:
                  activeTab === "blocks" ? theme.boxColor : theme.bgColor,
                color:
                  activeTab === "blocks"
                    ? theme.accentColor
                    : theme.secondaryTextColor,
                boxShadow:
                  activeTab === "blocks"
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    : "none",
              }}
              className={`px-4 py-2 flex items-center justify-center rounded-lg`}
              onClick={() => setActiveTab("blocks")}
            >
              Blocks
            </button>
            <button
              style={{
                backgroundColor:
                  activeTab === "transactions" ? theme.boxColor : theme.bgColor,
                color:
                  activeTab === "transactions"
                    ? theme.accentColor
                    : theme.secondaryTextColor,
                boxShadow:
                  activeTab === "transactions"
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    : "none",
              }}
              className={`px-4 py-2 rounded-lg`}
              onClick={() => setActiveTab("transactions")}
            >
              Recent Transactions
            </button>
          </div>

          {activeTab === "blocks" && (
            <div className="grid grid-cols-5 gap-4 mt-7">
              {blocks.map((block) => (
                <div
                  key={block.block.header.height}
                  onClick={() => handleBlockClick(block.block.header.height)}
                  style={{
                    backgroundColor: theme.boxColor,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  className="hover:bg-opacity-80 transition-colors duration-200 p-4 rounded-lg cursor-pointer"
                >
                  <div className="flex flex-col gap-2 p-6">
                    <div className="font-semibold flex justify-between">
                      <span style={{ color: theme.primaryTextColor }}>
                        Block {block.block.header.height}
                      </span>
                      <span
                        style={{ color: theme.quaternaryTextColor }}
                        className="font-normal"
                      >
                        {getRelativeTime(block.block.header.time)}
                      </span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <span style={{ color: theme.secondaryTextColor }}>
                        {block.block.header.chain_id}
                      </span>
                      <span style={{ color: theme.secondaryTextColor }}>
                        {block.block.data.txs.length} Tx
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div
              className="mt-7 rounded-lg space-y-1"
              style={{ backgroundColor: theme.boxColor }}
            >
              <div className="grid grid-cols-5 gap-4 mb-4 p-6">
                <div
                  style={{ color: theme.secondaryTextColor }}
                  className="font-medium p-3"
                >
                  Height
                </div>
                <div
                  style={{ color: theme.secondaryTextColor }}
                  className="font-medium p-3"
                >
                  Hash
                </div>
                <div
                  style={{ color: theme.secondaryTextColor }}
                  className="font-medium p-3"
                >
                  Fees
                </div>
                <div
                  style={{ color: theme.secondaryTextColor }}
                  className="font-medium p-3"
                >
                  Sender
                </div>
                <div
                  style={{ color: theme.secondaryTextColor }}
                  className="font-medium p-3"
                >
                  Created At
                </div>
              </div>

              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="grid grid-cols-5 gap-4 py-2 p-4 mx-6 rounded-lg"
                  style={{ backgroundColor: theme.bgColor }}
                >
                  <div
                    style={{ color: theme.primaryTextColor }}
                    className="text-xs p-3"
                  >
                    {tx.height}
                  </div>
                  <div
                    style={{ color: theme.accentColor }}
                    className="text-xs p-3 cursor-pointer hover:underline"
                    onClick={() => router.push(`/transaction/${tx.hash}`)}
                  >
                    {tx.displayHash}
                  </div>
                  <div
                    style={{ color: theme.primaryTextColor }}
                    className="text-xs p-3"
                  >
                    {parseFloat(tx.fees) === 0 ? "0" : "0"}
                  </div>
                  <div
                    style={{ color: theme.primaryTextColor }}
                    className="truncate text-xs p-3"
                  >
                    {tx.sender}
                  </div>
                  <div
                    style={{ color: theme.primaryTextColor }}
                    className="text-xs p-3"
                  >
                    {tx.created_at}
                  </div>
                </div>
              ))}

              <div
                className="mt-4 text-xs p-3"
                style={{ color: theme.quaternaryTextColor }}
              ></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
