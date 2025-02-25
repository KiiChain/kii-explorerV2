import { ContractIcon } from "./ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

interface Block {
  height: string;
  hash: string;
  timestamp: string;
  txCount: number;
  proposer: string;
}

interface Transaction {
  from: string;
  to: string;
  amount: string;
  denom: string;
  timestamp: string;
  hash: string;
}

export function BlockTable({
  latestBlocks,
  latestTransactions,
}: {
  latestBlocks: Block[];
  latestTransactions: Transaction[];
  handleBlockClick: (height: string) => void;
  handleAddressClick: (address: string) => void;
}) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleBlockClick = (height: string) => {
    router.push(`/blocksID/${height}`);
  };

  return (
    <div className="mt-4 text-base">
      <table className="w-full table-fixed">
        <tbody className="space-y-4">
          {latestBlocks.map((block, index) => (
            <tr
              key={index}
              style={{ backgroundColor: theme.bgColor }}
              className="rounded-lg mb-4 w-full"
            >
              <td className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 items-center">
                <span
                  className="col-span-1 lg:col-span-2 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => handleBlockClick(block.height)}
                >
                  <ContractIcon className="w-4 h-4" />
                  <span style={{ color: theme.secondaryTextColor }}>
                    {block.height || "N/A"}
                  </span>
                </span>
                <div className="flex items-center gap-2 col-span-1 lg:col-span-3">
                  <span style={{ color: theme.secondaryTextColor }}>
                    Fee Recipient
                  </span>
                  <span
                    style={{ color: theme.accentColor }}
                    className="truncate md:whitespace-nowrap"
                  >
                    {window.innerWidth < 1024
                      ? `${block.proposer.slice(0, 8)}...`
                      : block.proposer}
                  </span>
                </div>
                <span className="col-span-1 lg:col-span-2 flex items-center gap-2">
                  <ContractIcon className="w-4 h-4" />
                  <span style={{ color: theme.secondaryTextColor }}>
                    {latestTransactions[index]?.hash
                      ? `${latestTransactions[index].hash.slice(0, 10)}...`
                      : "N/A"}
                  </span>
                </span>
                <div className="flex flex-col col-span-1 lg:col-span-3">
                  <span className="text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span style={{ color: theme.secondaryTextColor }}>
                        From:
                      </span>
                      <span
                        style={{ color: theme.accentColor }}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() =>
                          latestTransactions[index]?.from &&
                          router.push(
                            `/account/${latestTransactions[index].from}`
                          )
                        }
                      >
                        {window.innerWidth < 1600 &&
                        latestTransactions[index]?.from
                          ? `${latestTransactions[index].from.slice(0, -15)}...`
                          : latestTransactions[index]?.from || "N/A"}
                      </span>
                    </div>
                  </span>
                  <span className="text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span style={{ color: theme.secondaryTextColor }}>
                        To:
                      </span>
                      <span
                        style={{ color: theme.accentColor }}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() =>
                          latestTransactions[index]?.to &&
                          router.push(
                            `/account/${latestTransactions[index].to}`
                          )
                        }
                      >
                        {window.innerWidth < 1600 &&
                        latestTransactions[index]?.to
                          ? `${latestTransactions[index].to.slice(0, -15)}...`
                          : latestTransactions[index]?.to || "N/A"}
                      </span>
                    </div>
                  </span>
                </div>
                <div className="flex justify-center col-span-1 lg:col-span-2">
                  <span
                    style={{
                      backgroundColor: theme.boxColor,
                      color: theme.accentColor,
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    className="px-3 py-1 rounded-full text-center inline-block w-fit cursor-pointer hover:opacity-80"
                  >
                    {latestTransactions[index]?.amount
                      ? parseInt(latestTransactions[index].amount) / 1000000
                      : 0}{" "}
                    {latestTransactions[index]?.denom?.includes("ukii")
                      ? "KII"
                      : "ORO"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
