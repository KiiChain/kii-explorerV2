"use client";

import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useSupplyData } from "@/services/queries/supply";

export function SupplyDashboard() {
  const { theme } = useTheme();
  const { data: supplies = [] } = useSupplyData();

  return (
    <div className="px-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="mt-20">
        <h2
          className="text-base font-semibold mb-4"
          style={{ color: theme.primaryTextColor }}
        >
          Bank Supply
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-8 mt-8 w-full">
          {supplies.map((supply) => (
            <div key={supply.id} className="flex flex-col items-center">
              <Card
                className="px-2 pt-4 pb-2 border-0 rounded-lg shadow-lg w-40 h-52"
                style={{ backgroundColor: theme.boxColor }}
              >
                <div className="h-full w-full bg-transparent relative rounded-lg overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full rounded-t-lg"
                    style={{
                      height: supply.percentage,
                      background: `linear-gradient(to top, ${theme.accentColor}, #D2AAFA, #C6C7F8)`,
                    }}
                  ></div>
                </div>
              </Card>
              <div
                className="text-sm truncate mt-2 text-center"
                style={{ maxWidth: "90%", color: theme.primaryTextColor }}
              >
                {supply.address.slice(0, supply.address.length / 2)}...
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-6 shadow-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="text-left text-base"
                  style={{ color: theme.secondaryTextColor }}
                >
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">% of supply</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((supply) => (
                  <tr
                    key={supply.id}
                    className="text-xs"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderTop: `1px solid ${theme.accentColor}`,
                    }}
                  >
                    <td
                      className="py-4 px-4"
                      style={{ color: theme.accentColor }}
                    >
                      {supply.address}
                    </td>
                    <td
                      className="py-4 px-4"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {supply.amount}
                    </td>
                    <td
                      className="py-4 px-4"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {supply.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
