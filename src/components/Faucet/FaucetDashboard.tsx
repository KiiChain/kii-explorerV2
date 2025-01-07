"use client";

import React, { useState } from "react";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { WalletIcon } from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";

export function FaucetDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const { theme } = useTheme();

  return (
    <div className={`p-6 bg-[${theme.bgColor}]`}>
      <UptimeHeader />

      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          className={`bg-[${theme.boxColor}] p-20 rounded-lg shadow-lg w-full max-w-xl`}
        >
          <h1
            className={`text-4xl font-bold text-[${theme.primaryTextColor}] mb-6`}
          >
            Testnet Oro Faucet
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className={`text-xl text-[${theme.primaryTextColor}] mb-4`}>
                How to use KiiChain&apos;s faucet?
              </h2>
              <ol
                className={`list-decimal list-inside text-[${theme.primaryTextColor}] space-y-2 ml-4`}
              >
                <li>
                  Set up your testnet wallet{" "}
                  <a href="#" style={{ color: theme.tertiaryTextColor }}>
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
                  className={`flex items-center text-[${theme.primaryTextColor}] mb-2`}
                >
                  <WalletIcon className="w-5 h-5 mr-2" />
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Wallet Address"
                  style={{ backgroundColor: theme.bgColor }}
                  className={`w-full px-4 py-3 rounded-lg text-[${theme.secondaryTextColor}] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${theme.accentColor}]`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>

              <button
                className={`w-full py-3 bg-[${theme.accentColor}] text-left font-bold rounded-lg hover:opacity-90 transition-opacity pl-4`}
                style={{ color: theme.boxColor }}
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
