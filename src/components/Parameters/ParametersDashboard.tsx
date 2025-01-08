"use client";

import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { ParameterCard } from "./ParameterCard";
import { useTheme } from "@/context/ThemeContext";

export function ParametersDashboard() {
  const { theme } = useTheme();

  return (
    <div className={`p-6 bg-[${theme.bgColor}]`}>
      <UptimeHeader />

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-24`}
      >
        Chain ID: kiichain-1
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard title="Height" value="2596652" />
        <ParameterCard title="Bonded and Supply" value="300K/2B" />
        <ParameterCard title="Bonded Ratio" value="0.02%" />
        <ParameterCard title="Inflation" value="-" />
      </div>

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-8`}
      >
        Staking Parameters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <ParameterCard title="Unbonding Time" value="21 days" />
        <ParameterCard title="Max Validators" value="100" />
        <ParameterCard title="Max Entries" value="7" />
        <ParameterCard title="Historical Entries" value="10000" />
        <ParameterCard title="Bond Denom" value="tkii" />
      </div>

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-8`}
      >
        Governance Parameters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <ParameterCard title="Voting Period" value="2 days" />
        <ParameterCard title="Min Deposit" value="10000000" />
        <ParameterCard title="Max Deposit Period" value="2 days" />
        <ParameterCard title="33.4%" value="25594109" />
        <ParameterCard title="Threshold" value="50%" />
        <ParameterCard title="Veto Threshold" value="33.4%" />
      </div>

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-8`}
      >
        Distribution Parameters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard title="Community Tax" value="2%" />
        <ParameterCard title="Base Proposer Reward" value="0" />
        <ParameterCard title="Bonus Proposer Reward" value="0" />
        <ParameterCard title="Widthdraw Addr Enable" value="True" />
      </div>

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-8`}
      >
        Slashing Parameters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ParameterCard title="Signed Blocks Window" value="100" />
        <ParameterCard title="Min Signed Per Window" value="50%" />
        <ParameterCard title="Downtime Jailed Duration" value="10 mins" />
        <ParameterCard title="Slash Fraction Double Sign" value="5%" />
        <ParameterCard title="Slash Fraction Downtime" value="1%" />
      </div>

      <h2
        className={`text-xl font-semibold text-[${theme.primaryTextColor}] mb-4 pt-8`}
      >
        Application Versions
      </h2>
      <table
        className={`min-w-full bg-[${theme.bgColor}] rounded-lg shadow-lg`}
      >
        <tbody>
          <tr>
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              Name
            </td>
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              Kiichain
            </td>
          </tr>
          <tr className="border-t">

            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              App_name
            </td>
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              kiichaind
            </td>
          </tr>
          <tr className="border-t">
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              Version
            </td>
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              2b0e7
            </td>
          </tr>
          <tr className="border-t">
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>
              Git_commit
            </td>
            <td className={`text-[${theme.secondaryTextColor}] text-lg p-4`}>

              d7f6e1a3b9c6f7e7c3d8b4d6a5d4e5f6
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
