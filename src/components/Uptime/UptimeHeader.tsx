"use client";

import React, { useState } from "react";
import { SearchIcon, LightModeIcon, DarkModeIcon } from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme } from "@/theme";
import { useRouter } from "next/navigation";
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const confirm = async () => {
    setErrorMessage("");

    if (!searchKey) {
      setErrorMessage("Please enter a value!");
      return;
    }

    const height = /^\d+$/;
    const txhash = /^[A-Z\d]{64}$/;
    const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;
    const evmAddr = /^0x[a-fA-F0-9]{40}$/;
    const evmTxHash = /^0x[a-fA-F0-9]{64}$/;

    if (height.test(searchKey)) {
      router.push(`/blocksID/${searchKey}`);
    } else if (txhash.test(searchKey) || evmTxHash.test(searchKey)) {
      router.push(`/transaction/${searchKey}`);
    } else if (addr.test(searchKey) || evmAddr.test(searchKey)) {
      router.push(`/account/${searchKey}`);
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
            onChange={(e) => setSearchKey(e.target.value)}
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
        <WagmiConnectButton />
      </div>
    </div>
  );
}
