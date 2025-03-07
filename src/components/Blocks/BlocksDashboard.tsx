"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import {
  useBlocksDashboard,
  useRecentTransactions,
  getRelativeTime,
} from "@/services/queries/blocksDashboard";

export function BlocksDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const { theme } = useTheme();

  const { data: blocks = [] } = useBlocksDashboard();
  const { data: transactions = [] } = useRecentTransactions();

  const handleBlockClick = (height: string) => {
    router.push(`/blocksID/${height}`);
  };

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
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
                  <span
                    className="text-base"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {block.block.header.height}
                  </span>
                  <span
                    style={{ color: theme.quaternaryTextColor }}
                    className="font-normal pl-4 text-sm"
                  >
                    {getRelativeTime(block.block.header.time)}
                  </span>
                </div>
                <div className="text-sm flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    {block.block.header.chain_id}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: theme.secondaryTextColor }}
                  >
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
    </div>
  );
}
