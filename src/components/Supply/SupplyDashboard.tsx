"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BlocksHeader } from "@/components/headerDashboard";

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
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );

  return (
    <div className="p-6 bg-[#05000F]">
      <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-24">
        <h2 className="text-xl font-semibold text-white mb-4">Bank Supply</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 mt-8 w-3/5">
          {initialSupplies.map((supply) => (
            <div key={supply.id}>
              <Card className="bg-[#1A1A1A] px-2 pt-4 pb-2 border-0 rounded-lg shadow-lg w-40 h-52">
                <div className="h-full w-full bg-transparent relative rounded-lg overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full rounded-t-lg"
                    style={{
                      height: supply.percentage,
                      background:
                        "linear-gradient(to top, #625FFF, #D2AAFA, #C6C7F8)",
                    }}
                  ></div>
                </div>
              </Card>
              <div
                className="text-sm text-gray-400 truncate mt-2 flex justify-center"
                style={{ maxWidth: "90%" }}
              >
                {supply.address.slice(0, supply.address.length / 2)}...
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#231C32] rounded-lg p-6">
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
                {initialSupplies.map((supply) => (
                  <tr
                    key={supply.id}
                    className="border-t border-[#2D4BA0] bg-[#05000F] text-sm "
                  >
                    <td className="py-4 px-4 text-[#D2AAFA]">
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
