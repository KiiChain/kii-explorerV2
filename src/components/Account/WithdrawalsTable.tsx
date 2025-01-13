import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Withdrawals
        </div>
        <table className="w-full">
          <thead>
            <tr className={`text-left text-[${theme.secondaryTextColor}]`}>
              <th className="pb-4">Creation Height</th>
              <th className="pb-4">Initial Balance</th>
              <th className="pb-4">Balance</th>
              <th className="pb-4">Completion Time</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal, index) => (
              <tr
                key={index}
                className={`border-b border-[${theme.borderColor}]`}
              >
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {withdrawal.creationHeight}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {withdrawal.initialBalance}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {withdrawal.balance}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
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
