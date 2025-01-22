"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SmartContract {
  transaction: {
    hash: string;
    type: "cosmos" | "evm";
  };
  sender: string;
  timestamp: number;
  BlockNumber: number;
}

interface SmartContractsResponse {
  success: boolean;
  smartContracts: SmartContract[];
}

export function SmartContractsDashboard() {
  const { theme } = useTheme();
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(
          "https://kii.backend.kiivalidator.com/explorer/smartContracts"
        );
        const data: SmartContractsResponse = await response.json();

        console.log("Smart Contracts Data:", data);

        if (data.success) {
          setContracts(data.smartContracts);
        }
      } catch (error) {
        console.error("Error fetching smart contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  const handleTransactionClick = (hash: string) => {
    router.push(`/transaction/${hash}`);
  };

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="mt-16">
        <div
          className="rounded-lg p-6 shadow-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className="py-2 px-1 sm:px-3 text-left text-base font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Code ID
                  </th>
                  <th
                    className="py-2 px-1 sm:px-3 text-left text-base font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Code Hash
                  </th>
                  <th
                    className="py-2 px-1 sm:px-3 text-left text-base font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Creator
                  </th>
                  <th
                    className="py-2 px-1 sm:px-3 text-left text-base font-medium"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(20)].map((_, index) => (
                  <tr
                    key={index}
                    style={{ backgroundColor: theme.bgColor }}
                    className="mt-2"
                    onClick={() =>
                      handleTransactionClick(
                        contracts[index % contracts.length]?.transaction.hash
                      )
                    }
                  >
                    <td
                      className="py-4 px-1 sm:px-3 font-light text-base"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {contracts[index % contracts.length]?.BlockNumber ||
                        "Loading..."}
                    </td>

                    <td
                      className="py-4 px-1 sm:px-3 font-light text-base"
                      style={{ color: theme.tertiaryTextColor }}
                    >
                      {contracts[
                        index % contracts.length
                      ]?.transaction.hash.substring(0, 12) || "Loading..."}
                    </td>

                    <td
                      className="py-4 px-1 sm:px-3 font-light text-base"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {contracts[index % contracts.length]?.sender ||
                        "Loading..."}
                    </td>

                    <td
                      className="py-4 px-1 sm:px-3 font-light text-base"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {contracts[index % contracts.length]
                        ? new Date(
                            contracts[index % contracts.length].timestamp
                          ).toLocaleString()
                        : "Loading..."}
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
