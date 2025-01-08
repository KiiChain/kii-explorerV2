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

export function UptimeHeader() {
  const { theme, toggleTheme } = useTheme();

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
          className="p-2 rounded-lg shadow-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <WalletIcon style={{ color: theme.secondaryTextColor }} />
        </button>
      </div>
    </div>
  );
}
