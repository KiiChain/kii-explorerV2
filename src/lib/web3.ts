import { ethers } from "ethers";
import { setupKeplr } from "./chain-config";

export function getWeb3Provider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  return new ethers.BrowserProvider(
    window.ethereum as unknown as ethers.Eip1193Provider
  );
}

export async function getMultiNetworkBalance(address: string) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(
      window.ethereum as unknown as ethers.Eip1193Provider
    );
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    return "0";
  }
}

export async function initializeWallet() {
  try {
    await setupKeplr();
    return await getWeb3Provider();
  } catch (error) {
    console.error("Error initializing wallet:", error);
    throw error;
  }
}
