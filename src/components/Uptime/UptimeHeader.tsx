"use client";

import React, { useState } from "react";
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

interface BalanceResponse {
  balances: Array<{
    denom: string;
    amount: string;
  }>;
}

interface StakingResponse {
  delegation_responses: Array<{
    delegation: {
      validator_address: string;
    };
    balance: {
      amount: string;
    };
  }>;
}

interface RewardsResponse {
  total: Array<{
    denom: string;
    amount: string;
  }>;
}

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();
  const { account, setAccount, setSession } = useWallet();
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const handleMetaMaskConnect = async () => {
    setShowWalletSelector(false);
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (Array.isArray(accounts) && accounts.length > 0) {
        const account = accounts[0];

        const message = ethers.encodeBytes32String("Connect to Kii Explorer");

        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, account],
        });

        if (!signature) {
          throw new Error("Signature required to connect");
        }

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x538" }],
        });

        setAccount(account);

        const provider = getWeb3Provider();
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        setSession({
          balance: formattedBalance,
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setAccount("");
      setSession(null);
    }
  };

  const handleKeplrConnect = async () => {
    setShowWalletSelector(false);
    if (!window.keplr) {
      alert("Please install Keplr!");
      return;
    }

    try {
      const chainId = "kiichain3";
      try {
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();

        const message = "Connect to Kii Explorer";
        const signature = await window.keplr.signArbitrary(
          chainId,
          accounts[0].address,
          message
        );

        if (!signature) {
          throw new Error("Signature required to connect");
        }

        handleAccountConnection(accounts);
      } catch {
        const testnetChainId = "kiitestnet-1";
        await window.keplr.enable(testnetChainId);
        const offlineSigner = window.keplr.getOfflineSigner(testnetChainId);
        const accounts = await offlineSigner.getAccounts();

        const message = "Connect to Kii Explorer";
        const signature = await window.keplr.signArbitrary(
          testnetChainId,
          accounts[0].address,
          message
        );

        if (!signature) {
          throw new Error("Signature required to connect");
        }

        handleAccountConnection(accounts);
      }
    } catch (error) {
      console.error("Error connecting to Keplr:", error);
      setAccount("");
      setSession(null);
    }
  };

  const handleDisconnect = () => {
    setAccount("");
    setSession(null);
    setShowWalletSelector(false);
  };

  const handleAccountConnection = async (
    accounts: Array<{ address: string }>
  ) => {
    if (accounts.length > 0) {
      const keplrAccount = accounts[0].address;
      setAccount(keplrAccount);

      try {
        const balanceResponse = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${keplrAccount}`
        );
        const balanceData = (await balanceResponse.json()) as BalanceResponse;

        const stakingResponse = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${keplrAccount}`
        );
        const stakingData = (await stakingResponse.json()) as StakingResponse;

        const rewardsResponse = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${keplrAccount}/rewards`
        );
        const rewardsData = (await rewardsResponse.json()) as RewardsResponse;

        const balance =
          balanceData.balances.find(
            (b: { denom: string; amount: string }) => b.denom === "ukii"
          )?.amount || "0";
        const formattedBalance = (parseInt(balance) / 1_000_000).toString();

        const totalStaked =
          stakingData.delegation_responses?.reduce(
            (sum: number, del: { balance: { amount: string } }) =>
              sum + parseInt(del.balance.amount),
            0
          ) || 0;
        const formattedStaking = (totalStaked / 1_000_000).toString();

        const totalRewards =
          rewardsData.total?.find(
            (r: { denom: string; amount: string }) => r.denom === "ukii"
          )?.amount || "0";
        const formattedRewards = (
          parseInt(totalRewards) / 1_000_000
        ).toString();

        setSession({
          balance: formattedBalance,
          staking: `${formattedStaking} KII`,
          reward: `${formattedRewards} KII`,
          withdrawals: "0 KII",
          stakes:
            stakingData.delegation_responses?.map(
              (del: {
                delegation: { validator_address: string };
                balance: { amount: string };
              }) => ({
                validator: del.delegation.validator_address,
                amount:
                  (parseInt(del.balance.amount) / 1_000_000).toString() +
                  " KII",
                rewards: "0 KII",
              })
            ) || [],
        });
      } catch (error) {
        console.error("Error getting Keplr data:", error);
        setSession({
          balance: "0",
          staking: "0 KII",
          reward: "0 KII",
          withdrawals: "0 KII",
          stakes: [],
        });
      }
    }
  };

  return (
    <div className="flex justify-between items-center w-full relative">
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
          onClick={() => setShowWalletSelector(true)}
        >
          <WalletIcon style={{ color: theme.secondaryTextColor }} />
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>

        {showWalletSelector && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg"
            style={{
              backgroundColor: theme.boxColor,
              top: "100%",
              zIndex: 50,
            }}
          >
            {!account ? (
              <>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-white"
                  style={{ color: theme.primaryTextColor }}
                  onClick={handleMetaMaskConnect}
                >
                  MetaMask
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-white"
                  style={{ color: theme.primaryTextColor }}
                  onClick={handleKeplrConnect}
                >
                  Keplr
                </button>
              </>
            ) : (
              <button
                className="w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-white"
                style={{ color: theme.primaryTextColor }}
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
