import { useTheme } from "@/context/ThemeContext";

export function TransactionsTable() {
  const { theme } = useTheme();

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
            <tr className={`border-b border-[${theme.borderColor}]`}>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                64,188,000
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                0xa3f2...
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                Delegate
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                11/28/2023, 3:32 PM (an hour ago)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
