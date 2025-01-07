"use client";

import React from "react";
import { SearchIcon, LightModeIcon, WalletIcon } from "@/components/ui/icons";

export function UptimeHeader() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1">
        <div className="relative w-3/4">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-[#231C32] rounded-lg text-white placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <SearchIcon className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2">
          <LightModeIcon className="text-gray-400" />
        </button>
        <button className="flex items-center gap-2 bg-[#231C32] px-4 py-2 rounded-lg">
          <span className="text-white">KiiChain Oro</span>
        </button>
        <button className="p-2 bg-[#231C32] rounded-lg">
          <WalletIcon className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
