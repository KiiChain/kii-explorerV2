interface Withdrawal {
  creationHeight: string;
  initialBalance: string;
  balance: string;
  completionTime: string;
}

interface WithdrawalsTableProps {
  withdrawals: Withdrawal[];
  account: string;
}

export function WithdrawalsTable({
  withdrawals,
  account,
}: WithdrawalsTableProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-white mb-4 text-xl">Withdrawals</div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Creation Height</th>
              <th className="pb-4">Initial Balance</th>
              <th className="pb-4">Balance</th>
              <th className="pb-4">Completion Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="pb-4">
                <div className="text-[#05000F] font-mono bg-[#F3F5FB] p-4 rounded-lg">
                  {account}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="h-4"></td>
            </tr>
            {withdrawals.map((withdrawal, index) => (
              <tr key={index} className="bg-[#05000F]">
                <td className="p-4 text-white rounded-l-lg">
                  {withdrawal.creationHeight}
                </td>
                <td className="p-4 text-white">{withdrawal.initialBalance}</td>
                <td className="p-4 text-white">{withdrawal.balance}</td>
                <td className="p-4 text-white rounded-r-lg">
                  {withdrawal.completionTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
