import { ethers } from "ethers";

export const getWeb3Provider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum, {
      name: "Kii Chain",
      chainId: 1336,
    });

    return provider;
  }

  return new ethers.JsonRpcProvider("https://rpc.kiichain.net");
};
