import { useTheme } from "@/context/ThemeContext";

interface DelegationResponse {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
    moniker?: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
}

interface StakeProps {
  delegations: DelegationResponse[];
}

export function StakesTable({ delegations }: StakeProps) {
  const { theme } = useTheme();

  if (!delegations || delegations.length === 0) {
    return (
      <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Stakes
        </div>
        <div className={`text-[${theme.secondaryTextColor}] text-center py-4`}>
          No stakes found
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl pb-2`}>
          Stakes
        </div>
        <table className="w-full">
          <thead>
            <tr className={`text-left text-[${theme.secondaryTextColor}]`}>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Validator
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Shares
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Balance
              </th>
              <th
                className="p-4"
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {delegations.map((delegation, index) => (
              <tr
                key={index}
                className={`border border-solid border-[${theme.borderColor}]`}
                style={{
                  backgroundColor: theme.bgColor,
                }}
              >
                <td
                  className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                >
                  {delegation.delegation.moniker || "Unknown"}
                </td>
                <td
                  className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                >
                  {delegation.delegation.shares}
                </td>
                <td
                  className={`p-4 text-[${theme.primaryTextColor}] border-r border-solid border-[${theme.borderColor}]`}
                >
                  {`${delegation.balance.amount} ${delegation.balance.denom}`}
                </td>
                <td className="p-4">
                  <button
                    className={`px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                  >
                    Relocate
                  </button>
                  <button
                    className={`ml-2 px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                  >
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
