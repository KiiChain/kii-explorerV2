"use client";

import { useTheme } from "@/context/ThemeContext";

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

const ProposalDetail = ({ proposal }: ProposalDetailProps) => {
  const { theme } = useTheme();

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
        style={{ backgroundColor: theme.boxColor }}
      >
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl mb-4">
          Tally
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span style={{ color: theme.secondaryTextColor }} className="w-24">
              Turnout
            </span>
            <div
              className="flex-1 rounded-full h-2"
              style={{ backgroundColor: theme.boxColor }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${proposal.tally.turnout}%`,
                  backgroundColor: "#00A3FF",
                }}
              ></div>
            </div>
            <span
              style={{ color: theme.primaryTextColor }}
              className="ml-2 w-16"
            >
              {proposal.tally.turnout}%
            </span>
          </div>
          <div className="flex items-center">
            <span style={{ color: theme.secondaryTextColor }} className="w-24">
              Yes
            </span>
            <div
              className="flex-1 rounded-full h-2"
              style={{ backgroundColor: theme.boxColor }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${proposal.tally.yes}%`,
                  backgroundColor: "#00F9A6",
                }}
              ></div>
            </div>
            <span
              style={{ color: theme.primaryTextColor }}
              className="ml-2 w-16"
            >
              {proposal.tally.yes}%
            </span>
          </div>
          <div className="flex items-center">
            <span style={{ color: theme.secondaryTextColor }} className="w-24">
              No
            </span>
            <div
              className="flex-1 rounded-full h-2"
              style={{ backgroundColor: theme.boxColor }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${proposal.tally.no}%`,
                  backgroundColor: "#FF4B4B",
                }}
              ></div>
            </div>
            <span
              style={{ color: theme.primaryTextColor }}
              className="ml-2 w-16"
            >
              {proposal.tally.no}%
            </span>
          </div>
          <div className="flex items-center">
            <span style={{ color: theme.secondaryTextColor }} className="w-24">
              No With Veto
            </span>
            <span style={{ color: theme.primaryTextColor }} className="ml-2">
              -
            </span>
          </div>
          <div className="flex items-center">
            <span style={{ color: theme.secondaryTextColor }} className="w-24">
              Abstain
            </span>
            <span style={{ color: theme.primaryTextColor }} className="ml-2">
              -
            </span>
          </div>
        </div>

        {/* Vote/Deposit Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            className="flex-1 py-3 rounded-lg text-white"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
            }}
          >
            VOTE
          </button>
          <button
            className="flex-1 py-3 rounded-lg text-white"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.primaryTextColor,
            }}
          >
            DEPOSIT
          </button>
        </div>
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
        <h2 style={{ color: theme.primaryTextColor }} className="text-xl">
          Votes
        </h2>
      </div>
    </div>
  );
};

export default ProposalDetail;
