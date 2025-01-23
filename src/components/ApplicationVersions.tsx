import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

interface NodeInfo {
  default_node_info: {
    protocol_version: {
      p2p: string;
      block: string;
      app: string;
    };
    network: string;
    version: string;
    moniker: string;
  };
  application_version: {
    name: string;
    app_name: string;
    version: string;
    git_commit: string;
    go_version: string;
    cosmos_sdk_version: string;
    build_deps: Array<{
      path: string;
      version: string;
      sum: string;
    }>;
  };
}

export function ApplicationVersions() {
  const { theme } = useTheme();
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);

  useEffect(() => {
    async function fetchNodeInfo() {
      try {
        const response = await fetch(
          "https://lcd.uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/node_info"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch node info");
        }
        const data = await response.json();
        setNodeInfo(data);
      } catch (error) {
        console.error("Error fetching node info:", error);
      }
    }

    fetchNodeInfo();
  }, []);

  if (!nodeInfo) {
    return <div>Loading...</div>;
  }

  // Simulate multiple versions by duplicating the nodeInfo
  const versions = [nodeInfo, nodeInfo, nodeInfo]; // Replace with actual different versions if available

  return (
    <div className="p-6">
      <h2 className="text-lg mb-6" style={{ color: theme.primaryTextColor }}>
        Application Versions
      </h2>

      {versions.map((version, index) => (
        <div key={index} className="mb-8">
          <table className="w-full mb-8">
            <tbody>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Name
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.name}
                </td>
              </tr>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  App Name
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.app_name}
                </td>
              </tr>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Version
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.version}
                </td>
              </tr>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Git Commit
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.git_commit}
                </td>
              </tr>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Go Version
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.go_version}
                </td>
              </tr>
              <tr className="border-b border-[#231C32]/50">
                <td
                  className="py-4"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Cosmos SDK
                </td>
                <td className="py-4" style={{ color: theme.primaryTextColor }}>
                  {version.application_version.cosmos_sdk_version}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
