import React from "react";

interface AccountInfoProps {
  account: string;
}

export function AccountInfo({ account }: AccountInfoProps) {
  return (
    <div className="mt-12 p-6">
      <div className="mb-6">
        <div className="text-[#F3F5FB] mb-4 text-xl">Account</div>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-4 text-gray-400 pl-8 w-1/4">@Type</td>
              <td className="py-4 text-[#F3F5FB] pl-8">/Cosmos</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 pl-8 w-1/4">Address</td>
              <td className="py-4 text-[#F3F5FB] pl-8 font-mono">{account}</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 pl-8 w-1/4">Pub Key</td>
              <td className="py-4 text-[#F3F5FB] pl-8">
                <div className="flex items-center gap-2">
                  <span>@Type</span>
                  <span>Key</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 pl-8 w-1/4">Account Number</td>
              <td className="py-4 text-[#F3F5FB] pl-8">7</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 pl-8 w-1/4">Sequence</td>
              <td className="py-4 text-[#F3F5FB] pl-8">12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
