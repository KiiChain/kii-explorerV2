import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  WithdrawAllRewards,
  WithdrawDelegatorRewards,
} from "../contracts/distribution";

// useWithdrawRewardsMutation executes the withdraw-reward function on the Distribution precompile
export const useWithdrawRewardsMutation = () => {
  const queryClient = useQueryClient();

  type props = {
    validatorAddr: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    walletClient: any;
  };

  return useMutation({
    mutationFn: async ({ validatorAddr, walletClient }: props) =>
      WithdrawDelegatorRewards(validatorAddr, walletClient),
    onSuccess: () => {
      toast.success("Successful withdrawal of your reward");
      queryClient.invalidateQueries({
        queryKey: ["rewards"],
      });
    },
    onError: (error) => {
      console.error("Undelegation error:", error);
      toast.error("Failed to withdraw reward", {
        description:
          "Please try again or contact support if the problem persists",
      });
    },
  });
};

// useWithdrawAllRewardsMutation executes the withdraw all rewards function on the Distribution precompile
export const useWithdrawAllRewardsMutation = () => {
  const queryClient = useQueryClient();

  type props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    walletClient: any;
  };

  return useMutation({
    mutationFn: async ({ walletClient }: props) =>
      WithdrawAllRewards(walletClient),
    onSuccess: () => {
      toast.success("Successful withdrawal all of your rewards");
      queryClient.invalidateQueries({
        queryKey: ["rewards"],
      });
    },
    onError: (error) => {
      console.error("Undelegation error:", error);
      toast.error("Failed to withdraw all rewards", {
        description:
          "Please try again or contact support if the problem persists",
      });
    },
  });
};
