export function TransactionsTable() {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-white mb-4 text-xl">Transactions</div>
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
            <tr className="border-b border-[#2D4BA0]">
              <td className="py-4 text-white">64,188,000</td>
              <td className="py-4 text-white">0xa3f2...</td>
              <td className="py-4 text-white">Delegate</td>
              <td className="py-4 text-white">
                11/28/2023, 3:32 PM (an hour ago)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
