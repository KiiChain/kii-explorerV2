"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Validator {
  operatorAddress: string;
  moniker: string;
  status: string;
  tokens: string;
  commission: string;
  website: string;
  jailed: boolean;
  uptime: number;
}

interface UptimeDashboardProps {
  validators: Validator[];
}

interface SigningInfo {
  address: string;
  missed_blocks_counter: string;
  index_offset: string;
  start_height: string;
}

export const UptimeDashboard: React.FC<UptimeDashboardProps> = ({
  validators,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "overall" | "blocks" | "customize"
  >("overall");
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState("");
  const [signingInfos, setSigningInfos] = useState<Record<string, SigningInfo>>(
    {}
  );

  const signedBlocksWindow = 1000;

  useEffect(() => {
    setIsClient(true);

    fetch(
      "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/slashing/v1beta1/signing_infos"
    )
      .then((response) => response.json())
      .then((data: { info: SigningInfo[] }) => {
        const infos = data.info.reduce(
          (acc: Record<string, SigningInfo>, info: SigningInfo) => {
            acc[info.address] = info;
            return acc;
          },
          {}
        );
        setSigningInfos(infos);
      });
  }, []);

  const calculateUptime = (validator: Validator) => {
    const signingInfo = signingInfos[validator.operatorAddress];
    if (!signingInfo) return 0;

    const missedBlocks = Number(signingInfo.missed_blocks_counter);
    return ((signedBlocksWindow - missedBlocks) / signedBlocksWindow) * 100;
  };

  const filteredValidators = validators
    .map((validator) => ({
      ...validator,
      uptime: calculateUptime(validator),
    }))
    .filter((validator) =>
      validator.moniker.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="px-6 pt-2">
      {isClient && (
        <>
          <div className="flex space-x-4 mb-4 pt-16">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "overall" ? "bg-primary" : "bg-transparent"
              }`}
              onClick={() => setActiveTab("overall")}
              style={{
                backgroundColor:
                  activeTab === "overall" ? theme.boxColor : "transparent",
                color: theme.accentColor,
              }}
            >
              Overall
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "blocks" ? "bg-primary" : "bg-transparent"
              }`}
              onClick={() => setActiveTab("blocks")}
              style={{
                backgroundColor:
                  activeTab === "blocks" ? theme.boxColor : "transparent",
                color: theme.accentColor,
              }}
            >
              Blocks
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "customize" ? "bg-primary" : "bg-transparent"
              }`}
              onClick={() => setActiveTab("customize")}
              style={{
                backgroundColor:
                  activeTab === "customize" ? theme.boxColor : "transparent",
                color: theme.accentColor,
              }}
            >
              Customize
            </button>
          </div>

          <div
            className="space-y-2 mt-9 p-8 rounded-lg"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div>
              <input
                type="text"
                placeholder="Keywords To Filter Validators"
                className="w-full mb-4 px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.secondaryTextColor,
                }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div
              className="grid grid-cols-6 gap-4 py-2 font-semibold px-8"
              style={{ color: theme.primaryTextColor }}
            >
              <div>Validator</div>
              <div>Uptime</div>
              <div>Last Jailed Time</div>
              <div>Signed Precommits</div>
              <div>Start Height</div>
              <div>Tombstoned</div>
            </div>
            {filteredValidators.map((validator, index) => {
              const signingInfo = signingInfos[validator.operatorAddress];
              console.log(
                `Validator: ${validator.operatorAddress}, Signing Info: ${signingInfo}`
              );
              return (
                <div
                  key={validator.operatorAddress}
                  className="grid grid-cols-6 gap-4 py-4 px-8 items-center rounded-lg border transition-colors"
                  style={{
                    backgroundColor: theme.bgColor,
                    borderColor: theme.borderColor,
                    color: theme.primaryTextColor,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-4xl font-semibold"
                      style={{ color: theme.accentColor }}
                    >
                      {index + 1}
                    </span>
                    {validator.moniker}
                  </div>
                  <div style={{ color: theme.tertiaryTextColor }}>
                    {validator.uptime.toFixed(2)}%
                  </div>
                  <div style={{ color: theme.secondaryTextColor }}></div>
                  <div style={{ color: theme.secondaryTextColor }}>
                    {signingInfo ? `${signingInfo.index_offset}%` : "0%"}
                  </div>
                  <div style={{ color: theme.secondaryTextColor }}>
                    {signingInfo ? signingInfo.start_height : "0"}
                  </div>
                  <div style={{ color: theme.secondaryTextColor }}>
                    {validator.jailed ? "True" : "False"}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
