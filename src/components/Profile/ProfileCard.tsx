import { Card, CardContent } from "../ui/card";
import { WalletIcon } from "../ui/icons";
import { WalletSession } from "../dashboard";
import { useTheme } from "@/context/ThemeContext";

interface ProfileCardProps {
  account: string;
  session: WalletSession | null;
  connectWallet: () => void;
  router: { push: (url: string) => void };
}

export function ProfileCard({
  account,
  session,
  connectWallet,
  router,
}: ProfileCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      className={`bg-[${theme.bgColor}]/40 border-0 mt-6 w-full max-w-lg mx-auto`}
    >
      <CardContent className="p-6">
        {!account ? (
          <button
            onClick={connectWallet}
            className={`flex items-center gap-2 px-4 py-2 text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
          >
            <WalletIcon />
            Wallet not connected
          </button>
        ) : (
          <div className="space-y-6">
            <div className={`text-[${theme.primaryTextColor}] text-xl mb-4`}>
              {account}
            </div>

            <div className="grid grid-cols-4 gap-4 ">
              <div className={`bg-[${theme.boxColor}] rounded-lg p-4`}>
                <div className={`text-[${theme.secondaryTextColor}]`}>
                  Balance
                </div>
                <div className={`text-[${theme.primaryTextColor}] text-lg`}>
                  {session?.balance}
                </div>
                <div className={`text-sm text-[${theme.secondaryTextColor}]`}>
                  ${session?.balance}
                </div>
              </div>
              <div className={`bg-[${theme.boxColor}] rounded-lg p-4`}>
                <div className={`text-[${theme.secondaryTextColor}]`}>
                  Staking
                </div>
                <div className={`text-[${theme.primaryTextColor}] text-lg`}>
                  {session?.staking}
                </div>
                <div className={`text-sm text-[${theme.secondaryTextColor}]`}>
                  ${session?.staking}
                </div>
              </div>
              <div className={`bg-[${theme.boxColor}] rounded-lg p-4`}>
                <div className={`text-[${theme.secondaryTextColor}]`}>
                  Reward
                </div>
                <div className={`text-[${theme.primaryTextColor}] text-lg`}>
                  {session?.reward}
                </div>
                <div className={`text-sm text-[${theme.secondaryTextColor}]`}>
                  $0
                </div>
              </div>
              <div className={`bg-[${theme.boxColor}] rounded-lg p-4`}>
                <div className={`text-[${theme.secondaryTextColor}]`}>
                  Withdrawals
                </div>
                <div className={`text-[${theme.primaryTextColor}] text-lg`}>
                  {session?.withdrawals}
                </div>
                <div className={`text-sm text-[${theme.secondaryTextColor}]`}>
                  $500,000
                </div>
              </div>
            </div>

            <div className="mt-8">
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-left text-[${theme.secondaryTextColor}] w-full`}
                  >
                    <th className="pb-4 w-1/4">Validator</th>
                    <th className="pb-4 w-1/4">Stakes</th>
                    <th className="pb-4 w-1/4">Rewards</th>
                    <th className="pb-4 w-1/4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {session?.stakes.map((stake, index) => (
                    <tr
                      key={index}
                      className={`border-t border-[${theme.accentColor}] bg-[${theme.boxColor}]`}
                    >
                      <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                        {stake.validator}
                      </td>
                      <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                        {stake.amount}
                      </td>
                      <td className={`p-4 text-[${theme.primaryTextColor}]`}>
                        {stake.rewards}
                      </td>
                      <td className="p-4">
                        <button
                          className={`px-4 py-2 bg-[${theme.bgColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                        >
                          CLAIM REWARDS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                className={`px-8 py-3 bg-[${theme.bgColor}] text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
                onClick={() => router.push("/account")}
              >
                My Account
              </button>
              <button
                className={`px-8 py-3 bg-[${theme.bgColor}] text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
              >
                Create Stake
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
