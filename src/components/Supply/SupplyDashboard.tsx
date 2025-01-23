"use client";

import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

interface BankSupply {
  id: string;
  address: string;
  amount: string;
  percentage: string;
}

interface SupplyResponse {
  supply: {
    denom: string;
    amount: string;
  }[];
}

interface GenesisResponse {
  genesis: {
    app_state: {
      bank: {
        balances: {
          address: string;
          coins: {
            denom: string;
            amount: string;
          }[];
        }[];
      };
    };
  };
}

export function SupplyDashboard() {
  const { theme } = useTheme();
  const [supplies, setSupplies] = useState<BankSupply[]>([]);

  useEffect(() => {
    const fetchSupplyData = async () => {
      try {
        const supplyResponse = await fetch(
          "https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/bank/v1beta1/supply?pagination.limit=20&pagination.count_total=true"
        );
        const supplyData: SupplyResponse = await supplyResponse.json();

        const genesisResponse = await fetch(
          "https://rpc.uno.sentry.testnet.v3.kiivalidator.com/genesis"
        );
        const genesisData: GenesisResponse = await genesisResponse.json();

        const totalSupply = supplyData.supply.find(
          (s) => s.denom === "ukii"
        )?.amount;

        if (!totalSupply) return;

        const balances = genesisData.genesis.app_state.bank.balances
          .map((balance) => {
            const ukiiCoin = balance.coins.find(
              (coin) => coin.denom === "ukii"
            );
            if (!ukiiCoin) return null;

            const percentage = (
              (Number(ukiiCoin.amount) / Number(totalSupply)) *
              100
            ).toFixed(2);

            return {
              id: balance.address,
              address: balance.address,
              amount: ukiiCoin.amount,
              percentage: `${percentage}%`,
            };
          })
          .filter((b): b is BankSupply => b !== null)
          .sort((a, b) => Number(b.amount) - Number(a.amount));

        setSupplies(balances.slice(0, 20));
      } catch (error) {
        console.error("Error fetching supply data:", error);
      }
    };

    fetchSupplyData();
  }, []);

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
