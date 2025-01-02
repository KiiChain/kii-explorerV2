import React from "react";

export function TransactionsTable() {
  const transactions = [
    {
      height: "4478880",
      hash: "0xAd3F9b20f4e44c142Ca628...",
      message: "Delegate",
      time: "11/28/2024, 3:39:12 PM (An Hour Ago)",
    },
    {
      height: "4478880",
      hash: "0xAd3F9b20f4e44c142Ca628...",
      message: "Delegate",
      time: "11/28/2024, 3:39:12 PM (An Hour Ago)",
    },
    {
      height: "4478880",
      hash: "0xAd3F9b20f4e44c142Ca628...",
      message: "Delegate",
      time: "11/28/2024, 3:39:12 PM (An Hour Ago)",
    },
  ];

  return (
    <div className="mt-12 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-[#F3F5FB] mb-16 text-xl">Transactions</div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Height</th>
              <th className="pb-4">Hash</th>
              <th className="pb-4">Messages</th>
              <th className="pb-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 bg-[#05000F] rounded-lg"
                >
                  No Transactions
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <tr>
                      <td colSpan={4} className="h-4"></td>
                    </tr>
                  )}
                  <tr className="bg-[#05000F] rounded-lg">
                    <td className="py-4 text-[#F3F5FB] pl-8 rounded-l-lg">
                      {tx.height}
                    </td>
                    <td className="py-4 text-[#F3F5FB] pl-8">{tx.hash}</td>
                    <td className="py-4 text-[#F3F5FB] pl-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00FFA3]">✓</span>
                        {tx.message}
                      </div>
                    </td>
                    <td className="py-4 text-[#F3F5FB] pl-8 rounded-r-lg">
                      {tx.time}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
