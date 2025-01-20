import { ContractIcon } from "../ui/icons";
import { useTheme } from "@/context/ThemeContext";

interface Asset {
  name: string;
  amount: string;
  value: string;
  percentage?: string;
}

interface BalanceAndAssetsProps {
  assets: Asset[];
  totalValue: string;
}

export function BalanceAndAssets({
  assets,
  totalValue,
}: BalanceAndAssetsProps) {
  const { theme } = useTheme();

  const total = assets.reduce((acc, asset) => {
    const amount = parseFloat(asset.amount.replace(" KII", "")) || 0;
    return acc + amount;
  }, 0);

  const assetsWithCalculatedPercentages = assets.map((asset) => {
    const amount = parseFloat(asset.amount.replace(" KII", "")) || 0;
    const percentage = total === 0 ? 0 : (amount / total) * 100;
    return {
      ...asset,
      percentage: `${isNaN(percentage) ? "0" : percentage.toFixed(2)}%`,
      numericPercentage: isNaN(percentage) ? 0 : Number(percentage.toFixed(2)),
    };
  });

  const createConicGradient = () => {
    let currentPercentage = 0;
    const colors = ["#00FFA3", "#D2AAFA", "#7DD1F8", "#625FFF"];

    return `conic-gradient(${assetsWithCalculatedPercentages
      .map((asset, index) => {
        const startPercentage = currentPercentage;
        currentPercentage += asset.numericPercentage;
        return `${colors[index]} ${startPercentage}% ${currentPercentage}%`;
      })
      .join(", ")})`;
  };

  return (
    <div
      style={{ backgroundColor: theme.boxColor }}
      className="mt-8 p-6 rounded-lg"
    >
      <div style={{ color: theme.primaryTextColor }} className="mb-6 text-xl">
        Assets
      </div>
      <div className="flex gap-12">
        <div className="flex-shrink-0 w-2/5 flex flex-col items-center justify-center">
          <div className="relative w-4/5 flex items-center justify-center">
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: createConicGradient(),
                mask: "radial-gradient(transparent 55%, white 56%)",
                WebkitMask: "radial-gradient(transparent 55%, white 56%)",
              }}
            ></div>
            <div
              style={{ color: theme.primaryTextColor }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold"
            >
              {assetsWithCalculatedPercentages[0].percentage}
            </div>
          </div>
          <div className="pt-8 flex gap-4 justify-center">
            {assets.map((asset, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "#00F9A6",
                      "#D2AAFA",
                      "#7DD1F8",
                      "#625FFF",
                    ][index],
                  }}
                ></div>
                <span className="text-sm text-white">{asset.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-grow">
          <div className="space-y-2">
            {assetsWithCalculatedPercentages.map((asset, index) => (
              <div
                key={index}
                style={{ backgroundColor: theme.bgColor }}
                className="flex items-center justify-between p-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: theme.primaryTextColor }}>
                    <ContractIcon width={16} height={16} />
                  </div>
                  <div>
                    <div style={{ color: theme.primaryTextColor }}>
                      {asset.amount}
                    </div>
                    <div className="text-xs text-gray-400">
                      {asset.percentage}
                    </div>
                  </div>
                </div>
                <div style={{ color: theme.primaryTextColor }}>
                  {asset.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div
              style={{ backgroundColor: theme.bgColor }}
              className="flex items-center justify-end p-4 rounded-lg"
            >
              <div style={{ color: theme.primaryTextColor }}>Total Value:</div>
              <div style={{ color: theme.primaryTextColor }} className="ml-2">
                {totalValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
