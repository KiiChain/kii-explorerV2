import { SendIBCTokens } from "@/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// useSendIBC is the wrapper to the SendIBC Token function
export function useSendIBC() {
  const queryClient = useQueryClient();

  type props = {
    toAddress: string;
    ibc_channel: string;
    amount: string;
    denom: string;
    exponent: number;
    walletClient: any;
  };

  return useMutation({
    mutationFn: (data: props) =>
      SendIBCTokens(
        data.toAddress,
        data.ibc_channel,
        data.amount,
        "IBC Transfer",
        data.walletClient,
        data.exponent,
        data.denom
      ),

    onSuccess: (data, variables) => {
      // validate if the transfer was successfully
      if (data.status != 1) {
        toast.error("Transaction has failed, please try later");
        return;
      }

      toast.success("IBC Transfer Successfully Completed");

      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
    },

    onError: ({ message }) => {
      toast.error(`Error validating task on CosmosHub:, ${message}`);
    },
  });
}
