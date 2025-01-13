import { useTheme } from "@/context/ThemeContext";

interface StakeProps {
  stakes: {
    validator: string;
    amount: string;
    rewards: string;
  }[];
}

export function StakesTable({ stakes }: StakeProps) {
  const { theme } = useTheme();

  if (!stakes || stakes.length === 0) {
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
    <div className={`mt-8 p-6 bg-[${theme.boxColor}]/40 rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Stakes
        </div>
        <table className="w-full">
          <thead>
            <tr className={`text-left text-[${theme.secondaryTextColor}]`}>
              <th className="pb-4">Validator</th>
              <th className="pb-4">Stake</th>
              <th className="pb-4">Rewards</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {stakes?.map((stake, index) => (
              <tr
                key={index}
                className={`border-b border-[${theme.borderColor}] bg-[${theme.bgColor}]`}
              >
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {stake.validator}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {stake.amount}
                </td>
                <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                  {stake.rewards}
                </td>
                <td className="py-4">
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
