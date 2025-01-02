"use client";

import React, { useState, useEffect } from "react";
import { BlocksHeader } from "@/components/headerDashboard";

export function BlocksDashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-6">
      <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {isClient && (
        <>
          {activeTab === "blocks" && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index + 1}
                  className="bg-[#231C32] hover:bg-opacity-80 transition-colors duration-200 p-4 rounded-lg cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-white font-semibold">
                      Block {index + 1}
                    </div>
                    <div className="text-gray-400 text-sm">40s Ago</div>
                    <div className="text-gray-400 text-sm">
                      KiiChain Validator 1
                    </div>
                    <div className="text-gray-400 text-sm">5 Tx</div>
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
