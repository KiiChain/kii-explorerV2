"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

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
  // ... más validadores
];

export function Staking() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Validators Table */}
      <Card>
        <div className="flex items-center gap-4 p-4">
          <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
            Popular
          </button>
          <button className="rounded-md px-3 py-1 text-sm">Active</button>
          <button className="rounded-md px-3 py-1 text-sm">Inactive</button>
        </div>
        <div className="border-t">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Rank</th>
                <th className="p-4 text-left font-medium">Validator</th>
                <th className="p-4 text-left font-medium">Voting Power</th>
                <th className="p-4 text-left font-medium">24h changes</th>
                <th className="p-4 text-left font-medium">Commission</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {validators.map((validator) => (
                <tr key={validator.rank} className="border-b">
                  <td className="p-4">{validator.rank}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{validator.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {validator.url}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{validator.votingPower.amount}</span>
                      <span className="text-sm text-muted-foreground">
                        {validator.votingPower.percentage}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{validator.votingPower.percentage}</td>
                  <td className="p-4">{validator.commission}</td>
                  <td className="p-4">
                    <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
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
