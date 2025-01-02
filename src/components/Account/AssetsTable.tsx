interface Asset {
  name: string;
  amount: string;
  value: string;
}

interface AssetsTableProps {
  assets: Asset[];
}

export function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-white mb-4 text-xl">Assets</div>
        <table className="w-full">
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index} className="border-b border-[#2D4BA0]">
                <td className="py-4 text-gray-400">{asset.name}</td>
                <td className="py-4 text-right text-white">{asset.amount}</td>
                <td className="py-4 text-right text-gray-400">{asset.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
