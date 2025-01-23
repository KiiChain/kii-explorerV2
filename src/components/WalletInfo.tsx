import { WalletIcon } from "./ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { useWallet } from "@/context/WalletContext";

export function WalletInfo({ connectWallet }: { connectWallet: () => void }) {
  const { theme } = useTheme();
  const { account, session } = useWallet();
  const priceCoin = 0;

  return (
    <div>
      {!account ? (
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80"
          style={{ color: theme.primaryTextColor }}
        >
          <WalletIcon />
          Wallet not connected
        </button>
      ) : (
        <div className="space-y-6 text-base">
          <div className="mb-4" style={{ color: theme.primaryTextColor }}>
            {account}
          </div>
          <div className="grid grid-cols-4 gap-4 ">
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="text-gray-400">Balance</div>
              <div style={{ color: theme.primaryTextColor }}>
                {session?.balance}
              </div>
              <div className="text-gray-400">
                ${Number(session?.balance ?? 0) * priceCoin}
              </div>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="text-gray-400">Delegations</div>
              <div className="" style={{ color: theme.primaryTextColor }}>
                {session?.staking}
              </div>
              <div className=" text-gray-400">${session?.staking}</div>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="text-gray-400">Reward</div>
              <div className="" style={{ color: theme.primaryTextColor }}>
                {session?.reward}
              </div>
              <div className="text-gray-400">$0</div>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="text-gray-400">Withdrawals</div>
              <div className="" style={{ color: theme.primaryTextColor }}>
                {session?.withdrawals}
              </div>
              <div className="text-gray-400">$0</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
