export const STAKING_PRECOMPILE_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "validatorAddress",
        type: "string",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "validatorAddress",
        type: "string",
      },
    ],
    name: "undelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "srcValidatorAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "dstValidatorAddress",
        type: "string",
      },
    ],
    name: "redelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const STAKING_PRECOMPILE_ADDRESS =
  "0x0000000000000000000000000000000000000800";
