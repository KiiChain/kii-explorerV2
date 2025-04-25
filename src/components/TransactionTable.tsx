import { KIICHAIN_SYMBOL } from "@/config/chain";
import { useTheme } from "@/context/ThemeContext";

interface Transaction {
  from: string;
  to: string;
  amount: string;
  denom: string;
  timestamp: string;
  hash: string;
}

export function TransactionTable({
  latestTransactions,
  handleAddressClick,
}: {
  latestTransactions: Transaction[];
  handleAddressClick: (address: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="mt-4">
      <table className="w-full table-fixed">
        <tbody className="space-y-4">
          {latestTransactions.map((transaction, index) => (
            <tr
              key={index}
              style={{ backgroundColor: theme.bgColor }}
              className="rounded-lg mb-4 w-full"
            >
              <td className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 items-center">
                <span
                  className="col-span-1 lg:col-span-2 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  style={{ color: theme.accentColor }}
                  onClick={() => handleAddressClick(transaction.from)}
                >
                  <span style={{ color: theme.secondaryTextColor }}>
                    {transaction.from}
                  </span>
                </span>
                <div className="flex items-center gap-2 col-span-1 lg:col-span-3">
                  <span style={{ color: theme.secondaryTextColor }}>To</span>
                  <span
                    style={{ color: theme.accentColor }}
                    className="truncate md:whitespace-nowrap cursor-pointer hover:opacity-80"
                    onClick={() => handleAddressClick(transaction.to)}
                  >
                    {transaction.to}
                  </span>
                </div>
                <span
                  className="col-span-1 lg:col-span-2 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  style={{ color: theme.accentColor }}
                >
                  <span style={{ color: theme.secondaryTextColor }}>
                    {transaction.hash || "N/A"}
                  </span>
                </span>
                <div className="flex justify-center col-span-1 lg:col-span-2">
                  <span
                    style={{
                      backgroundColor: theme.boxColor,
                      color: theme.accentColor,
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    className="px-3 py-1 rounded-full text-center inline-block w-fit cursor-pointer hover:opacity-80"
                  >
                    {parseInt(transaction.amount) / 1000000}
                    {transaction.denom.includes(KIICHAIN_SYMBOL)
                      ? "KII"
                      : "ORO"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
