"use client";

import React, { useState, useEffect } from "react";
import { UptimeHeader } from "./UptimeHeader";

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
    <div className="p-6">
      <UptimeHeader />
      {isClient && (
        <>
          <div className="flex space-x-4 mb-4 pt-16">
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "overall" ? "bg-[#231C32]" : "bg-transparent"
              } hover:text-[#D2AAFA]`}
              onClick={() => setActiveTab("overall")}
            >
              Overall
            </button>
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "blocks" ? "bg-[#231C32]" : "bg-transparent"
              } hover:text-[#D2AAFA]`}
              onClick={() => setActiveTab("blocks")}
            >
              Blocks
            </button>
            <button
              className={`text-white px-4 py-2 rounded ${
                activeTab === "customize" ? "bg-[#231C32]" : "bg-transparent"
              } hover:text-[#D2AAFA]`}
              onClick={() => setActiveTab("customize")}
            >
              Customize
            </button>
          </div>

          <div className="space-y-2 bg-[#231C32] mt-16 p-16 rounded-lg">
            <input
              type="text"
              placeholder="Keywords to Filter Validators"
              className="w-full mb-4 px-4 py-2 bg-[#05000F] rounded-lg text-white placeholder-gray-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="grid grid-cols-6 gap-4 py-2 text-white font-semibold px-8">
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
                className="grid grid-cols-6 gap-4 py-4 px-8 items-center bg-[#05000F] rounded-lg border border-[#2D4BA0] hover:border-blue-400 transition-colors"
              >
                <div className="text-white flex items-center gap-4">
                  <span className="text-2xl font-semibold text-[#D2AAFA]">
                    {index + 1}
                  </span>
                  {validator.name}
                </div>
                <div className="text-green-400">{validator.uptime}</div>
                <div className="text-[#F3F5FB]">{validator.lastJailedTime}</div>
                <div className="text-[#F3F5FB]">
                  {validator.signedPrecommits}
                </div>
                <div className="text-[#F3F5FB]">{validator.startHeight}</div>
                <div className="text-[#F3F5FB]">
                  {validator.tombstoned ? "True" : "False"}
                </div>
              </div>
            ))}
            <div className="text-gray-400 pt-8 pl-16">
              Minimum Uptime per Window:{" "}
              <span className="text-pink-400">50%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
