"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  LightModeIcon,
  WalletIcon,
  DarkModeIcon,
} from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme } from "@/theme";
import { getWeb3Provider, getMultiNetworkBalance } from "@/lib/web3";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

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

interface SwitchNetworkError extends Error {
  code: number;
}

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();
  const { account, setAccount, setSession } = useWallet();
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowWalletSelector(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  chainName: "Kii Chain Testnet",
                  nativeCurrency: {
                    name: "KII",
                    symbol: "KII",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://json-rpc.dos.sentry.testnet.v3.kiivalidator.com/",
                  ],
                  blockExplorerUrls: ["https://testnet.kiiscan.com"],
                  iconUrls: [
                    "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
                  ],
                },
              ],
            });
          } else {
            throw error;
          }
        }

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
      const chainInfo = {
        chainId: "kiichain",
        chainName: "KiiChain Testnet Oro",
        rpc: "https://rpc.uno.sentry.testnet.v3.kiivalidator.com",
        rest: "https://lcd.uno.sentry.testnet.v3.kiivalidator.com",
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: "kii",
          bech32PrefixAccPub: "kiipub",
          bech32PrefixValAddr: "kiivaloper",
          bech32PrefixValPub: "kiivaloperpub",
          bech32PrefixConsAddr: "kiivalcons",
          bech32PrefixConsPub: "kiivalconspub",
        },
        currencies: [
          {
            coinDenom: "KII",
            coinMinimalDenom: "ukii",
            coinDecimals: 6,
            coinGeckoId: "kii",
            coinImageUrl:
              "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "KII",
            coinMinimalDenom: "ukii",
            coinDecimals: 6,
            coinGeckoId: "kii",
            coinImageUrl:
              "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
            gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 },
          },
        ],
        stakeCurrency: {
          coinDenom: "KII",
          coinMinimalDenom: "ukii",
          coinDecimals: 6,
          coinGeckoId: "kii",
          coinImageUrl:
            "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
        },
        chainSymbolImageUrl:
          "https://raw.githubusercontent.com/KiiChain/testnets/main/testnet_oro/assets/coin_256_256.png",
        features: ["ibc-transfer", "ibc-go", "eth-address-gen", "eth-key-sign"],
      };

      await window.keplr.experimentalSuggestChain(chainInfo);
      await window.keplr.enable("kiichain");
      const offlineSigner = window.keplr.getOfflineSigner("kiichain");
      const accounts = await offlineSigner.getAccounts();

      const message = "Connect to Kii Explorer";
      const signature = await window.keplr.signArbitrary(
        "kiichain",
        accounts[0].address,
        message
      );

      if (!signature) {
        throw new Error("Signature required to connect");
      }

      handleAccountConnection(accounts);
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
          `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${keplrAccount}`
        );
        const balanceData = (await balanceResponse.json()) as BalanceResponse;

        const stakingResponse = await fetch(
          `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${keplrAccount}`
        );
        const stakingData = (await stakingResponse.json()) as StakingResponse;

        const rewardsResponse = await fetch(
          `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${keplrAccount}/rewards`
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
        const formattedStaking = `${totalStaked / 1_000_000} KII`;

        const totalRewards =
          rewardsData.total?.reduce(
            (sum: number, reward: { denom: string; amount: string }) =>
              sum + parseInt(reward.amount),
            0
          ) || 0;
        const formattedRewards = `${totalRewards / 1_000_000} KII`;

        setSession({
          balance: `${formattedBalance} KII`,
          staking: formattedStaking,
          reward: formattedRewards,
          withdrawals: "0 KII",
          stakes: [],
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setAccount("");
      setSession(null);
    }
  };

  const confirm = async () => {
    setErrorMessage("");
    const key = (
      document.querySelector('input[type="text"]') as HTMLInputElement
    ).value;

    if (!key) {
      setErrorMessage("Please enter a value!");
      return;
    }

    const height = /^\d+$/;
    const txhash = /^[A-Z\d]{64}$/;
    const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;
    const evmAddr = /^0x[a-fA-F0-9]{40}$/;
    const evmTxHash = /^0x[a-fA-F0-9]{64}$/;

    if (height.test(key)) {
      router.push(`/blocksID/${key}`);
    } else if (txhash.test(key) || evmTxHash.test(key)) {
      router.push(`/transaction/${key}`);
    } else if (addr.test(key) || evmAddr.test(key)) {
      try {
        if (evmAddr.test(key)) {
          try {
            if (window.ethereum) {
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
                        chainName: "Kii Chain Testnet",
                        nativeCurrency: {
                          name: "KII",
                          symbol: "KII",
                          decimals: 18,
                        },
                        rpcUrls: ["https://rpc.testnet.kiichain.org"],
                      },
                    ],
                  });
                }
              }
            }

            const balance = await getMultiNetworkBalance(key);
            const walletData = {
              account: key,
              session: {
                balance: balance,
                staking: "0 KII",
                reward: "0 KII",
                withdrawals: "0 KII",
                stakes: [],
              },
            };
            localStorage.setItem("walletSession", JSON.stringify(walletData));
          } catch (error) {
            console.error("Error fetching wallet data:", error);
            const walletData = {
              account: key,
              session: {
                balance: "0",
                staking: "0 KII",
                reward: "0 KII",
                withdrawals: "0 KII",
                stakes: [],
              },
            };
            localStorage.setItem("walletSession", JSON.stringify(walletData));
          }
          router.push(`/account/${key}`);
        } else {
          const [balanceResponse, stakingResponse, rewardsResponse] =
            await Promise.all([
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/balances/${key}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/delegations/${key}`
              ),
              fetch(
                `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/delegators/${key}/rewards`
              ),
            ]);

          const balanceData = (await balanceResponse.json()) as BalanceResponse;
          const stakingData = (await stakingResponse.json()) as StakingResponse;
          const rewardsData = (await rewardsResponse.json()) as RewardsResponse;

          const balance =
            balanceData.balances.find((b) => b.denom === "ukii")?.amount || "0";
          const formattedBalance = (parseInt(balance) / 1_000_000).toString();

          const totalStaked =
            stakingData.delegation_responses?.reduce(
              (sum, del) => sum + parseInt(del.balance.amount),
              0
            ) || 0;
          const formattedStaking = (totalStaked / 1_000_000).toString();

          const totalRewards =
            rewardsData.total?.find((r) => r.denom === "ukii")?.amount || "0";
          const formattedRewards = (
            parseInt(totalRewards) / 1_000_000
          ).toString();

          const walletData = {
            account: key,
            session: {
              balance: formattedBalance,
              staking: `${formattedStaking} KII`,
              reward: `${formattedRewards} KII`,
              withdrawals: "0 KII",
              stakes:
                stakingData.delegation_responses?.map((del) => ({
                  validator: del.delegation.validator_address,
                  amount:
                    (parseInt(del.balance.amount) / 1_000_000).toString() +
                    " KII",
                  rewards: "0 KII",
                })) || [],
            },
          };

          localStorage.setItem("walletSession", JSON.stringify(walletData));
          router.push(`/account/${key}`);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        router.push(`/account/${key}`);
      }
    } else {
      setErrorMessage("The input not recognized");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      confirm();
    }
  };

  return (
    <div className="flex justify-between items-center w-full relative">
      <div className="flex-1">
        <div className="relative w-3/4">
          <input
            type="text"
            placeholder="Search by Address / Txn Hash / Block"
            className="w-full pl-10 pr-4 py-2 rounded-lg shadow-lg"
            onKeyPress={handleKeyPress}
            style={{
              backgroundColor: theme.boxColor,
              color: theme.primaryTextColor,
            }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <SearchIcon style={{ color: theme.secondaryTextColor }} />
          </div>
          {errorMessage && (
            <div className="absolute mt-1 text-red-500 text-sm">
              {errorMessage}
            </div>
          )}
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
          ref={buttonRef}
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
            ref={selectorRef}
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
