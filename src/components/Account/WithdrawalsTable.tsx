import { KIICHAIN_SYMBOL } from "@/config/chain";
import { useTheme } from "@/context/ThemeContext";
import { useUnbondingDelegationsQuery } from "@/services/queries/unbondingDelegations";
import { formatAmount } from "@/utils/format";

interface WithdrawalsTableProps {
  cosmosAddress: string;
}

export function WithdrawalsTable({ cosmosAddress }: WithdrawalsTableProps) {
  const { theme } = useTheme();
  const { data: unbonds } = useUnbondingDelegationsQuery(cosmosAddress);

  const flattenedUnbonds = unbonds?.flatMap((response) =>
    response.entries.map((entry) => ({
      ...entry,
      validator_address: response.validator_address,
      delegator_address: response.delegator_address,
    }))
  );

  return (
    <div
      className="mt-8 p-6 rounded-lg"
      style={{ backgroundColor: theme.boxColor }}
    >
      <div className="mb-6">
        <div className="mb-4 text-xl" style={{ color: theme.primaryTextColor }}>
          Withdrawals
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full" style={{ backgroundColor: theme.bgColor }}>
            <thead>
              <tr>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Creation Height
                </th>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Initial Balance
                </th>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Balance
                </th>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Completion Time
                </th>
              </tr>
            </thead>
            <tbody>
              {flattenedUnbonds?.map((unbond, index) => (
                <tr key={index}>
                  <td
                    className="p-4 text-left"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {unbond.creation_height}
                  </td>
                  <td
                    className="p-4 text-left"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {formatAmount(unbond.initial_balance)} {KIICHAIN_SYMBOL}
                  </td>
                  <td
                    className="p-4 text-left"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {formatAmount(unbond.balance)} {KIICHAIN_SYMBOL}
                  </td>
                  <td
                    className="p-4 text-left"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {new Date(unbond.completion_time).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
