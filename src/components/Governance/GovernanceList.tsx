"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  useProposals,
  calculateVotingMetrics,
} from "@/services/queries/governance";
import Link from "next/link";

const GovernanceList = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: proposals = [], isLoading, error } = useProposals(searchTerm);

  const sortedProposals = [...proposals].sort((a, b) => {
    return Number(b.proposal_id) - Number(a.proposal_id);
  });

  return (
    <div className="p-1 rounded-lg">
      <div
        style={{ backgroundColor: theme.boxColor }}
        className="flex justify-between mb-4"
      >
        <div
          className="flex items-center py-1 px-2 rounded-lg"
          style={{ backgroundColor: theme.bgColor }}
        >
          <input
            type="text"
            placeholder="Search Proposal"
            className="p-2 placeholder-custom"
            style={{
              color: theme.primaryTextColor,
              backgroundColor: theme.bgColor,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: theme.primaryTextColor }}>Loading proposals...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error.toString()}</p>
      ) : (
        <div className="grid grid-cols-2 gap-1 text-sm p-1">
          {sortedProposals.map((proposal, index) => {
            const { votingPeriodDays, yesPercentage } =
              calculateVotingMetrics(proposal);

            return (
              <Link
                key={proposal.proposal_id || `proposal-${index}`}
                href={`/governance/${proposal.proposal_id}`}
                className="block"
              >
                <div
                  className="flex items-center p-3 rounded-lg cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: theme.boxColor }}
                >
                  <div
                    className="flex flex-col w-full p-2 rounded-lg"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    {proposal.status === "PROPOSAL_STATUS_PASSED" ||
                    proposal.status === "PROPOSAL_STATUS_REJECTED" ||
                    proposal.status === "PROPOSAL_STATUS_FAILED" ? (
                      <div
                        className="flex items-center w-32 rounded-lg mb-2 text-sm"
                        style={{ backgroundColor: theme.boxColor }}
                      >
                        <div className="pl-4">
                          <svg
                            width="14"
                            height="9"
                            viewBox="0 0 14 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.5668 7.27329L1.94822 4.7897C1.80712 4.65587 1.61575 4.58069 1.4162 4.58069C1.21666 4.58069 1.02529 4.65587 0.884187 4.7897C0.743087 4.92353 0.663818 5.10503 0.663818 5.29429C0.663818 5.388 0.68328 5.4808 0.72109 5.56738C0.758901 5.65395 0.814321 5.73262 0.884187 5.79888L4.03855 8.79065C4.33286 9.06978 4.80828 9.06978 5.10259 8.79065L13.0866 1.21819C13.2277 1.08437 13.307 0.902859 13.307 0.713601C13.307 0.524342 13.2277 0.342835 13.0866 0.209009C12.9455 0.0751829 12.7541 0 12.5546 0C12.355 0 12.1637 0.0751829 12.0226 0.209009L4.5668 7.27329Z"
                              fill={
                                proposal.status === "PROPOSAL_STATUS_PASSED"
                                  ? "#00F9A6"
                                  : "#FF4B4B"
                              }
                            />
                          </svg>
                        </div>
                        <p
                          className="p-1 rounded-lg text-center"
                          style={{
                            backgroundColor: theme.boxColor,
                            color: theme.tertiaryTextColor,
                          }}
                        >
                          {proposal.status === "PROPOSAL_STATUS_PASSED"
                            ? "Passed"
                            : proposal.status === "PROPOSAL_STATUS_REJECTED"
                            ? "Rejected"
                            : "Failed"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2">
                        <div className="pb-2 flex">
                          <p
                            className="py-1 px-2 rounded-lg text-center"
                            style={{ backgroundColor: theme.boxColor }}
                          >
                            {proposal.status ===
                            "PROPOSAL_STATUS_DEPOSIT_PERIOD"
                              ? "Deposit Period"
                              : "Voting Period"}
                          </p>
                        </div>
                        <div className="pb-2 flex">
                          <p
                            className="py-1 px-2 rounded-lg text-center"
                            style={{
                              backgroundColor: theme.boxColor,
                              color: theme.accentColor,
                            }}
                          >
                            {`Expires In: ${votingPeriodDays} days`}
                          </p>
                        </div>
                      </div>
                    )}

                    <h2 className="text-sm">
                      {`#${proposal.proposal_id || "N/A"} ${
                        proposal.content?.title || "No Title"
                      }`}
                    </h2>

                    <div className="mt-2 w-full bg-gray-200 rounded-lg h-3">
                      <div
                        style={{
                          width: `${yesPercentage}%`,
                          backgroundColor: theme.tertiaryTextColor,
                          height: "100%",
                          borderRadius: "inherit",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GovernanceList;
