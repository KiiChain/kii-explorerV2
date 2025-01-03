"use client";

import React, { useState } from "react";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { WalletIcon } from "@/components/ui/icons";

export function FaucetDashboard() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <div className="p-6 bg-[#05000F]">
      <UptimeHeader />

      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-[#231C32] p-16 rounded-lg shadow-lg w-full max-w-xl">
          <h1 className="text-4xl font-bold text-white mb-6">
            Testnet Oro Faucet
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl text-white mb-4">
                How to use KiiChain&apos;s faucet?
              </h2>
              <ol className="list-decimal list-inside text-[#FFFFFF] space-y-2 ml-4">
                <li>
                  Set up your testnet wallet{" "}
                  <a href="#" className="text-[#00F9A6]">
                    here
                  </a>
                  .
                </li>
                <li>Insert your wallet address.</li>
                <li>Claim your KII.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-white mb-2">
                  <WalletIcon className="w-5 h-5 mr-2" />
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Wallet Address"
                  className="w-full px-4 py-3 bg-[#05000F] rounded-lg text-[#F3F5FB4D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D2AAFA]"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>

              <button
                className="w-full py-3 bg-gradient-to-r from-[#D2AAFA] to-[#A770EF] text-[#231C32] text-left font-bold rounded-lg hover:opacity-90 transition-opacity pl-4"
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
