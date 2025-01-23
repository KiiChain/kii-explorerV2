import { useTheme } from "@/context/ThemeContext";

export function ApplicationVersions() {
  const { theme } = useTheme();

  return (
    <div className="p-6">
      <h2 className="text-lg mb-6" style={{ color: theme.primaryTextColor }}>
        Application Versions
      </h2>

      <table className="w-full">
        <tbody>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Name
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Kiichain
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              App_name
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Kiichaind
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Version
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              26c1fe7
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Git_commit
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              87eefca1ad86ec69374874c25558f430afdb5555c8
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Build_tags
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              App_v1
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Go_version
            </td>
            <td className="py-4" style={{ color: theme.secondaryTextColor }}>
              Go Version Go1.19 Linux/Amd64
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full mt-4">
        <tbody>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4 w-1/4"></td>
            <td
              className="py-4 w-1/4"
              style={{ color: theme.secondaryTextColor }}
            >
              Cloud.Google.Com/Go
            </td>
            <td
              className="py-4 w-1/4"
              style={{ color: theme.secondaryTextColor }}
            >
              V0.110.0
            </td>
            <td className="py-4" style={{ color: theme.accentColor }}>
              H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
            </td>
          </tr>
          <tr className="border-b border-[#231C32]/50">
            <td className="py-4 w-1/4"></td>
            <td
              className="py-4 w-1/4"
              style={{ color: theme.secondaryTextColor }}
            >
              Cloud.Google.Com/Go
            </td>
            <td
              className="py-4 w-1/4"
              style={{ color: theme.secondaryTextColor }}
            >
              V0.110.0
            </td>
            <td className="py-4" style={{ color: theme.accentColor }}>
              H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
