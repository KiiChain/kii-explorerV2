"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";
import { useState } from "react";

interface ProposalDetailProps {
  proposal: {
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    plan: {
      name: string;
      time: string;
      height: string;
      info: string;
      upgradedClientState: string;
    };
    tally: {
      turnout: number;
      yes: number;
      no: number;
      noWithVeto: number;
      abstain: number;
    };
    timeline: {
      submitted: string;
      deposited: string;
      votingStart: string;
      votingEnd: string;
      upgradePlan: string;
    };
  };
}

const GOVERNANCE_ABI = [
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

const ProposalDetail = ({ proposal }: ProposalDetailProps) => {
  const { theme } = useTheme();
  const { address } = useAccount();

  const {
    writeContract,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  const [voteSuccess, setVoteSuccess] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleVote = async () => {
    if (!address) return;
    try {
      setVoteSuccess(false);
      await writeContract({
        address: "0x0000000000000000000000000000000000001006",
        abi: GOVERNANCE_ABI,
        functionName: "vote",
        args: [BigInt(proposal.id), 1],
      });
      setVoteSuccess(true);
      setTimeout(() => setVoteSuccess(false), 2000);
    } catch (error) {
      console.error("Error initiating vote:", error);
    }
  };

  const handleDeposit = async () => {
    if (!address) return;
    try {
      setDepositSuccess(false);
      await writeContract({
        address: "0x0000000000000000000000000000000000001006",
        abi: GOVERNANCE_ABI,
        functionName: "deposit",
        args: [BigInt(proposal.id)],
        value: parseEther("1"),
      });
      setDepositSuccess(true);
      setTimeout(() => setDepositSuccess(false), 2000);
    } catch (error) {
      console.error("Error initiating deposit:", error);
    }
  };

  return (
    <div className="space-y-4 p-12">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: theme.boxColor,
          color: theme.bgColor,
        }}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl" style={{ color: theme.primaryTextColor }}>
            {proposal.id}. {proposal.title}
          </h1>
          <span
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.bgColor,
            }}
          >
            PASSED
          </span>
        </div>

        {/* Basic Info Section */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="space-y-4">
            <div className="flex">
              <span style={{ color: theme.secondaryTextColor }}>@Type</span>
              <span style={{ color: theme.primaryTextColor }} className="ml-4">
                {proposal.type}
              </span>
            </div>
            <div className="flex">
              <span style={{ color: theme.secondaryTextColor }}>Title</span>
              <span style={{ color: theme.primaryTextColor }} className="ml-4">
                {proposal.title}
              </span>
            </div>
            <div className="flex">
              <span style={{ color: theme.secondaryTextColor }}>
                Description
              </span>
              <span style={{ color: theme.primaryTextColor }} className="ml-4">
                {proposal.description}
              </span>
            </div>
          </div>
          {/* Plan Table */}
          <div className="mt-6">
            <table className="w-full">
              <thead>
                <tr style={{ color: theme.secondaryTextColor }}>
                  <th className="text-left">Name</th>
                  <th className="text-left">Time</th>
                  <th className="text-left">Height</th>
                  <th className="text-left">Info</th>
                  <th className="text-left">Upgraded_client_state</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: theme.primaryTextColor }}>
                  <td>v2.0.0</td>
                  <td>{proposal.plan?.time || "-"}</td>
                  <td>{proposal.plan?.height || "-"}</td>
                  <td>{proposal.plan?.info || "-"}</td>
                  <td>{proposal.plan?.upgradedClientState || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tally Section */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: theme.bgColor }}
      >
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl mb-4">
          Tally
        </h2>
        <div className="space-y-4">
          {/* Turnout */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: theme.secondaryTextColor }}>Turnout</span>
              <span style={{ color: theme.primaryTextColor }}>
                {proposal.tally.turnout}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal.tally.turnout, 100)}%`,
                  backgroundColor: "#00A3FF",
                }}
              />
            </div>
          </div>

          {/* Yes */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: theme.secondaryTextColor }}>Yes</span>
              <span style={{ color: theme.primaryTextColor }}>
                {proposal.tally.yes}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal.tally.yes, 100)}%`,
                  backgroundColor: "#00F9A6",
                }}
              />
            </div>
          </div>

          {/* No */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: theme.secondaryTextColor }}>No</span>
              <span style={{ color: theme.primaryTextColor }}>
                {proposal.tally.no}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal.tally.no, 100)}%`,
                  backgroundColor: "#FF4B4B",
                }}
              />
            </div>
          </div>

          {/* No With Veto */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: theme.secondaryTextColor }}>
                No With Veto
              </span>
              <span style={{ color: theme.primaryTextColor }}>-</span>
            </div>
          </div>

          {/* Abstain */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: theme.secondaryTextColor }}>Abstain</span>
              <span style={{ color: theme.primaryTextColor }}>-</span>
            </div>
          </div>
        </div>

        {/* Vote/Deposit Buttons */}
        <div className="flex space-x-4 mt-6">
          {!address ? (
            <WagmiConnectButton />
          ) : (
            <>
              <button
                className="flex-1 py-3 rounded-lg text-white"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.primaryTextColor,
                  opacity: isWritePending ? 0.7 : 1,
                }}
                onClick={handleVote}
                disabled={isWritePending}
              >
                {isWritePending
                  ? "Processing..."
                  : voteSuccess
                  ? "Transaction Successful!"
                  : "VOTE"}
              </button>
              <button
                className="flex-1 py-3 rounded-lg text-white"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.primaryTextColor,
                  opacity: isWritePending ? 0.7 : 1,
                }}
                onClick={handleDeposit}
                disabled={isWritePending}
              >
                {isWritePending
                  ? "Processing..."
                  : depositSuccess
                  ? "Transaction Successful!"
                  : "DEPOSIT"}
              </button>
            </>
          )}
        </div>

        {/* Mensajes de error */}
        {isWriteError && (
          <div className="mt-2 text-red-500">
            {writeError?.message || "Error en la transacción"}
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl mb-4">
          Timeline
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Submitted at: {proposal.timeline.submitted}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>10 days ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Deposited at: {proposal.timeline.deposited}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>10 days ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Voting start from {proposal.timeline.votingStart}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>10 days ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Voting end {proposal.timeline.votingEnd}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>10 days ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Upgrade Plan: (EST) {proposal.timeline.upgradePlan}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>10 days ago</span>
          </div>
        </div>
      </div>

      {/* Votes Section */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl mb-4">
          Votes
        </h2>
        {address ? (
          <div className="flex items-center space-x-4">
            <span style={{ color: theme.secondaryTextColor }}>
              Your address:
            </span>
            <span style={{ color: theme.primaryTextColor }}>{address}</span>
            <span
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.bgColor,
              }}
            >
              YES
            </span>
          </div>
        ) : (
          <div style={{ color: theme.secondaryTextColor }}>
            Connect your wallet to see your votes
          </div>
        )}
      </div>

      {/* JSON Data Section */}
      <div
        className="rounded-lg p-6 mt-4"
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl mb-4">
          Proposal JSON Data
        </h2>
        <pre
          className="overflow-auto p-4 rounded"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.primaryTextColor,
          }}
        >
          {JSON.stringify(proposal, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ProposalDetail;
