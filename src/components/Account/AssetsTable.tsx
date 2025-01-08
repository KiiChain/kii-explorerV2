import { useTheme } from "@/context/ThemeContext";

interface Asset {
  name: string;
  amount: string;
  value: string;
}

interface AssetsTableProps {
  assets: Asset[];
}

export function AssetsTable({ assets }: AssetsTableProps) {
  const { theme } = useTheme();

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}]/40 rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Assets
        </div>
        <table className="w-full">
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index} className="border-b border-[#2D4BA0]">
                <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                  {asset.name}
                </td>
                <td
                  className={`py-4 text-right text-[${theme.primaryTextColor}]`}
                >
                  {asset.amount}
                </td>
                <td
                  className={`py-4 text-right text-[${theme.secondaryTextColor}]`}
                >
                  {asset.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
