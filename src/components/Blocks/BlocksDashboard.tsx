"use client";

import React, { useState, useEffect } from "react";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";

export function BlocksDashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-6 bg-[#05000F]">
      <UptimeHeader />

      {isClient && (
        <>
          <div className="flex gap-6 mt-12">
            <button
              className={`px-4 py-2 flex items-center justify-center ${
                activeTab === "blocks"
                  ? "bg-[#231C32] text-[#D2AAFA]"
                  : "bg-[#05000F] hover:bg-[#231C32] text-[#D2AAFA]"
              } hover:text-[#E0B1FF] rounded-lg`}
              onClick={() => setActiveTab("blocks")}
            >
              Blocks
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "transactions"
                  ? "bg-[#231C32] text-white"
                  : "bg-[#05000F] hover:bg-[#231C32] text-gray-400"
              } hover:text-[#E0B1FF] rounded-lg`}
              onClick={() => setActiveTab("transactions")}
            >
              Recent Transactions
            </button>
          </div>

          {activeTab === "blocks" && (
            <div className="grid grid-cols-5 gap-4 mt-7">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index + 1}
                  className="bg-[#231C32] hover:bg-opacity-80 transition-colors duration-200 p-4 rounded-lg cursor-pointer"
                >
                  <div className="flex flex-col gap-2 p-6">
                    <div className="text-white font-semibold flex justify-between">
                      <span>Block {index + 1}</span>
                      <span className="text-[#7DD1F8] font-normal">
                        40s Ago
                      </span>
                    </div>
                    <div className="text-[#F3F5FB] text-sm flex justify-between">
                      <span>KiiChain Validator 1</span>
                      <span>5 Tx</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="text-gray-400 mt-6">
              Recent Transactions Content
            </div>
          )}
        </>
      )}
    </div>
  );
}
