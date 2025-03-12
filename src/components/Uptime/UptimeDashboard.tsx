"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSigningInfos, calculateUptime } from "@/services/queries/uptime";

interface Validator {
  operatorAddress: string;
  moniker: string;
  status: string;
  tokens: string;
  commission: string;
  website: string;
  jailed: boolean;
  uptime: number;
  selfBonded?: string;
}

interface UptimeDashboardProps {
  validators: Validator[];
}

export const UptimeDashboard: React.FC<UptimeDashboardProps> = ({
  validators = [],
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "overall" | "blocks" | "customize"
  >("overall");
  const [filter, setFilter] = useState("");
  const [animateBars, setAnimateBars] = useState(false);

  const { data: signingInfos = {} } = useSigningInfos();

  const displayedValidators = validators
    .map((validator) => ({
      ...validator,
      uptime: calculateUptime(validator, signingInfos),
    }))
    .filter((validator) => {
      const moniker = validator.moniker || "";
      return moniker.toLowerCase().includes(filter.toLowerCase());
    });

  const getGridCols = (validatorsCount: number) => {
    if (validatorsCount <= 3) return "grid-cols-1 md:grid-cols-3";
    if (validatorsCount <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-3 md:grid-cols-4";
  };

  const handleTabClick = (tab: "overall" | "blocks" | "customize") => {
    setActiveTab(tab);
    if (tab === "blocks") {
      setAnimateBars(true);
    } else {
      setAnimateBars(false);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="flex gap-6 mt-12">
        <button
          style={{
            backgroundColor:
              activeTab === "overall" ? theme.boxColor : "transparent",
            color:
              activeTab === "overall"
                ? theme.accentColor
                : theme.secondaryTextColor,
          }}
          className="px-4 py-2 rounded-lg"
          onClick={() => handleTabClick("overall")}
        >
          Overall
        </button>
        <button
          style={{
            backgroundColor:
              activeTab === "blocks" ? theme.boxColor : "transparent",
            color:
              activeTab === "blocks"
                ? theme.accentColor
                : theme.secondaryTextColor,
          }}
          className="px-4 py-2 rounded-lg"
          onClick={() => handleTabClick("blocks")}
        >
          Blocks
        </button>
      </div>

      {activeTab === "overall" && (
        <div className="mt-7">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search validator"
              className="p-2 rounded-lg"
              style={{
                backgroundColor: theme.boxColor,
                color: theme.primaryTextColor,
              }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div
            className={`grid ${getGridCols(displayedValidators.length)} gap-4`}
          >
            {displayedValidators.map((validator, index) => (
              <div
                key={
                  validator.operatorAddress || `${validator.moniker}-${index}`
                }
                className="mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {validator.moniker}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    {Math.round(validator.uptime)}%
                  </span>
                </div>
                <div className="flex h-8 gap-1 bg-gray-800 rounded overflow-hidden justify-end flex-row-reverse">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={`${
                        validator.operatorAddress || validator.moniker
                      }-${i}`}
                      className={`flex-1 rounded ${
                        animateBars ? "animate-fill" : ""
                      }`}
                      style={{
                        backgroundColor: theme.accentColor,
                        animationDelay: `${i * 0.1}s`,
                        transition: "background-color 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "blocks" && (
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
            className={`grid ${getGridCols(displayedValidators.length)} gap-4`}
          >
            {displayedValidators.map((validator, index) => (
              <div
                key={
                  validator.operatorAddress || `${validator.moniker}-${index}`
                }
                className="mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    {validator.moniker}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    {Math.round(validator.uptime)}%
                  </span>
                </div>
                <div className="flex h-8 gap-1 bg-gray-800 rounded overflow-hidden justify-end flex-row-reverse">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={`${
                        validator.operatorAddress || validator.moniker
                      }-${i}`}
                      className={`flex-1 rounded ${
                        animateBars ? "animate-fill" : ""
                      }`}
                      style={{
                        backgroundColor: theme.accentColor,
                        animationDelay: `${i * 0.1}s`,
                        transition: "background-color 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <div
          className="space-y-2 mt-9 p-8 rounded-lg"
          style={{ backgroundColor: theme.bgColor }}
        >
          <div
            className="mb-8 p-4 rounded-lg px-10 py-5"
            style={{ backgroundColor: theme.boxColor }}
          >
            <h2
              className="text-title font-semibold mb-4"
              style={{ color: theme.primaryTextColor }}
            >
              My Validators
            </h2>
            <button
              className="flex items-center gap-2 text-sm"
              style={{ color: theme.primaryTextColor }}
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6668 4.02197H10.6668V3.35531C10.6668 3.00168 10.5264 2.66255 10.2763 2.4125C10.0263 2.16245 9.68712 2.02197 9.3335 2.02197H6.66683C6.31321 2.02197 5.97407 2.16245 5.72402 2.4125C5.47397 2.66255 5.3335 3.00168 5.3335 3.35531V4.02197H3.3335C2.80306 4.02197 2.29436 4.23269 1.91928 4.60776C1.54421 4.98283 1.3335 5.49154 1.3335 6.02197V12.022C1.3335 12.5524 1.54421 13.0611 1.91928 13.4362C2.29436 13.8113 2.80306 14.022 3.3335 14.022H12.6668C13.1973 14.022 13.706 13.8113 14.081 13.4362C14.4561 13.0611 14.6668 12.5524 14.6668 12.022V6.02197C14.6668 5.49154 14.4561 4.98283 14.081 4.60776C13.706 4.23269 13.1973 4.02197 12.6668 4.02197ZM6.66683 3.35531H9.3335V4.02197H6.66683V3.35531ZM13.3335 12.022C13.3335 12.1988 13.2633 12.3684 13.1382 12.4934C13.0132 12.6184 12.8436 12.6886 12.6668 12.6886H3.3335C3.15668 12.6886 2.98712 12.6184 2.86209 12.4934C2.73707 12.3684 2.66683 12.1988 2.66683 12.022V8.28197L5.78683 9.35531C5.85762 9.36491 5.92938 9.36491 6.00016 9.35531H10.0002C10.0725 9.35397 10.1442 9.34275 10.2135 9.32197L13.3335 8.28197V12.022ZM13.3335 6.87531L9.8935 8.02197H6.10683L2.66683 6.87531V6.02197C2.66683 5.84516 2.73707 5.67559 2.86209 5.55057C2.98712 5.42554 3.15668 5.35531 3.3335 5.35531H12.6668C12.8436 5.35531 13.0132 5.42554 13.1382 5.55057C13.2633 5.67559 13.3335 5.84516 13.3335 6.02197V6.87531Z"
                  fill="#D2AAFA"
                />
              </svg>
              Add Validators You Want To Monitor
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4 py-2 text-sm p-4">
            <div style={{ color: theme.primaryTextColor }}>No</div>
            <div style={{ color: theme.primaryTextColor }}>Blockchain</div>
            <div style={{ color: theme.primaryTextColor }}>Validators</div>
            <div style={{ color: theme.primaryTextColor }}>Signed Blocks</div>
            <div style={{ color: theme.primaryTextColor }}>
              Last Jailed Time
            </div>
            <div style={{ color: theme.primaryTextColor }}>Tombstoned</div>
            <div style={{ color: theme.primaryTextColor }}>Missing Blocks</div>
          </div>

          <div className="flex justify-center py-8">
            <button
              className="px-6 py-2 rounded-lg text-base opacity-50 cursor-not-allowed"
              style={{
                backgroundColor: theme.boxColor,
                color: theme.accentColor,
              }}
              disabled={true}
            >
              Add Validators
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fill {
          animation: fill 2s forwards;
        }

        @keyframes fill {
          from {
            background-color: transparent;
          }
          to {
            background-color: ${theme.accentColor};
          }
        }
      `}</style>
    </div>
  );
};
