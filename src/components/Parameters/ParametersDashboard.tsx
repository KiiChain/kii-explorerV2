"use client";

import { useEffect, useState } from "react";
import { ParameterCard } from "./ParameterCard";
import { useTheme } from "@/context/ThemeContext";

interface ChainParameters {
  height: string;
  stakingParams: {
    unbondingTime: string;
    maxValidators: number;
    maxEntries: number;
    historicalEntries: number;
    bondDenom: string;
  };
  slashingParams: {
    signed_blocks_window: string;
    min_signed_per_window: string;
    downtime_jail_duration: string;
    slash_fraction_double_sign: string;
    slash_fraction_downtime: string;
  };
  distributionParams: {
    communityTax: string;
    baseProposerReward: string;
    bonusProposerReward: string;
    withdrawAddrEnabled: boolean;
  };
  govParams: {
    votingPeriod: string;
    minDeposit: string;
    maxDepositPeriod: string;
    quorum: string;
    threshold: string;
    vetoThreshold: string;
  };
  appVersion: {
    name: string;
    appName: string;
    version: string;
    gitCommit: string;
  };
}

export function ParametersDashboard() {
  const { theme } = useTheme();
  const [parameters, setParameters] = useState<ChainParameters | null>(null);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const [
          blockRes,
          stakingRes,
          slashingRes,
          distributionRes,
          govVotingRes,
          govDepositRes,
          govTallyRes,
          nodeInfoRes,
        ] = await Promise.all([
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/blocks/latest"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/params"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/slashing/v1beta1/params"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/distribution/v1beta1/params"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/gov/v1beta1/params/voting"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/gov/v1beta1/params/deposit"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/gov/v1beta1/params/tallying"
          ),
          fetch(
            "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/base/tendermint/v1beta1/node_info"
          ),
        ]);

        const [
          blockData,
          stakingData,
          slashingData,
          distributionData,
          govVotingData,
          govDepositData,
          govTallyData,
          nodeInfoData,
        ] = await Promise.all([
          blockRes.json(),
          stakingRes.json(),
          slashingRes.json(),
          distributionRes.json(),
          govVotingRes.json(),
          govDepositRes.json(),
          govTallyRes.json(),
          nodeInfoRes.json(),
        ]);

        setParameters({
          height: blockData.block.header.height,
          stakingParams: {
            unbondingTime:
              parseInt(stakingData.params.unbonding_time.replace("s", "")) /
                86400 +
              " days",
            maxValidators: stakingData.params.max_validators,
            maxEntries: stakingData.params.max_entries,
            historicalEntries: stakingData.params.historical_entries,
            bondDenom: stakingData.params.bond_denom,
          },
          slashingParams: {
            signed_blocks_window: slashingData.params.signed_blocks_window,
            min_signed_per_window:
              (
                parseFloat(slashingData.params.min_signed_per_window) * 100
              ).toFixed(2) + "%",
            downtime_jail_duration:
              parseInt(
                slashingData.params.downtime_jail_duration.replace("s", "")
              ) /
                60 +
              " mins",
            slash_fraction_double_sign:
              (
                parseFloat(slashingData.params.slash_fraction_double_sign) * 100
              ).toFixed(2) + "%",
            slash_fraction_downtime:
              (
                parseFloat(slashingData.params.slash_fraction_downtime) * 100
              ).toFixed(2) + "%",
          },
          distributionParams: {
            communityTax:
              parseFloat(distributionData.params.community_tax) * 100 + "%",
            baseProposerReward: distributionData.params.base_proposer_reward,
            bonusProposerReward: distributionData.params.bonus_proposer_reward,
            withdrawAddrEnabled: distributionData.params.withdraw_addr_enabled,
          },
          govParams: {
            votingPeriod:
              parseInt(
                govVotingData.voting_params.voting_period.replace("s", "")
              ) /
                86400 +
              " days",
            minDeposit:
              govDepositData.deposit_params.min_deposit[0]?.amount || "0",
            maxDepositPeriod:
              parseInt(
                govDepositData.deposit_params.max_deposit_period.replace(
                  "s",
                  ""
                )
              ) /
                86400 +
              " days",
            quorum: parseFloat(govTallyData.tally_params.quorum) * 100 + "%",
            threshold:
              parseFloat(govTallyData.tally_params.threshold) * 100 + "%",
            vetoThreshold:
              parseFloat(govTallyData.tally_params.veto_threshold) * 100 + "%",
          },
          appVersion: {
            name: nodeInfoData.application_version.name,
            appName: nodeInfoData.application_version.app_name,
            version: nodeInfoData.application_version.version,
            gitCommit: nodeInfoData.application_version.git_commit,
          },
        });
      } catch (error) {
        console.error("Error fetching parameters:", error);
      }
    };
    console.log("parameters", parameters);
    fetchParameters();
  }, []);

  if (!parameters) return null;

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="px-6">
      <h2
        style={{ color: theme.primaryTextColor }}
        className="text-xl font-semibold mb-4 pt-20"
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
        Staking Parameters
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
        Governance Parameters
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
        Distribution Parameters
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
        Slashing Parameters
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
        Application Versions
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
              Name
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
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
              App_name
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
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
              className="text-lg p-4 shadow-lg"
            >
              Version
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
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
              className="text-lg p-4 shadow-lg"
            >
              Git_commit
            </td>
            <td
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.boxColor,
              }}
              className="text-lg p-4 shadow-lg"
            >
              {parameters.appVersion.gitCommit}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
