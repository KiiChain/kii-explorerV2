"use client";

import React, { useState } from "react";
import { WalletIcon } from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";

export function FaucetDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          style={{ backgroundColor: theme.boxColor }}
          className="p-20 rounded-lg shadow-lg w-full max-w-xl"
        >
          <h1
            style={{ color: theme.primaryTextColor }}
            className="text-4xl font-bold mb-6"
          >
            Testnet Oro Faucet
          </h1>

          <div className="space-y-6">
            <div>
              <h2
                style={{ color: theme.primaryTextColor }}
                className="text-xl mb-4"
              >
                How to use KiiChain&apos;s faucet?
              </h2>
              <ol
                style={{ color: theme.primaryTextColor }}
                className="list-decimal list-inside space-y-2 ml-4"
              >
                <li>
                  Set up your testnet wallet{" "}
                  <a
                    href="#"
                    style={{
                      color: theme.tertiaryTextColor,
                      fontWeight: "bold",
                    }}
                  >
                    here.
                  </a>
                </li>
                <li>Insert your wallet address.</li>
                <li>Claim your KII.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  style={{ color: theme.primaryTextColor }}
                  className="flex items-center mb-2"
                >
                  <WalletIcon className="w-5 h-5 mr-2" />
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Wallet Address"
                  style={{
                    backgroundColor: theme.faucetColor,
                    color: theme.faucetTextColor,
                  }}
                  className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 shadow-lg"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>

              <button
                style={{
                  backgroundColor: theme.faucetColor2,
                  color: theme.faucetTextColor2,
                }}
                className="w-full py-3 text-left font-bold rounded-lg hover:opacity-90 transition-opacity pl-4 shadow-lg"
                onClick={() => {}}
              >
                Claim your tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
