"use client";

import React from "react";
import {
  SearchIcon,
  LightModeIcon,
  WalletIcon,
  DarkModeIcon,
} from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme } from "@/theme";
import { getWeb3Provider } from "@/lib/web3";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();
  const { account, setAccount, setSession } = useWallet();

  const handleConnectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!Array.isArray(accounts) || accounts.length === 0) {
        return;
      }

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x538" }],
        });
      } catch (switchError: unknown) {
        if (switchError instanceof Error && "code" in switchError) {
          const errorCode = (switchError as { code: number }).code;
          if (errorCode === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x538",
                    chainName: "Kii Chain",
                    nativeCurrency: {
                      name: "KII",
                      symbol: "KII",
                      decimals: 18,
                    },
                    rpcUrls: ["https://rpc.kiichain.net"],
                    blockExplorerUrls: ["https://explorer.kiichain.net"],
                  },
                ],
              });
            } catch {
              return;
            }
          } else {
            return;
          }
        }
      }

      const provider = getWeb3Provider();
      const account = accounts[0];
      setAccount(account);

      try {
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        setSession({
          balance: formattedBalance,
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      } catch {
        setSession({
          balance: "0",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      }
    } catch {
      return;
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1">
        <div className="relative w-3/4">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg shadow-lg"
            style={{
              backgroundColor: theme.boxColor,
              color: theme.primaryTextColor,
            }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <SearchIcon style={{ color: theme.secondaryTextColor }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2" onClick={toggleTheme}>
          {theme === darkTheme ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.33341 0.666504L4.00008 4.6665L6.66675 0.666504"
              stroke="#D2AAFA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ color: theme.primaryTextColor }}>
            <b>KiiChain Oro</b>
          </span>
        </button>
        <button
          className="p-2 rounded-lg shadow-lg flex items-center gap-2"
          style={{
            backgroundColor: theme.boxColor,
            color: theme.primaryTextColor,
          }}
          onClick={handleConnectWallet}
        >
          <WalletIcon style={{ color: theme.secondaryTextColor }} />
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
