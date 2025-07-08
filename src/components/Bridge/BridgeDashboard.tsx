import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "../StatCard";
import BridgeCard from "./BridgeCard";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import {
  IBCToken,
  useCosmosTokens,
  useQueryIBCAssetList,
} from "@/services/queries/ibc";
import rawConnections from "./connections.json";
import type { IConnection } from "./BridgeCard";
import { useMemo } from "react";

export default function BridgeDashboard() {
  const connections = rawConnections as IConnection[];

  const { theme } = useTheme();
  const { data: walletClient } = useWalletClient();

  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ercTokens } = useCosmosTokens(walletClient);
  const { data: ibcAssets } = useQueryIBCAssetList();

  const assetMap: Record<string, string> = {
    "0x1E643c8fDc9bA4B99AE598e9b0Ed98fe3A2319f9": "atom",
  };

  const combinedBalances = useMemo(() => {
    if (!ercTokens || !balance || !ibcAssets) return [];

    const nativeCoin: IBCToken = {
      amount: balance.value.toString(),
      denom: "kii",
      exponent: 18,
      base: "akii",
      name: "KII",
    };

    const mappedErc = ercTokens
      .map((token) => {
        const denom = assetMap[token.contractAddress];
        if (!denom) return null;

        const assetInfo = ibcAssets.find((a) => a.denom == denom);
        if (!assetInfo) return null;

        const balanceInfo: IBCToken = {
          amount: token.amount.toString(),
          denom: denom,
          exponent: assetInfo.exponent,
          base: assetInfo.base,
          name: assetInfo.name,
        };

        return balanceInfo;
      })
      .filter(Boolean) as IBCToken[];

    return [...mappedErc, nativeCoin];
  }, [ercTokens, balance, ibcAssets]);

  return (
    <div
      className="p-6 rounded-xl mb-6 pt-12"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2
            style={{ color: theme.primaryTextColor }}
            className="text-2xl font-bold"
          >
            IBC Bridges
          </h2>
        </div>
        <p style={{ color: theme.secondaryTextColor }} className="text-md">
          Transfer tokens between KiiChain and other Cosmos chains
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <StatCard
          title="Active Connections"
          value={connections.length.toString()}
        />
      </div>

      {/* Bridge Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {connections.map((connection) => (
          <BridgeCard
            key={connection.id}
            connection={connection}
            balances={combinedBalances}
          />
        ))}
      </div>

      {/* Info Section */}
      <Card
        style={{
          backgroundColor: theme.boxColor,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="border-0"
      >
        <CardContent className="p-6 rounded-lg m-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D2AAFA] flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-black text-sm font-bold">i</span>
            </div>
            <div>
              <h3
                style={{ color: theme.primaryTextColor }}
                className="font-medium mb-3 text-lg"
              >
                About IBC Transfers
              </h3>
              <p
                style={{ color: theme.secondaryTextColor }}
                className="leading-relaxed"
              >
                Inter-Blockchain Communication (IBC) allows secure token
                transfers between different Cosmos chains. Transfers typically
                take 1-3 minutes to complete and require a small fee on both
                source and destination chains.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
