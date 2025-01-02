import React from "react";

interface StakeProps {
  stakes: {
    validator: string;
    amount: string;
    rewards: string;
  }[];
}

export function StakesTable({ stakes }: StakeProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-white mb-4 text-xl">Stakes</div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Validator</th>
              <th className="pb-4">Stake</th>
              <th className="pb-4">Rewards</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {stakes?.map((stake, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <tr key={`spacer-${index}`}>
                    <td colSpan={4} className="h-4"></td>
                  </tr>
                )}
                <tr className="border-b border-[#2D4BA0] bg-[#05000F] rounded-lg">
                  <td className="py-4 text-white pl-8 rounded-l-lg">
                    {stake.validator}
                  </td>
                  <td className="py-4 text-white pl-8">{stake.amount}</td>
                  <td className="py-4 text-white pl-8">{stake.rewards}</td>
                  <td className="py-4 rounded-r-lg">
                    <button className="px-4 py-2 bg-[#231C32] text-[#D2AAFA] rounded-lg hover:opacity-80">
                      Relocate
                    </button>
                    <button className="ml-2 px-4 py-2 bg-[#231C32] text-[#D2AAFA] rounded-lg hover:opacity-80">
                      Withdraw
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
