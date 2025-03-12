"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAccount, useWriteContract } from "wagmi";

import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";

import { formatDistanceToNow, formatDistance } from "date-fns";

import { useProposalDetail } from "@/services/hooks/useProposalDetail";

interface ProposalDetailProps {
  proposalId: string;
}

const ProposalDetail = ({ proposalId }: ProposalDetailProps) => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { isError: isWriteError, error: writeError } = useWriteContract();

  const {
    proposal,
    isLoading,
    error,
    voteStatus: proposalVoteStatus,
    isWritePending: proposalIsWritePending,
    voteSuccess: proposalVoteSuccess,
    depositSuccess: proposalDepositSuccess,
    canVote: canVoteProposal,
    canDeposit: canDepositProposal,
    handleVote: handleVoteProposal,
    handleDeposit: handleDepositProposal,
  } = useProposalDetail(proposalId);

  const getTimeAgo = (timestamp: string) => {
    try {
      if (!timestamp) return "Unknown date";

      if (timestamp.includes("T")) {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid date";

        const now = new Date();

        if (date > now) {
          return `in ${formatDistance(now, date)}`;
        }
        return formatDistanceToNow(date, { addSuffix: true });
      }

      const timestampNum = parseInt(timestamp, 10);
      if (isNaN(timestampNum)) return "Invalid date";

      const milliseconds =
        timestampNum.toString().length > 13
          ? Math.floor(timestampNum / 1000000)
          : timestampNum;

      const date = new Date(milliseconds);
      if (isNaN(date.getTime())) return "Invalid date";

      const now = new Date();
      if (date > now) {
        return `in ${formatDistance(now, date)}`;
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span style={{ color: theme.primaryTextColor }}>
          Error loading proposal data
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span style={{ color: theme.primaryTextColor }}>
          Loading proposal data...
        </span>
      </div>
    );
  }

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
            {proposal?.id}. {proposal?.title || "Untitled"}
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
                {proposal?.type || "N/A"}
              </span>
            </div>
            <div className="flex">
              <span style={{ color: theme.secondaryTextColor }}>Title</span>
              <span style={{ color: theme.primaryTextColor }} className="ml-4">
                {proposal?.title || "N/A"}
              </span>
            </div>
            <div className="flex">
              <span style={{ color: theme.secondaryTextColor }}>
                Description
              </span>
              <span style={{ color: theme.primaryTextColor }} className="ml-4">
                {proposal?.description || "N/A"}
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
                  <td>{proposal?.plan?.time || "-"}</td>
                  <td>{proposal?.plan?.height || "-"}</td>
                  <td>{proposal?.plan?.info || "-"}</td>
                  <td>{proposal?.plan?.upgradedClientState || "-"}</td>
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
                {proposal?.tally?.turnout}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal?.tally?.turnout ?? 0, 100)}%`,
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
                {proposal?.tally?.yes}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal?.tally?.yes ?? 0, 100)}%`,
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
                {proposal?.tally?.no}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(proposal?.tally?.no ?? 0, 100)}%`,
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
                className={`flex-1 py-3 rounded-lg text-white ${
                  !canVoteProposal && "opacity-50"
                }`}
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.primaryTextColor,
                  opacity: proposalIsWritePending ? 0.7 : 1,
                }}
                onClick={handleVoteProposal}
                disabled={proposalIsWritePending}
              >
                {proposalIsWritePending
                  ? "Processing..."
                  : proposalVoteSuccess
                  ? "Transaction Successful!"
                  : "VOTE"}
              </button>
              <button
                className={`flex-1 py-3 rounded-lg text-white ${
                  !canDepositProposal && "opacity-50"
                }`}
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.primaryTextColor,
                  opacity: proposalIsWritePending ? 0.7 : 1,
                }}
                onClick={handleDepositProposal}
                disabled={proposalIsWritePending}
              >
                {proposalIsWritePending
                  ? "Processing..."
                  : proposalDepositSuccess
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
                Submitted at: {proposal?.timeline?.submitted}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>
              {getTimeAgo(proposal?.timeline?.submitted ?? "")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Deposit Ends At: {proposal?.timeline?.deposited}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>
              {getTimeAgo(proposal?.timeline?.deposited ?? "")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Voting start from {proposal?.timeline?.votingStart}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>
              {getTimeAgo(proposal?.timeline?.votingStart ?? "")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Voting end {proposal?.timeline?.votingEnd}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>
              {getTimeAgo(proposal?.timeline?.votingEnd ?? "")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span style={{ color: theme.accentColor }}>•</span>
              <span
                style={{ color: theme.secondaryTextColor }}
                className="ml-2"
              >
                Upgrade Plan: (EST) {proposal?.timeline?.upgradePlan}
              </span>
            </div>
            <span style={{ color: theme.secondaryTextColor }}>
              {getTimeAgo(proposal?.timeline?.upgradePlan ?? "")}
            </span>
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
        {!address ? (
          <div style={{ color: theme.secondaryTextColor }}>
            Connect your wallet to see your votes
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span style={{ color: theme.secondaryTextColor }}>
              Your address:
            </span>
            <span style={{ color: theme.primaryTextColor }}>{address}</span>
            {proposalVoteStatus.hasVoted ? (
              <span
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.bgColor,
                }}
              >
                {proposalVoteStatus.voteOption}
              </span>
            ) : (
              <span
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme.secondaryTextColor,
                  color: theme.bgColor,
                }}
              >
                NOT VOTED
              </span>
            )}
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
