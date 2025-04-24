"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useValidators,
  useValidatorIcons,
} from "@/services/queries/validators";
import { Table } from "@/components/ui/Table/Table";
import { useAccount } from "wagmi";
import { useDelegationsQuery } from "@/services/queries/delegations";
import { useCosmosAddress } from "@/services/queries/cosmosAddress";

interface ValidatorTableItem {
  rank: number;
  moniker: string;
  website: string;
  details?: string;
  tokens: string;
  commission: string;
  status: string;
  operatorAddress: string;
}

export function StakingDashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<
    "popular" | "active" | "inactive"
  >("active");
  const [currentPage, setCurrentPage] = useState(1);
  const validatorsPerPage = 10;

  const { data: validatorsData, isLoading } = useValidators();
  const { getValidatorIcon, handleImageError } = useValidatorIcons();
  const { address, isConnected } = useAccount();
  const { data: cosmosAddress } = useCosmosAddress(address);
  const { data: delegationsData } = useDelegationsQuery(cosmosAddress);

  const filteredValidators = useMemo(() => {
    if (!validatorsData) return [];

    switch (activeButton) {
      case "active":
        return validatorsData.active;
      case "inactive":
        return validatorsData.inactive;
      case "popular":
        return validatorsData.active.slice(0, 10);
      default:
        return [];
    }
  }, [activeButton, validatorsData]);

  const totalPages = Math.ceil(filteredValidators.length / validatorsPerPage);
  const currentValidators = filteredValidators.slice(
    (currentPage - 1) * validatorsPerPage,
    currentPage * validatorsPerPage
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDenom = (denom: string) => (denom === "ukii" ? "kii" : denom);

  const validatorColumns = useMemo(
    () => [
      {
        header: "Rank",
        key: "rank",
        render: (item: ValidatorTableItem) => (
          <div
            style={{ color: theme.accentColor }}
            className="font-bold text-4xl text-center"
          >
            {item.rank}
          </div>
        ),
      },
      {
        header: "Validator",
        key: "validator",
        render: (item: ValidatorTableItem) => (
          <div className="flex items-center gap-7">
            <Image
              src={getValidatorIcon(item.website)}
              alt={`${item.moniker} icon`}
              width={40}
              height={40}
              className="rounded-full"
              onError={() => handleImageError(item.website)}
            />
            <div className="flex-1">
              <div
                className="font-medium text-base"
                style={{ color: theme.primaryTextColor }}
              >
                {item.moniker}
              </div>
              <div
                className="text-base pt-1"
                style={{ color: theme.primaryTextColor }}
              >
                {item.website || "No website provided"}
              </div>
              {item.details && (
                <div
                  className="text-base mt-1"
                  style={{ color: theme.secondaryTextColor }}
                >
                  {item.details}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: "Your Stake",
        key: "yourStake",
        render: (item: ValidatorTableItem) => {
          const delegation = delegationsData?.delegation_responses?.find(
            (del) => del.delegation.validator_address === item.operatorAddress
          );

          const amount = delegation?.balance?.amount || "0";
          const formattedAmount = (
            parseInt(amount) / 1000000000000000000
          ).toLocaleString();

          return (
            <div
              className="text-base"
              style={{ color: theme.primaryTextColor }}
            >
              {formattedAmount}{" "}
              {formatDenom(validatorsData?.params.bondDenom || "akii")}
            </div>
          );
        },
      },
      {
        header: "Voting Power",
        key: "votingPower",
        render: (item: ValidatorTableItem) => (
          <div className="text-base" style={{ color: theme.primaryTextColor }}>
            {(parseInt(item.tokens) / 1000000000000000000).toLocaleString()}{" "}
            {formatDenom(validatorsData?.params.bondDenom || "akii")}
          </div>
        ),
      },
      {
        header: "Commission",
        key: "commission",
        render: (item: ValidatorTableItem) => (
          <div style={{ color: theme.primaryTextColor }}>
            {(parseFloat(item.commission) * 100).toFixed(1)}%
          </div>
        ),
      },
      {
        header: "Actions",
        key: "actions",
        render: (item: ValidatorTableItem) => {
          const showActions = isConnected;

          return showActions ? (
            <button
              className="px-4 py-2 rounded-lg text-base"
              style={{
                backgroundColor: theme.boxColor,
                color: theme.accentColor,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                opacity: item.status !== "BOND_STATUS_BONDED" ? 0.5 : 1,
                cursor:
                  item.status !== "BOND_STATUS_BONDED"
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={() => {
                if (item.status === "BOND_STATUS_BONDED") {
                  router.push(`/staking/${item.operatorAddress}`);
                }
              }}
            >
              Manage validator
            </button>
          ) : null;
        },
      },
    ],
    [
      theme,
      router,
      address,
      cosmosAddress,
      validatorsData,
      delegationsData,
      getValidatorIcon,
      handleImageError,
      isConnected,
    ]
  );

  const tableData = currentValidators.map((validator, index) => ({
    rank: (currentPage - 1) * validatorsPerPage + index + 1,
    moniker: validator.description.moniker,
    website: validator.description.website,
    details: validator.description.details,
    tokens: validator.tokens,
    commission: validator.commission.commission_rates.rate,
    status: validator.status,
    operatorAddress: validator.operator_address,
  }));

  if (isLoading) {
    return <div>Loading validators...</div>;
  }

  return (
    <div
      style={{ backgroundColor: theme.bgColor, color: theme.primaryTextColor }}
      className="p-6"
    >
      <div
        style={{
          backgroundColor: theme.boxColor,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="p-6 rounded-xl mb-9 mt-12"
      >
        <div className="grid grid-cols-4 gap-8">
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="13"
              viewBox="0 0 20 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.14343 12.8333C0.651193 12.8333 0.305489 12.6015 0.106322 12.1378C-0.0928461 11.6742 -0.0121947 11.2621 0.348276 10.9015L5.00562 6.2424C5.21388 6.03406 5.46492 5.92043 5.75875 5.90149C6.05258 5.88255 6.31271 5.97724 6.53914 6.18558L9.77656 8.96967L16.1378 2.60604H15.4562C15.1344 2.60604 14.8648 2.49695 14.6475 2.27876C14.4301 2.06058 14.3211 1.79089 14.3203 1.46967C14.3196 1.14846 14.4286 0.878767 14.6475 0.660585C14.8663 0.442404 15.1359 0.333313 15.4562 0.333313H18.8641C19.1859 0.333313 19.4559 0.442404 19.674 0.660585C19.8921 0.878767 20.0008 1.14846 20 1.46967V4.87876C20 5.20073 19.8909 5.47081 19.6728 5.68899C19.4547 5.90717 19.1852 6.01588 18.8641 6.01512C18.543 6.01437 18.2734 5.90528 18.0553 5.68785C17.8372 5.47043 17.7281 5.20073 17.7281 4.87876V4.19694L10.6285 11.2992C10.4203 11.5075 10.1692 11.6212 9.87538 11.6401C9.58156 11.6591 9.32143 11.5644 9.09499 11.356L5.85757 8.57194L1.93859 12.4924C1.84393 12.5871 1.72579 12.6678 1.58418 12.7344C1.44256 12.8011 1.29565 12.8341 1.14343 12.8333Z"
                fill={theme.accentColor}
              />
            </svg>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: theme.primaryTextColor }}
              >
                {validatorsData?.params.unbondingTime}
              </div>
              <div
                className="text-base pt-2"
                style={{ color: theme.secondaryTextColor }}
              >
                Unbonding Time
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6.66665H14.1667V4.99998C14.1667 2.69998 12.3 0.833313 10 0.833313C7.70004 0.833313 5.83337 2.69998 5.83337 4.99998V6.66665H5.00004C4.08337 6.66665 3.33337 7.41665 3.33337 8.33331V16.6666C3.33337 17.5833 4.08337 18.3333 5.00004 18.3333H15C15.9167 18.3333 16.6667 17.5833 16.6667 16.6666V8.33331C16.6667 7.41665 15.9167 6.66665 15 6.66665ZM7.50004 4.99998C7.50004 3.61665 8.61671 2.49998 10 2.49998C11.3834 2.49998 12.5 3.61665 12.5 4.99998V6.66665H7.50004V4.99998ZM15 16.6666H5.00004V8.33331H15V16.6666ZM10 14.1666C10.9167 14.1666 11.6667 13.4166 11.6667 12.5C11.6667 11.5833 10.9167 10.8333 10 10.8333C9.08337 10.8333 8.33337 11.5833 8.33337 12.5C8.33337 13.4166 9.08337 14.1666 10 14.1666Z"
                fill={theme.accentColor}
              />
            </svg>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: theme.primaryTextColor }}
              >
                {validatorsData?.params.minCommissionRate}
              </div>
              <div
                className="text-base pt-2"
                style={{ color: theme.secondaryTextColor }}
              >
                Min Commission Rate
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 7.04167V10.375M6.11 3.28167L3.28167 6.11L3.27833 6.1125C2.9925 6.39833 2.84833 6.5425 2.745 6.71C2.65417 6.85917 2.58667 7.02167 2.54583 7.19167C2.5 7.38333 2.5 7.5875 2.5 7.995V12.005C2.5 12.4125 2.5 12.6158 2.54583 12.8083C2.58681 12.9784 2.6543 13.1409 2.74583 13.29C2.84917 13.4575 2.99333 13.6025 3.28167 13.89L6.11 16.7192C6.39833 17.0075 6.54167 17.1508 6.71 17.2542C6.85917 17.3458 7.02167 17.4125 7.19167 17.4542C7.38333 17.5 7.58667 17.5 7.99333 17.5H12.0067C12.4125 17.5 12.6167 17.5 12.8083 17.4542C12.9783 17.4125 13.1417 17.3458 13.29 17.2542C13.4583 17.1508 13.6025 17.0075 13.89 16.7192L16.7192 13.8908C17.0075 13.6025 17.1517 13.4575 17.2542 13.29C17.3458 13.14 17.4125 12.9783 17.4542 12.8083C17.5 12.6167 17.5 12.4125 17.5 12.005V7.995C17.5 7.5875 17.5 7.38417 17.4533 7.19167C17.4126 7.02166 17.3454 6.85912 17.2542 6.71C17.1517 6.54167 17.0075 6.39833 16.7192 6.11L13.8917 3.28167C13.6033 2.99333 13.4592 2.84833 13.2917 2.74583C13.1423 2.65421 12.9795 2.58671 12.8092 2.54583C12.6167 2.5 12.4125 2.5 12.0042 2.5H7.995C7.58667 2.5 7.38333 2.5 7.19167 2.54583C7.0217 2.58707 6.85919 2.65455 6.71 2.74583C6.54333 2.8475 6.40167 2.99 6.11833 3.27333L6.11 3.28167ZM10.0417 12.875V12.9583H9.95833V12.875H10.0417Z"
                stroke={theme.accentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: theme.primaryTextColor }}
              >
                {validatorsData?.params.bondDenom}
              </div>
              <div
                className="text-base pt-2"
                style={{ color: theme.secondaryTextColor }}
              >
                Bond Denom
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6283 8.33335H4.96167V6.66669H16.6283V8.33335ZM16.6283 13.3334H4.96167V11.6667H16.6283V13.3334Z"
                fill={theme.accentColor}
              />
            </svg>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: theme.primaryTextColor }}
              >
                {validatorsData?.params.maxValidators}
              </div>
              <div
                className="text-base pt-2"
                style={{ color: theme.secondaryTextColor }}
              >
                Max Validators
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mb-9 pl-12">
        <button
          onClick={() => setActiveButton("popular")}
          style={{
            backgroundColor:
              activeButton === "popular" ? theme.boxColor : "transparent",
            color:
              activeButton === "popular"
                ? theme.accentColor
                : theme.secondaryTextColor,
            boxShadow:
              activeButton === "popular"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "none",
          }}
          className="px-4 py-2 rounded-lg flex items-center justify-center hover:text-[#D2AAFA]"
        >
          Popular
        </button>
        <button
          onClick={() => setActiveButton("active")}
          style={{
            backgroundColor:
              activeButton === "active" ? theme.boxColor : "transparent",
            color:
              activeButton === "active"
                ? theme.accentColor
                : theme.secondaryTextColor,
            boxShadow:
              activeButton === "active"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "none",
          }}
          className="px-4 py-2 rounded-lg flex items-center justify-center hover:text-[#D2AAFA]"
        >
          Active
        </button>
        <button
          onClick={() => setActiveButton("inactive")}
          style={{
            backgroundColor:
              activeButton === "inactive" ? theme.boxColor : "transparent",
            color:
              activeButton === "inactive"
                ? theme.accentColor
                : theme.secondaryTextColor,
            boxShadow:
              activeButton === "inactive"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "none",
          }}
          className="px-4 py-2 rounded-lg flex items-center justify-center hover:text-[#D2AAFA]"
        >
          Inactive
        </button>
      </div>

      <div
        style={{
          backgroundColor: theme.boxColor,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="rounded-xl p-8"
      >
        <Table
          columns={validatorColumns}
          data={tableData}
          theme={theme}
          emptyMessage="No validators found"
        />

        <div className="flex justify-between items-center mt-6 px-4">
          <div style={{ color: theme.secondaryTextColor }} className="text-sm">
            Showing {(currentPage - 1) * validatorsPerPage + 1} to{" "}
            {Math.min(
              currentPage * validatorsPerPage,
              filteredValidators.length
            )}{" "}
            of {filteredValidators.length} validators
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg"
              style={{
                backgroundColor: theme.boxColor,
                color:
                  currentPage === 1
                    ? theme.secondaryTextColor
                    : theme.accentColor,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    currentPage === i + 1 ? theme.accentColor : theme.boxColor,
                  color:
                    currentPage === i + 1 ? theme.boxColor : theme.accentColor,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg"
              style={{
                backgroundColor: theme.boxColor,
                color:
                  currentPage === totalPages
                    ? theme.secondaryTextColor
                    : theme.accentColor,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>

        <div className="pr-4 pt-4 mt-12">
          <div
            style={{ color: theme.secondaryTextColor }}
            className="flex gap-4 text-sm"
          >
            <span
              style={{
                backgroundColor: theme.bgColor,
                color: theme.primaryTextColor,
              }}
              className="rounded-lg p-3"
            >
              Top 33%
            </span>
            <span
              style={{
                backgroundColor: theme.bgColor,
                color: theme.primaryTextColor,
              }}
              className="rounded-lg p-3"
            >
              Top 67%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
