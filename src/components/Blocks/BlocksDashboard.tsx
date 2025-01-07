"use client";

import React, { useState, useEffect } from "react";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { useTheme } from "@/context/ThemeContext";

export function BlocksDashboard() {
  const [activeTab] = useState<"blocks" | "transactions">("blocks");
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={`p-6 bg-[${theme.bgColor}]`}>
      <UptimeHeader />

      {isClient && (
        <>
          <div className="flex gap-6 mt-12">
            <button
              className={`px-4 py-2 flex items-center justify-center ${
                activeTab === "blocks"
                  ? `bg-[${theme.boxColor}] text-[${theme.accentColor}]`
                  : `bg-[${theme.bgColor}] hover:bg-[${theme.boxColor}] text-[${theme.accentColor}]`
              } hover:text-[${theme.tertiaryTextColor}] rounded-lg`}
              onClick={() => setActiveTab("blocks")}
            >
              Blocks
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "transactions"
                  ? `bg-[${theme.boxColor}] text-[${theme.primaryTextColor}]`
                  : `bg-[${theme.bgColor}] hover:bg-[${theme.boxColor}] text-[${theme.secondaryTextColor}]`
              } hover:text-[${theme.tertiaryTextColor}] rounded-lg`}
              onClick={() => setActiveTab("transactions")}
            >
              Recent Transactions
            </button>
          </div>

          {activeTab === "blocks" && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index + 1}
                  className={`bg-[${theme.boxColor}] hover:bg-opacity-80 transition-colors duration-200 p-4 rounded-lg cursor-pointer`}
                >
                  <div className="flex flex-col gap-2 p-6">
                    <div
                      className={`text-[${theme.primaryTextColor}] font-semibold flex justify-between`}
                    >
                      <span>Block {index + 1}</span>
                      <span
                        className="font-normal"
                        style={{ color: theme.quaternaryTextColor }}
                      >
                        40s Ago
                      </span>
                    </div>
                    <div
                      className={`text-[${theme.secondaryTextColor}] text-sm flex justify-between`}
                    >
                      <span>KiiChain Validator 1</span>
                      <span>5 Tx</span>
                    </div>
                    <div className="text-gray-400 text-sm">5 Tx</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className={`text-[${theme.secondaryTextColor}] mt-6`}>
              Recent Transactions Content
            </div>
          )}
        </>
      )}
    </div>
  );
}
