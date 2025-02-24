import { ethers } from "ethers";
import { setupKeplr } from "./chain-config";

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  isMetaMask?: boolean;
}

export function getWeb3Provider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  return new ethers.BrowserProvider(
    window.ethereum as unknown as ethers.Eip1193Provider
  );
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
      const provider = window.ethereum as unknown as EthereumProvider;
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x538" }],
      });
    } catch (switchError) {
      const error = switchError as SwitchNetworkError;

      if (error.code === 4902) {
        const provider = window.ethereum as unknown as EthereumProvider;
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x538",
              chainName: "Kii Chain Testnet",
              rpcUrls: [
                "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com",
              ],
              nativeCurrency: {
                name: "KII",
                symbol: "KII",
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.kiiscan.com"],
              iconUrls: [
                "https://raw.githubusercontent.com/KiiChain/testnets/refs/heads/main/testnet_oro/assets/coin_256_256.png",
              ],
            },
          ],
        });
      }
    }

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
