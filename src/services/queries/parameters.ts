import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

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

export const useChainParameters = () => {
  return useQuery({
    queryKey: ["chain-parameters"],
    queryFn: async (): Promise<ChainParameters> => {
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
          `${CHAIN_LCD_ENDPOINT}/cosmos/base/tendermint/v1beta1/blocks/latest`
        ),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/staking/v1beta1/params`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/slashing/v1beta1/params`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/distribution/v1beta1/params`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/params/voting`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/params/deposit`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/gov/v1beta1/params/tallying`),
        fetch(`${CHAIN_LCD_ENDPOINT}/cosmos/base/tendermint/v1beta1/node_info`),
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

      return {
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
              govDepositData.deposit_params.max_deposit_period.replace("s", "")
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
      };
    },
    staleTime: 30000,
  });
};
