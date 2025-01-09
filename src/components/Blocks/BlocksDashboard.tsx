"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";

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
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    setIsClient(true);

    const fetchBlocks = async () => {
      try {
        const latestResponse = await axios.get(
          "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/latest"
        );
        const latestHeight = parseInt(latestResponse.data.block.header.height);

        const blockPromises = Array.from({ length: 50 }, (_, i) =>
          axios.get(
            `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/${
              latestHeight - i
            }`
          )
        );

        const responses = await Promise.all(blockPromises);
        const blocks = responses.map((response) => response.data);
        setBlocks(blocks);
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
      {isClient && (
        <>
          <div className="flex gap-6 mt-12">
            <button
              style={{
                backgroundColor:
                  activeTab === "blocks" ? theme.boxColor : theme.bgColor,
                color: theme.accentColor,
                boxShadow:
                  activeTab === "blocks"
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    : "none",
              }}
              className={`px-4 py-2 flex items-center justify-center hover:text-[${theme.tertiaryTextColor}] rounded-lg`}
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
                    ? theme.primaryTextColor
                    : theme.secondaryTextColor,
                boxShadow:
                  activeTab === "transactions"
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    : "none",
              }}
              className={`px-4 py-2 hover:text-[${theme.tertiaryTextColor}] rounded-lg`}
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
            <div style={{ color: theme.secondaryTextColor }} className="mt-6">
              Recent Transactions Content
            </div>
          )}
        </>
      )}
    </div>
  );
}
