import { ethers } from "ethers";

export const getWeb3Provider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // Configuración específica para Kii Chain
    const provider = new ethers.BrowserProvider(window.ethereum, {
      name: "Kii Chain",
      chainId: 1336, // 0x538 en decimal
    });

    return provider;
  }

  // Fallback a un provider HTTP si no hay wallet
  return new ethers.JsonRpcProvider("https://rpc.kiichain.net");
};
