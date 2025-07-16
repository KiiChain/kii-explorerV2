import { getDistributionPrecompileEthersV6Contract } from "@kiichain/kiijs-evm";
import { ethers } from "ethers";
import { WalletClient } from "viem";

// WithdrawDelegatorRewards withdraws the Staking rewards from an specific Validator
export async function WithdrawDelegatorRewards(
  validatorAddr: string,
  walletClient: WalletClient
) {
  try {
    if (!walletClient) throw new Error("Wallet not connected");

    const provider = new ethers.BrowserProvider(walletClient.transport);
    const signer = await provider.getSigner();
    const address = signer.address;
    const distPrecompile = getDistributionPrecompileEthersV6Contract(signer);

    const tx = await distPrecompile.withdrawDelegatorRewards(
      address,
      validatorAddr
    );

    return await tx.wait();
  } catch (error) {
    console.error("Error trying to withdraw the staking reward:", error);
    throw error;
  }
}

// WithdrawAllRewards withdraws all Staking rewards
export async function WithdrawAllRewards(walletClient: WalletClient) {
  try {
    if (!walletClient) throw new Error("Wallet not connected");

    const provider = new ethers.BrowserProvider(walletClient.transport);
    const signer = await provider.getSigner();
    const address = signer.address;
    const distPrecompile = getDistributionPrecompileEthersV6Contract(signer);

    // SAFE_MAX_VAL is the safe amount of delegations to iterate, values higher than this will return gas error
    // this means users only claim rewards for their first 50 delegations using this button
    // other rewards must be claim manually
    const SAFE_MAX_VAL = 50;
    const tx = await distPrecompile.claimRewards(address, SAFE_MAX_VAL);

    return await tx.wait();
  } catch (error) {
    console.error("Error trying to withdraw all staking reward:", error);
    throw error;
  }
}
