import { useTheme } from "@/context/ThemeContext";

interface AccountInfoProps {
  account: string;
}

export function AccountInfo({ account }: AccountInfoProps) {
  const { theme } = useTheme();

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}]/40 rounded-lg`}>
      <div className="mb-6">
        <div className={`text-[${theme.primaryTextColor}] mb-4 text-xl`}>
          Account
        </div>
        <table className="w-full">
          <tbody>
            <tr>
              <td className={`py-4 text-[${theme.secondaryTextColor}] w-1/3`}>
                @Type
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                /Cosmos
              </td>
            </tr>
            <tr>
              <td className={`py-4 text-[${theme.secondaryTextColor}] w-1/3`}>
                Address
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                {account}
              </td>
            </tr>
            <tr>
              <td className={`py-4 text-[${theme.secondaryTextColor}] w-1/3`}>
                Pub Key
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>
                @Type Key
              </td>
            </tr>
            <tr>
              <td className={`py-4 text-[${theme.secondaryTextColor}] w-1/3`}>
                Account Number
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>7</td>
            </tr>
            <tr>
              <td className={`py-4 text-[${theme.secondaryTextColor}] w-1/3`}>
                Sequence
              </td>
              <td className={`py-4 text-[${theme.primaryTextColor}]`}>12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
