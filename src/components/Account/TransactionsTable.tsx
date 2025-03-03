import { useTheme } from "@/context/ThemeContext";

interface Transaction {
  height: string;
  hash: string;
  messages: string;
  time: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const TransactionsTable = ({
  transactions,
  onLoadMore,
  hasMore,
  isLoading,
}: TransactionsTableProps) => {
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
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Transactions
        </div>
        <table className="w-full">
          <thead>
            <tr
              className={`text-left text-[${theme.secondaryTextColor}] `}
              style={{ backgroundColor: theme.bgColor }}
            >
              <th className="p-4" style={{ backgroundColor: theme.bgColor }}>
                Height
              </th>
              <th className="p-4" style={{ backgroundColor: theme.bgColor }}>
                Hash
              </th>
              <th className="p-4" style={{ backgroundColor: theme.bgColor }}>
                Messages
              </th>
              <th className="p-4" style={{ backgroundColor: theme.bgColor }}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className={`border-b border-[${theme.borderColor}]`}
                style={{ backgroundColor: theme.bgColor }}
              >
                <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                  {tx.height}
                </td>
                <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                  {tx.hash}
                </td>
                <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                  {tx.messages}
                </td>
                <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                  {tx.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
