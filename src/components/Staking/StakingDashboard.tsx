"use client";

import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { ParametersIcon } from "../ui/icons";

export function StakingDashboard() {
  return (
    <div className="p-6 bg-[#05000F]">
      <UptimeHeader />

      {/* Stats Section */}
      <div className="bg-[#05000F] p-6 rounded-xl mb-6">
        <div className="grid grid-cols-4 gap-8">
          <div className="flex items-center gap-2">
            <ParametersIcon className="h-20 w-20 text-[#E0B1FF]" />
            <div>
              <div className="text-2xl font-bold">0%</div>
              <div className="text-gray-600">Inflation</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6.66665H14.1667V4.99998C14.1667 2.69998 12.3 0.833313 10 0.833313C7.70004 0.833313 5.83337 2.69998 5.83337 4.99998V6.66665H5.00004C4.08337 6.66665 3.33337 7.41665 3.33337 8.33331V16.6666C3.33337 17.5833 4.08337 18.3333 5.00004 18.3333H15C15.9167 18.3333 16.6667 17.5833 16.6667 16.6666V8.33331C16.6667 7.41665 15.9167 6.66665 15 6.66665ZM7.50004 4.99998C7.50004 3.61665 8.61671 2.49998 10 2.49998C11.3834 2.49998 12.5 3.61665 12.5 4.99998V6.66665H7.50004V4.99998ZM15 16.6666H5.00004V8.33331H15V16.6666ZM10 14.1666C10.9167 14.1666 11.6667 13.4166 11.6667 12.5C11.6667 11.5833 10.9167 10.8333 10 10.8333C9.08337 10.8333 8.33337 11.5833 8.33337 12.5C8.33337 13.4166 9.08337 14.1666 10 14.1666Z"
                fill="#E0B1FF"
              />
            </svg>
            <div>
              <div className="text-2xl font-bold">21 Days</div>
              <div className="text-gray-600">Unbonding Time</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 7.04167V10.375M6.11 3.28167L3.28167 6.11L3.27833 6.1125C2.9925 6.39833 2.84833 6.5425 2.745 6.71C2.65417 6.85917 2.58667 7.02167 2.54583 7.19167C2.5 7.38333 2.5 7.5875 2.5 7.995V12.005C2.5 12.4125 2.5 12.6158 2.54583 12.8083C2.58681 12.9784 2.6543 13.1409 2.74583 13.29C2.84917 13.4575 2.99333 13.6025 3.28167 13.89L6.11 16.7192C6.39833 17.0075 6.54167 17.1508 6.71 17.2542C6.85917 17.3458 7.02167 17.4125 7.19167 17.4542C7.38333 17.5 7.58667 17.5 7.99333 17.5H12.0067C12.4125 17.5 12.6167 17.5 12.8083 17.4542C12.9783 17.4125 13.1417 17.3458 13.29 17.2542C13.4583 17.1508 13.6025 17.0075 13.89 16.7192L16.7192 13.8908C17.0075 13.6025 17.1517 13.4575 17.2542 13.29C17.3458 13.14 17.4125 12.9783 17.4542 12.8083C17.5 12.6167 17.5 12.4125 17.5 12.005V7.995C17.5 7.5875 17.5 7.38417 17.4533 7.19167C17.4126 7.02166 17.3454 6.85912 17.2542 6.71C17.1517 6.54167 17.0075 6.39833 16.7192 6.11L13.8917 3.28167C13.6033 2.99333 13.4592 2.84833 13.2917 2.74583C13.1423 2.65421 12.9795 2.58671 12.8092 2.54583C12.6167 2.5 12.4125 2.5 12.0042 2.5H7.995C7.58667 2.5 7.38333 2.5 7.19167 2.54583C7.0217 2.58707 6.85919 2.65455 6.71 2.74583C6.54333 2.8475 6.40167 2.99 6.11833 3.27333L6.11 3.28167ZM10.0417 12.875V12.9583H9.95833V12.875H10.0417Z"
                stroke="#D2AAFA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <div className="text-2xl font-bold">5%</div>
              <div className="text-gray-600">Double Sign Slashing</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6283 8.33335H4.96167V6.66669H16.6283V8.33335ZM16.6283 13.3334H4.96167V11.6667H16.6283V13.3334Z"
                fill="#E0B1FF"
              />
            </svg>
            <div>
              <div className="text-2xl font-bold">1%</div>
              <div className="text-gray-600">Downtime Slashing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 pl-12">
        <button className="px-4 py-2 bg-[#231C32] text-gray-600 hover:text-[#E0B1FF] rounded-lg flex items-center justify-center">
          Popular
        </button>
        <button className="px-4 py-2 bg-[#231C32] text-gray-600 hover:text-[#E0B1FF] rounded-lg flex items-center justify-center">
          Active
        </button>
        <button className="px-4 py-2 bg-[#231C32] text-gray-600 hover:text-[#E0B1FF] rounded-lg flex items-center justify-center">
          Inactive
        </button>
      </div>

      {/* Validators List */}
      <div className="bg-[#231C32] rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-4">Rank</th>
              <th className="p-4">Validator</th>
              <th className="p-4">Voting Power</th>
              <th className="p-4">24h changes</th>
              <th className="p-4">Commission</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((rank) => (
              <tr key={rank} className="border-t bg-[#05000F]">
                <td className="p-4 text-purple-600 font-bold">{rank}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E0B1FF] rounded-full"></div>
                    <div>
                      <div className="font-medium">KiiAventador</div>
                      <div className="text-gray-500 text-sm">
                        https://app.kiiglobal.io/
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>1000,00 KII</div>
                  <div className="text-gray-500 text-sm">33.33%</div>
                </td>
                <td className="p-4">-</td>
                <td className="p-4">10%</td>
                <td className="p-4">
                  <button className="px-4 py-2 text-[#E0B1FF] bg-[#231C32] rounded-lg">
                    Create Stake
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pr-4 pt-4 border-t mt-6">
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="bg-[#05000F] rounded-lg p-3">Top 33%</span>
            <span className="bg-[#05000F] rounded-lg p-3">Top 67%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
