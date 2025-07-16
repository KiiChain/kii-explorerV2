import { useAccount, useWalletClient } from "wagmi";
import { toast } from "react-toastify";
import { RewardsResponse } from "@/services/queries/rewards";
import { formatUnits } from "ethers";
import { Theme } from "./StakesTable";
import {
  useWithdrawAllRewardsMutation,
  useWithdrawRewardsMutation,
} from "@/services/mutations/distribution";
import { WagmiConnectButton } from "../ui/WagmiConnectButton";
import { FaSpinner } from "react-icons/fa";

interface RewardsTableProps {
  rewardsData: RewardsResponse | undefined;
  theme: Theme;
  validators: Record<string, string>;
  isOwner: boolean;
}

export function RewardsTable({
  rewardsData,
  theme,
  validators,
  isOwner,
}: RewardsTableProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const withdrawRewardMutation = useWithdrawRewardsMutation();
  const withdrawAllRewardMutation = useWithdrawAllRewardsMutation();

  const handleClaim = (validatorAddress: string) => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet to claim rewards");
      return;
    }

    withdrawRewardMutation.mutate({
      validatorAddr: validatorAddress,
      walletClient: walletClient,
    });
  };

  const handleAllClaim = () => {
    if (!isConnected) {
      toast.error("Connect your wallet to claim all rewards");
      return;
    }

    withdrawAllRewardMutation.mutate({
      walletClient: walletClient,
    });
  };

  return (
    <div
      className="mt-8 p-6 rounded-lg relative"
      style={{ backgroundColor: theme.boxColor }}
    >
      <div className="mb-6">
        <div className="mb-4 text-xl" style={{ color: theme.primaryTextColor }}>
          Rewards
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full" style={{ backgroundColor: theme.bgColor }}>
            <thead>
              <tr>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Validator
                </th>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Rewards
                </th>
                <th
                  className="p-4 text-left"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {rewardsData?.rewards.map((rewardItem, index) => {
                const akiiReward = rewardItem.reward.find(
                  (r) => r.denom === "akii"
                );
                const formattedReward = akiiReward
                  ? formatUnits(akiiReward.amount.split(".")[0]) + " KII"
                  : "0 KII";

                return (
                  <tr key={index}>
                    <td
                      className="p-4 text-left break-all"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validators[rewardItem.validator_address] ??
                        rewardItem.validator_address}
                    </td>
                    <td
                      className="p-4 text-left"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {formattedReward}
                    </td>

                    <td className="p-4 text-left">
                      {!isConnected ? (
                        <WagmiConnectButton />
                      ) : isOwner ? (
                        <button
                          className={`px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-80`}
                          style={{
                            backgroundColor: theme.boxColor,
                            color: theme.accentColor,
                          }}
                          onClick={() =>
                            handleClaim(rewardItem.validator_address)
                          }
                          disabled={withdrawRewardMutation.isPending}
                        >
                          {withdrawRewardMutation.isPending && (
                            <FaSpinner className="animate-spin" />
                          )}
                          Claim
                        </button>
                      ) : (
                        <span
                          className="text-sm italic"
                          style={{ color: theme.secondaryTextColor }}
                        >
                          Not available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {rewardsData?.rewards?.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    No rewards available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isConnected &&
        isOwner &&
        rewardsData &&
        rewardsData?.rewards?.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-80`}
              style={{
                backgroundColor: theme.bgColor,
                color: theme.primaryTextColor,
              }}
              onClick={handleAllClaim}
              disabled={withdrawRewardMutation.isPending}
            >
              {withdrawAllRewardMutation.isPending && (
                <FaSpinner className="animate-spin" />
              )}
              Claim All
            </button>
          </div>
        )}
    </div>
  );
}
