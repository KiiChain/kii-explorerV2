import { ethers } from "ethers";
import { setupKeplr } from "./chain-config";

export function getWeb3Provider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

interface SwitchNetworkError extends Error {
  code: number;
}

export async function getMultiNetworkBalance(address: string) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x538" }],
      });
    } catch (switchError) {
      const error = switchError as SwitchNetworkError;

      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x538",
              chainName: "Kii-Testnet",
              rpcUrls: [
                "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com",
              ],
              nativeCurrency: {
                name: "KII",
                symbol: "KII",
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.kiiscan.com"],
            },
          ],
        });
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
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
    // Continuar con la configuración EVM
    return await getWeb3Provider();
  } catch (error) {
    console.error("Error initializing wallet:", error);
    throw error;
  }
}
