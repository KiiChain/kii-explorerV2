import { useTheme } from "@/context/ThemeContext";
import { useNodeInfo } from "@/services/queries/nodeInfo";

export function ApplicationVersions() {
  const { theme } = useTheme();
  const { data: nodeInfo, isLoading } = useNodeInfo();

  if (isLoading || !nodeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg mb-6" style={{ color: theme.primaryTextColor }}>
        Application Version
      </h2>

      <div className="mb-8">
        <table className="w-full mb-8">
          <tbody>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                Name
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.name}
              </td>
            </tr>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                App Name
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.app_name}
              </td>
            </tr>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                Version
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.version}
              </td>
            </tr>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                Git Commit
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.git_commit}
              </td>
            </tr>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                Go Version
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.go_version}
              </td>
            </tr>
            <tr className="border-b border-[#231C32]/50">
              <td className="py-4" style={{ color: theme.secondaryTextColor }}>
                Cosmos SDK
              </td>
              <td className="py-4" style={{ color: theme.primaryTextColor }}>
                {nodeInfo.application_version.cosmos_sdk_version}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
