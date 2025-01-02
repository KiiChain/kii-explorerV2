import { ContractIcon } from "../ui/icons";

interface Asset {
  name: string;
  amount: string;
  value: string;
  percentage?: string;
}

interface BalanceAndAssetsProps {
  balance: string;
  assets: Asset[];
  totalValue: string;
}

export function BalanceAndAssets({
  balance,
  assets,
  totalValue,
}: BalanceAndAssetsProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="text-[#F3F5FB] mb-6 text-xl">Assets</div>
      <div className="flex gap-12">
        <div className="flex-shrink-0 w-2/5 flex flex-col items-center justify-center">
          <div className="relative w-3/5 flex items-center justify-center">
            <div
              className="w-48 h-48 rounded-full"
              style={{
                background: `conic-gradient(
                  #00FFA3 99%,
                  #D2AAFA 99% 100%
                )`,
                mask: "radial-gradient(transparent 40%, white 41%)",
                WebkitMask: "radial-gradient(transparent 40%, white 41%)",
              }}
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#F3F5FB] text-4xl font-bold">
              99%
            </div>
          </div>
          <div className="pt-8 flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00F9A6]"></div>
              <span className="text-sm text-white">Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D2AAFA]"></div>
              <span className="text-sm text-white">Stake</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7DD1F8]"></div>
              <span className="text-sm text-white">Reward</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#625FFF]"></div>
              <span className="text-sm text-white">Withdrawals</span>
            </div>
          </div>
        </div>

        {/* Right side - Assets List */}
        <div className="flex-grow">
          <div className="space-y-2">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#05000F] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#F3F5FB]">
                    <ContractIcon width={16} height={16} />
                  </div>
                  <div>
                    <div className="text-[#F3F5FB]">{asset.amount} KII</div>
                    <div className="text-xs text-gray-400">
                      {asset.percentage}
                    </div>
                  </div>
                </div>
                <div className="text-[#F3F5FB]">{asset.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-end p-4 bg-[#05000F] rounded-lg">
              <div className="text-[#F3F5FB]">Total Value:</div>
              <div className="text-[#F3F5FB] ml-2">{totalValue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
