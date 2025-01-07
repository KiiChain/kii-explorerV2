interface BalanceCardProps {
  balance: string;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-8">
          <div className="relative w-32 h-32">
            <div
              className="w-32 h-32 rounded-full border-8 border-[#00FFA3]"
              style={{
                background: "conic-gradient(#00FFA3 99%, transparent 99%)",
              }}
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
              99%
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-gray-400">Total Balance</div>
            <div className="text-white text-2xl">{balance}</div>
            <div className="text-gray-400">${balance}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
