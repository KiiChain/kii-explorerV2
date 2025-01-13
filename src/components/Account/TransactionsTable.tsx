import { useTheme } from "@/context/ThemeContext";

interface Transaction {
  height: string;
  hash: string;
  messages: string;
  time: string;
}

export function TransactionsTable({
  transactions = [],
}: {
  transactions?: Transaction[];
}) {
  const { theme } = useTheme();

  if (transactions.length === 0) {
    return (
      <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Transactions
        </div>
        <div className={`text-[${theme.secondaryTextColor}] text-center py-4`}>
          No transactions found
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}]/40 rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Transactions
        </div>
        <table className="w-full">
          <thead>
            <tr className={`text-left text-[${theme.secondaryTextColor}]`}>
              <th className="pb-4">Height</th>
              <th className="pb-4">Hash</th>
              <th className="pb-4">Messages</th>
              <th className="pb-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className={`border-b border-[${theme.borderColor}]`}
              >
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {tx.height}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {tx.hash}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {tx.messages}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {tx.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
