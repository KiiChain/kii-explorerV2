import { useReadContract } from "wagmi";

const STAKING_PRECOMPILE_ADDRESS = "0x0000000000000000000000000000000000001005";

const stakingABI = [
  "function delegation(address delegator, string memory valAddress) external view returns (tuple(uint256 amount, string denom, tuple(string delegator_address, uint256 shares, uint256 decimals, string validator_address) delegation))",
];

interface DelegationDetails {
  delegator_address: string;
  shares: number;
  decimals: number;
  validator_address: string;
}

interface Balance {
  amount: number;
  denom: string;
}

interface Delegation {
  balance: Balance;
  delegation: DelegationDetails;
}

function useStakingQueries(
  delegatorAddress: string,
  validatorAddresses: string[]
) {
  const validatorAddress = validatorAddresses[0] || "";

  const {
    data,
    error: isError,
    isLoading,
  } = useReadContract({
    address: STAKING_PRECOMPILE_ADDRESS,
    abi: stakingABI,
    functionName: "delegation",
    args: [delegatorAddress, validatorAddress],
  } as const);

  if (isLoading || isError || !data) {
    return {
      delegations: [],
      loading: isLoading,
      error: isError,
    };
  }

  const delegation = data as Delegation;

  return {
    delegations: [
      {
        validator: delegation.delegation.validator_address,
        amount: delegation.balance.amount.toString(),
        rewards: "0",
      },
    ],
    loading: false,
    error: null,
  };
}

export default useStakingQueries;
