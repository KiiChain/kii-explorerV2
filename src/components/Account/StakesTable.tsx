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
              <tr
                key={index}
                className="border-b border-[#2D4BA0] bg-[#05000F]"
              >
                <td className="py-4 text-white">{stake.validator}</td>
                <td className="py-4 text-white">{stake.amount}</td>
                <td className="py-4 text-white">{stake.rewards}</td>
                <td className="py-4">
                  <button className="px-4 py-2 bg-[#231C32] text-[#D2AAFA] rounded-lg hover:opacity-80">
                    Relocate
                  </button>
                  <button className="ml-2 px-4 py-2 bg-[#231C32] text-[#D2AAFA] rounded-lg hover:opacity-80">
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
