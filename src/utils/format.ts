import * as kiiEvm from "@kiichain/kiijs-evm";
import { ethers } from "ethers";

export const formatAmount = (amount: string): string => {
  const num = parseFloat(amount) / 1_000_000_000_000_000_000;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
};

// SendIBCTokens sends native tokens via IBC to the provided channel
export async function SendIBCTokens(
  toAddress: string,
  channel: string,
  amount: string,
  memo: string,
  walletClient: any,
  exponent: number,
  denom: string
) {
  const PORT = "transfer";
  const convertedAmount = ethers.parseUnits(amount, exponent);

  try {
    if (!walletClient) throw new Error("Wallet not connected");

    const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
    const signer = await ethersProvider.getSigner();

    const ibcPrecompile = kiiEvm.getIBCPrecompileEthersV6Contract(signer);

    const tx = await ibcPrecompile.transferWithDefaultTimeout(
      toAddress,
      PORT,
      channel,
      denom,
      convertedAmount,
      memo
    );

    return await tx.wait();
  } catch (error) {
    console.error("Error trying to make an IBC transfer:", error);
    throw error;
  }
}

// formatBalances formats the input quantity as 123,456.78
export const formatBalances = (amount: string | number): string => {
  const parsed = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(parsed)) return "0";

  return parsed.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
