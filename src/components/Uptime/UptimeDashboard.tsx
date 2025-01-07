"use client";

import React, { useState, useEffect } from "react";
import { UptimeHeader } from "./UptimeHeader";
import { useTheme } from "@/context/ThemeContext";

interface Validator {
  id: number;
  name: string;
  uptime: string;
  lastJailedTime: string;
  signedPrecommits: string;
  startHeight: number;
  tombstoned: boolean;
}

interface UptimeDashboardProps {
  validators: Validator[];
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredValidators = validators.filter((validator) =>
    validator.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <UptimeHeader />
      {isClient && (
        <>
          <div className="flex space-x-4 mb-4 pt-16">
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "overall" ? "bg-primary" : "bg-transparent"
              } hover:text-[${theme.accentColor}]`}
              onClick={() => setActiveTab("overall")}
              style={{
                backgroundColor:
                  activeTab === "overall" ? theme.boxColor : "transparent",
              }}
            >
              Overall
            </button>
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "blocks" ? "bg-primary" : "bg-transparent"
              } hover:text-[${theme.accentColor}]`}
              onClick={() => setActiveTab("blocks")}
              style={{
                backgroundColor:
                  activeTab === "blocks" ? theme.boxColor : "transparent",
              }}
            >
              Blocks
            </button>
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "customize" ? "bg-primary" : "bg-transparent"
              } hover:text-[${theme.accentColor}]`}
              onClick={() => setActiveTab("customize")}
              style={{
                backgroundColor:
                  activeTab === "customize" ? theme.boxColor : "transparent",
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
                placeholder="Keywords to Filter Validators"

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
            {filteredValidators.map((validator, index) => (
              <div
                key={validator.id}
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
                  {validator.name}
                </div>
                <div style={{ color: "green" }}>{validator.uptime}</div>
                <div style={{ color: theme.secondaryTextColor }}>
                  {validator.lastJailedTime}
                </div>
                <div style={{ color: theme.secondaryTextColor }}>
                  {validator.signedPrecommits}
                </div>
                <div style={{ color: theme.secondaryTextColor }}>
                  {validator.startHeight}
                </div>
                <div style={{ color: theme.secondaryTextColor }}>
                  {validator.tombstoned ? "True" : "False"}
                </div>
              </div>
            ))}

            <div
              className="pt-8 pl-16"
              style={{ color: theme.secondaryTextColor }}
            >
              Minimum Uptime per Window:{" "}
              <span style={{ color: theme.accentColor }}>50%</span>

            </div>
          </div>
        </>
      )}
    </div>
  );
};
