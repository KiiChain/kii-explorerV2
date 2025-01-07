"use client";

import React from "react";
import { SearchIcon, LightModeIcon, WalletIcon } from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1">
        <div className="relative w-3/4">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg"
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
          <LightModeIcon style={{ color: theme.secondaryTextColor }} />
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <span style={{ color: theme.primaryTextColor }}>KiiChain Oro</span>
        </button>
        <button
          className="p-2 rounded-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <WalletIcon style={{ color: theme.secondaryTextColor }} />
        </button>
      </div>
    </div>
  );
}
