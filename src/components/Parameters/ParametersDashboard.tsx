"use client";

import { useTheme } from "@/context/ThemeContext";
import { ParameterCard } from "./ParameterCard";
import { useChainParameters } from "@/services/queries/parameters";

export function ParametersDashboard() {
  const { theme } = useTheme();
  const { data: parameters } = useChainParameters();

  if (!parameters) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="px-6">
      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-base font-semibold mb-4 pt-20"
      >
        Chain ID: kiichain-1
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard title="Height" value={parameters.height} />
        <ParameterCard title="Bonded and Supply" value="300K/2B" />
        <ParameterCard title="Bonded Ratio" value="0.02%" />
        <ParameterCard title="Inflation" value="-" />
      </div>

      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-8"
      >
        <p className="text-base">Staking Parameters</p>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <ParameterCard
          title="Unbonding Time"
          value={parameters.stakingParams.unbondingTime}
        />
        <ParameterCard
          title="Max Validators"
          value={parameters.stakingParams.maxValidators.toString()}
        />
        <ParameterCard
          title="Max Entries"
          value={parameters.stakingParams.maxEntries.toString()}
        />
        <ParameterCard
          title="Historical Entries"
          value={parameters.stakingParams.historicalEntries.toString()}
        />
        <ParameterCard
          title="Bond Denom"
          value={parameters.stakingParams.bondDenom}
        />
      </div>

      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-8"
      >
        <p className="text-base">Governance Parameters</p>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <ParameterCard
          title="Voting Period"
          value={parameters.govParams.votingPeriod}
        />
        <ParameterCard
          title="Min Deposit"
          value={parameters.govParams.minDeposit}
        />
        <ParameterCard
          title="Max Deposit Period"
          value={parameters.govParams.maxDepositPeriod}
        />
        <ParameterCard title="33.4%" value="25594109" />
        <ParameterCard
          title="Threshold"
          value={parameters.govParams.threshold}
        />
        <ParameterCard
          title="Veto Threshold"
          value={parameters.govParams.vetoThreshold}
        />
      </div>

      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-8"
      >
        <p className="text-base">Distribution Parameters</p>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard
          title="Community Tax"
          value={parameters.distributionParams.communityTax}
        />
        <ParameterCard
          title="Base Proposer Reward"
          value={parseInt(
            parameters.distributionParams.baseProposerReward
          ).toString()}
        />
        <ParameterCard
          title="Bonus Proposer Reward"
          value={parseInt(
            parameters.distributionParams.bonusProposerReward
          ).toString()}
        />
        <ParameterCard
          title="Widthdraw Addr Enable"
          value={parameters.distributionParams.withdrawAddrEnabled.toString()}
        />
      </div>

      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-8"
      >
        <p className="text-base">Slashing Parameters</p>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ParameterCard
          title="Signed Blocks Window"
          value={parameters.slashingParams.signed_blocks_window}
        />
        <ParameterCard
          title="Min Signed Per Window"
          value={parameters.slashingParams.min_signed_per_window}
        />
        <ParameterCard
          title="Downtime Jailed Duration"
          value={parameters.slashingParams.downtime_jail_duration}
        />
        <ParameterCard
          title="Slash Fraction Double Sign"
          value={parameters.slashingParams.slash_fraction_double_sign}
        />
        <ParameterCard
          title="Slash Fraction Downtime"
          value={parameters.slashingParams.slash_fraction_downtime}
        />
      </div>

      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-8"
      >
        <p className="text-base">Application Versions</p>
      </h2>
      <table
        style={{ backgroundColor: theme.bgColor }}
        className="min-w-full rounded-lg shadow-lg"
      >
        <tbody>
          <tr>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
            >
              <p className="text-base">Name</p>
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="p-4 shadow-lg text-base"
            >
              {parameters.appVersion.name}
            </td>
          </tr>
          <tr className="border-t">
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
            >
              <p className="text-base">App_name</p>
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-base p-4 shadow-lg"
            >
              {parameters.appVersion.appName}
            </td>
          </tr>
          <tr className="border-t">
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-base p-4 shadow-lg"
            >
              <p className="text-base">Version</p>
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-base p-4 shadow-lg"
            >
              {parameters.appVersion.version}
            </td>
          </tr>
          <tr className="border-t">
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-base p-4 shadow-lg"
            >
              <p className="text-base">Git_commit</p>
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-base p-4 shadow-lg"
            >
              {parameters.appVersion.gitCommit}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
