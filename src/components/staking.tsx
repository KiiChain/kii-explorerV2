"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

interface StakingStats {
  value: string;
  label: string;
  tooltip?: string;
}

const stats: StakingStats[] = [
  {
    value: "0%",
    label: "Inflation",
  },
  {
    value: "21 Days",
    label: "Unbonding Time",
  },
  {
    value: "5%",
    label: "Double Sign Slashing",
  },
  {
    value: "1%",
    label: "Downtime Slashing",
  },
];

interface ValidatorInfo {
  rank: number;
  name: string;
  url: string;
  votingPower: {
    amount: string;
    percentage: string;
  };
  commission: string;
}

const validators: ValidatorInfo[] = [
  {
    rank: 1,
    name: "KiiAventador",
    url: "https://app.kiiglobal.io/",
    votingPower: {
      amount: "1000,00 KII",
      percentage: "33.33%",
    },
    commission: "10%",
  },
];

export function Staking() {
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col gap-6 p-6"
      style={{ backgroundColor: theme.bgColor }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-4"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="text-2xl font-semibold"
                style={{ color: theme.primaryTextColor }}
              >
                {stat.value}
              </span>
              <span
                className="text-sm"
                style={{ color: theme.secondaryTextColor }}
              >
                {stat.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ backgroundColor: theme.boxColor }}>
        <div className="flex items-center gap-4 p-4">
          <button
            className="rounded-md bg-primary px-3 py-1 text-sm"
            style={{ color: theme.primaryTextColor }}
          >
            Popular
          </button>
          <button
            className="rounded-md px-3 py-1 text-sm"
            style={{ color: theme.secondaryTextColor }}
          >
            Active
          </button>
          <button
            className="rounded-md px-3 py-1 text-sm"
            style={{ color: theme.secondaryTextColor }}
          >
            Inactive
          </button>
        </div>
        <div className="border-t" style={{ borderColor: theme.borderColor }}>
          <table className="w-full">
            <thead>
              <tr
                className="border-b"
                style={{ backgroundColor: theme.accentColor }}
              >
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Rank
                </th>
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Validator
                </th>
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Voting Power
                </th>
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  24h changes
                </th>
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Commission
                </th>
                <th
                  className="p-4 text-left font-medium"
                  style={{ color: theme.primaryTextColor }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {validators.map((validator) => (
                <tr
                  key={validator.rank}
                  className="border-b"
                  style={{ borderColor: theme.borderColor }}
                >
                  <td className="p-4" style={{ color: theme.primaryTextColor }}>
                    {validator.rank}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span style={{ color: theme.primaryTextColor }}>
                        {validator.name}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: theme.secondaryTextColor }}
                      >
                        {validator.url}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span style={{ color: theme.primaryTextColor }}>
                        {validator.votingPower.amount}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: theme.secondaryTextColor }}
                      >
                        {validator.votingPower.percentage}
                      </span>
                    </div>
                  </td>
                  <td className="p-4" style={{ color: theme.primaryTextColor }}>
                    {validator.votingPower.percentage}
                  </td>
                  <td className="p-4" style={{ color: theme.primaryTextColor }}>
                    {validator.commission}
                  </td>
                  <td className="p-4">
                    <button
                      className="rounded-md bg-primary px-4 py-2 text-sm"
                      style={{ color: theme.primaryTextColor }}
                    >
                      Create Stake
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
