import { KIICHAIN_ORO_DENOM } from "@/config/chain";
import { KIICHAIN_BASE_DENOM } from "@kiichain/kiijs-evm";
import { kiichain } from "@kiichain/kiijs-proto";
import { useMutation } from "wagmi/query";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

export const useMigrateCosmosTokensMutation = () => {
  type props = {
    cosmosAddr: string;
    evmAddr: string;
    cosmosClient: any;
    setFetchBalance: Dispatch<SetStateAction<boolean>>;
  };

  return useMutation({
    mutationFn: async (data: props) =>
      migrateTokens(data.cosmosAddr, data.evmAddr, data.cosmosClient),

    onError: (error: unknown, variables) => {
      toast.error(`Failed to migrate tokens ${error}`);

      variables.setFetchBalance(true);
    },

    onSuccess: (_, variables) => {
      toast.success("Success Migration", {
        description: "Your tokens have been migrated",
      });

      variables.setFetchBalance(true);
    },
  });
};

// migrateTokens
async function migrateTokens(
  cosmosAddr: string,
  evmAddr: string,
  cosmosClient: any
) {
  // Create message structure
  const { send } = kiichain.kiichain3.evm.MessageComposer.withTypeUrl;

  // get Kii balance
  const kiiBalance = await cosmosClient.getBalance(
    cosmosAddr,
    KIICHAIN_BASE_DENOM
  );

  // get Oro balance
  const oroBalance = await cosmosClient.getBalance(
    cosmosAddr,
    KIICHAIN_ORO_DENOM
  );

  // calculate Kii tokens to send (kiiBalance - 100000uKii)
  const kiiBalanceAmount = BigInt(kiiBalance.amount);
  const minRemain = BigInt("100000");
  const sendableKii = (kiiBalanceAmount - minRemain).toString();
  if (kiiBalanceAmount < minRemain)
    throw new Error("Token balance not enought");

  // Create message
  const msg = send({
    amount: [
      oroBalance,
      {
        denom: KIICHAIN_BASE_DENOM,
        amount: sendableKii,
      },
    ],
    fromAddress: cosmosAddr,
    toAddress: evmAddr,
  });

  // constant 100000 uKii as fee (0.1Kii)
  const fee = {
    amount: [{ denom: KIICHAIN_BASE_DENOM, amount: "5000" }], // fee amount
    gas: "200000", // gas limit
  };

  // Build transaction
  try {
    await cosmosClient.signAndBroadcast(cosmosAddr, [msg], fee);
  } catch (error) {
    console.error("Error broadcasting the transaction:", error);
  }
}
