"use client";

import React, { useState } from "react";
import { BlocksHeader } from "@/components/headerDashboard";

interface SmartContract {
  codeId: string;
  codeHash: string;
  creator: string;
  createdAt: string;
}

const initialContracts: SmartContract[] = [
  {
    codeId: "2258694",
    codeHash: "2D4C79CDE9765E52C69AF43E",
    creator: "0x666a286362Ffb4eF21CA25CD1273Cc5D07b7037",
    createdAt: "2024-10-30 14:21",
  },
  {
    codeId: "2258694",
    codeHash: "2D4C79CDE9765E52C69AF43E",
    creator: "0x666a286362Ffb4eF21CA25CD1273Cc5D07b7037",
    createdAt: "2024-10-30 14:21",
  },
];

export function SmartContractsDashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );

  return (
    <div className="p-6 bg-[#05000F] w-full">
      <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-24">
        <div className="bg-[#231C32] rounded-lg p-6">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-[#F3F5FB] border-b border-[#2D4BA0]">
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Code ID</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Code Hash</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Creator</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Created At</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialContracts.map((contract, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#2D4BA0] bg-[#05000F] hover:bg-[#05000F]/50 transition-colors"
                  >
                    <td className="py-6 px-2 sm:px-6 text-[#F3F5FB]">
                      {contract.codeId}
                    </td>
                    <td className="py-6 px-2 sm:px-6">
                      <span className="text-[#00F9A6]">
                        {contract.codeHash}
                      </span>
                    </td>
                    <td className="py-6 px-2 sm:px-6 text-[#F3F5FB] font-light">
                      {contract.creator}
                    </td>
                    <td className="py-6 px-2 sm:px-6 text-[#F3F5FB] font-light">
                      {contract.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
