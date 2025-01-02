"use client";

import React from "react";
import { LightModeIcon, WalletIcon } from "./ui/icons";

interface BlocksHeaderProps {
  activeTab: "blocks" | "transactions";
  onTabChange: (tab: "blocks" | "transactions") => void;
}

export function BlocksHeader({}: BlocksHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full mt-8 px-4">
      <div className="w-full max-w-3xl mb-4 md:mb-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-[#231C32] rounded-lg text-white placeholder-gray-400 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full justify-center md:justify-end">
        {/* Theme Toggle */}
        <button className="p-2">
          <LightModeIcon className="w-6 h-6 text-gray-400" />
        </button>

        <button className="flex items-center gap-2 bg-[#231C32] px-4 py-2 rounded-lg">
          <svg
            className="w-4 h-4 text-[#D2AAFA]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-white">KiiChain Oro</span>
        </button>

        <button className="p-2 bg-[#231C32] rounded-lg">
          <WalletIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
