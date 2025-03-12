export const GOVERNANCE_ABI = [
  {
    inputs: [
      { name: "proposalID", type: "uint64" },
      { name: "option", type: "int32" },
    ],
    name: "vote",
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "proposalID", type: "uint64" }],
    name: "deposit",
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;
