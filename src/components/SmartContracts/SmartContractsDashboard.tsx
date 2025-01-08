"use client";

import { useTheme } from "@/context/ThemeContext";

interface SmartContract {
  codeId: string;
  codeHash: string;
  creator: string;
  createdAt: string;
}

const initialContracts: SmartContract[] = [
  {
    codeId: "2258694",
    codeHash: "2D4C79CDE9765E52C69AF43E",
    creator: "0x666a286362Ffb4eF21CA25CD1273Cc5D07b7037",
    createdAt: "2024-10-30 14:21",
  },
  {
    codeId: "2258694",
    codeHash: "2D4C79CDE9765E52C69AF43E",
    creator: "0x666a286362Ffb4eF21CA25CD1273Cc5D07b7037",
    createdAt: "2024-10-30 14:21",
  },
];

export function SmartContractsDashboard() {
  const { theme } = useTheme();

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="mt-24">
        <div
          className="rounded-lg p-6 shadow-lg"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="overflow-x-auto w-full">
            <table className="min-w-full">
              <thead>
                <tr
                  className="text-left border-b"
                  style={{
                    color: theme.primaryTextColor,
                    borderColor: theme.accentColor,
                  }}
                >
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Code ID</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Code Hash</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Creator</b>
                  </th>
                  <th className="py-4 px-2 sm:px-6 font-bold">
                    <b>Created At</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 20 }, (_, index) => (
                  <tr
                    key={index}
                    className="border-b"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.accentColor,
                    }}
                  >
                    <td
                      className="py-2 px-1 sm:px-3 text-xs"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {initialContracts[index % initialContracts.length].codeId}
                    </td>
                    <td className="py-2 px-1 sm:px-3">
                      <span
                        style={{ color: theme.tertiaryTextColor }}
                        className="text-xs"
                      >
                        {
                          initialContracts[index % initialContracts.length]
                            .codeHash
                        }
                      </span>
                    </td>

                    <td
                      className="py-2 px-1 sm:px-3 font-light text-xs"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {
                        initialContracts[index % initialContracts.length]
                          .creator
                      }
                    </td>

                    <td
                      className="py-2 px-1 sm:px-3 font-light text-xs"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {
                        initialContracts[index % initialContracts.length]
                          .createdAt
                      }
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
