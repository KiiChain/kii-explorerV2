"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { SupplyHeader } from "@/components/Supply/SupplyHeader";

interface BankSupply {
  id: string;
  address: string;
  amount: string;
  percentage: string;
}

const initialSupplies: BankSupply[] = [
  {
    id: "1",
    address: "kii1m2l3kq4l2k3j4l2k3j4l2k3j4l2k3j4l2k5",
    amount: "997000000000000",
    percentage: "5.54%",
  },
  {
    id: "2",
    address: "kii4k5j6h7g8f9d0s1a2s3d4f5g6h7j8k9l0",
    amount: "300000000000",
    percentage: "0.02%",
  },
  {
    id: "3",
    address: "kii9d8s7f6g5h4j3k2l1p0o9i8u7y6t5r4e3",
    amount: "100000000000",
    percentage: "0.01%",
  },
  {
    id: "4",
    address: "kii2s3d4f5g6h7j8k9l0p1o2i3u4y5t6r7e8",
    amount: "169990000000000000",
    percentage: "94.44%",
  },
];

export function SupplyDashboard() {
  const [filter, setFilter] = useState("");

  const filteredSupplies = initialSupplies.filter((supply) =>
    supply.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#05000F]">
      <SupplyHeader />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Bank Supply</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {initialSupplies.map((supply) => (
            <Card
              key={supply.id}
              className="bg-gradient-to-br from-purple-400/20 to-transparent p-4 border-0"
            >
              <div className="h-24 flex flex-col justify-between">
                <div className="text-sm text-gray-400 truncate">
                  {supply.address}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">
                    {supply.amount}
                  </div>
                  <div className="text-sm text-purple-400">
                    {supply.percentage}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-[#231C32] rounded-lg p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by address"
              className="w-full px-4 py-2 bg-[#05000F] rounded-lg text-white placeholder-gray-400 focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">% of supply</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplies.map((supply) => (
                  <tr
                    key={supply.id}
                    className="border-t border-[#2D4BA0] hover:bg-[#05000F]/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-[#F3F5FB]">
                      {supply.address}
                    </td>
                    <td className="py-4 px-4 text-[#F3F5FB]">
                      {supply.amount}
                    </td>
                    <td className="py-4 px-4 text-[#F3F5FB]">
                      {supply.percentage}
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
