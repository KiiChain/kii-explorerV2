"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BlocksHeader } from "@/components/headerDashboard";
import { useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
}

function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <Card className="bg-[#1A1A1A]/40 border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm xl:text-base font-normal text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl xl:text-3xl font-bold text-white">
          {value}
          {unit && (
            <span className="ml-1 text-xs xl:text-sm text-muted-foreground">
              ({unit})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );

  return (
    <div className="p-6 bg-[#05000F]">
      <div className="px-6">
        <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="bg-[#05000F] p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard title="KII Price" value="N/A" unit="TESTNET" />
          <StatCard title="Gas Price" value="2500" unit="Tekii" />
          <StatCard title="Transactions" value="333,422" />
          <StatCard title="Block Height" value="2,577,053" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          <StatCard title="Height" value="2,576,146" />
          <StatCard title="Validators" value="3" />
          <StatCard title="Supply" value="1,800,000,000" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          <StatCard title="Bonded Tokens" value="300,000" />
          <StatCard title="Inflation" value="0%" />
          <StatCard title="Community Pool" value="-" />
        </div>

        <Card className="bg-[#1A1A1A]/40 border-0 mt-6">
          <CardContent className="flex items-center p-6">
            <span className="text-muted-foreground text-base">
              Wallet not connected
            </span>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
          <Card className="bg-[#1A1A1A]/40 border-0">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-normal">
                Latest Blocks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Contenido de Latest Blocks */}
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A]/40 border-0">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <CardTitle className="text-xl font-normal">
                Latest transactions
              </CardTitle>
              <span className="text-base text-muted-foreground hover:text-white cursor-pointer">
                View All
              </span>
            </CardHeader>
            <CardContent className="p-6">
              {/* Contenido de Latest Transactions */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
