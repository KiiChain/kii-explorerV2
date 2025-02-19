"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

// Definimos el tipo para las propuestas
interface Proposal {
  proposal_id: string;
  content?: {
    title?: string;
  };
  voting_start_time: string;
  voting_end_time: string;
  final_tally_result?: {
    yes?: string;
    no?: string;
    abstain?: string;
    no_with_veto?: string;
  };
}

const API_BASE_URL = "https://lcd.uno.sentry.testnet.v3.kiivalidator.com";
const GOVERNANCE_ENDPOINT = `${API_BASE_URL}/cosmos/gov/v1beta1/proposals`;

const GovernanceList = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [params, setParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      const response = await axios.get(GOVERNANCE_ENDPOINT);
      setProposals(response.data.proposals || []);
    } catch (err) {
      setError("Error fetching proposals");
      console.error("Error fetching proposals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParams = async (paramsType: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/cosmos/gov/v1beta1/params/${paramsType}`
      );
      setParams(response.data);
      console.log(params);
    } catch (err) {
      setError("Error fetching params");
      console.error("Error fetching params:", err);
    }
  };

  useEffect(() => {
    fetchProposals();
    fetchParams("voting");
  }, []);

  const filteredProposals = proposals.filter((proposal) =>
    proposal.content?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 rounded-lg">
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
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-base p-1">
          {filteredProposals.map((proposal, index) => {
            const votingStartTime = dayjs(proposal.voting_start_time);
            const votingEndTime = dayjs(proposal.voting_end_time);
            const votingPeriodDays = votingEndTime.diff(
              votingStartTime,
              "days"
            );

            const yesVotes = parseInt(proposal.final_tally_result?.yes || "0");
            const noVotes = parseInt(proposal.final_tally_result?.no || "0");
            const abstainVotes = parseInt(
              proposal.final_tally_result?.abstain || "0"
            );
            const noWithVetoVotes = parseInt(
              proposal.final_tally_result?.no_with_veto || "0"
            );

            const totalVotes =
              yesVotes + noVotes + abstainVotes + noWithVetoVotes;
            const yesPercentage = totalVotes
              ? Math.round((yesVotes / totalVotes) * 100)
              : 0;

            return (
              <div
                key={proposal.proposal_id || `proposal-${index}`}
                className="flex items-center p-6 rounded-lg"
              >
                <div
                  className="flex flex-col w-full p-4 rounded-lg"
                  style={{ backgroundColor: theme.bgColor }}
                >
                  {votingPeriodDays === 0 ? (
                    <div
                      className="flex items-center w-32 rounded-lg  mb-2 text-sm"
                      style={{
                        backgroundColor: theme.boxColor,
                      }}
                    >
                      <div className="pl-4">
                        <svg
                          width="14"
                          height="9"
                          viewBox="0 0 14 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path
                            d="M4.5668 7.27329L1.94822 4.7897C1.80712 4.65587 1.61575 4.58069 1.4162 4.58069C1.21666 4.58069 1.02529 4.65587 0.884187 4.7897C0.743087 4.92353 0.663818 5.10503 0.663818 5.29429C0.663818 5.388 0.68328 5.4808 0.72109 5.56738C0.758901 5.65395 0.814321 5.73262 0.884187 5.79888L4.03855 8.79065C4.33286 9.06978 4.80828 9.06978 5.10259 8.79065L13.0866 1.21819C13.2277 1.08437 13.307 0.902859 13.307 0.713601C13.307 0.524342 13.2277 0.342835 13.0866 0.209009C12.9455 0.0751829 12.7541 0 12.5546 0C12.355 0 12.1637 0.0751829 12.0226 0.209009L4.5668 7.27329Z"
                            fill="#00F9A6"
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
                        Passed
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2">
                      <div className="pb-3 flex">
                        <p
                          className="py-2 px-4 rounded-lg text-center"
                          style={{ backgroundColor: theme.boxColor }}
                        >
                          {`Voting Period: ${votingPeriodDays} days`}
                        </p>
                      </div>
                      <div className="pb-3 flex">
                        <p
                          className="py-2 px-4 rounded-lg text-center"
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

                  <h2>{`#${proposal.proposal_id || "N/A"} ${
                    proposal.content?.title || "No Title"
                  }`}</h2>

                  <div className="mt-4 w-full bg-gray-200 rounded-lg h-4">
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GovernanceList;
