interface Withdrawal {
  creationHeight: string;
  initialBalance: string;
  balance: string;
  completionTime: string;
}

interface WithdrawalsTableProps {
  withdrawals: Withdrawal[];
}

export function WithdrawalsTable({ withdrawals }: WithdrawalsTableProps) {
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
            {withdrawals.map((withdrawal, index) => (
              <tr key={index} className="border-b border-[#2D4BA0]">
                <td className="py-4 text-white">{withdrawal.creationHeight}</td>
                <td className="py-4 text-white">{withdrawal.initialBalance}</td>
                <td className="py-4 text-white">{withdrawal.balance}</td>
                <td className="py-4 text-white">{withdrawal.completionTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
