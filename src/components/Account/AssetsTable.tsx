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
    <div
      style={{ backgroundColor: theme.boxColor }}
      className="mt-8 p-6 rounded-lg"
    >
      <div className="mb-6">
        <div style={{ color: theme.primaryTextColor }} className="mb-4 text-xl">
          Assets
        </div>
        <table className="w-full">
          <tbody>
            {assets.map((asset, index) => (
              <tr
                key={index}
                style={{ borderBottomColor: "#2D4BA0" }}
                className="border-b"
              >
                <td
                  style={{ color: theme.secondaryTextColor }}
                  className="py-4"
                >
                  {asset.name}
                </td>
                <td
                  style={{ color: theme.primaryTextColor }}
                  className="py-4 text-right"
                >
                  {asset.amount}
                </td>
                <td
                  style={{ color: theme.secondaryTextColor }}
                  className="py-4 text-right"
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
