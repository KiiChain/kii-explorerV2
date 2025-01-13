"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

import { useEffect, useState } from "react";

interface Validator {
  moniker: string;
  operatorAddress: string;
  website?: string;
  tokens: string;
  selfBonded?: string;
  commission: string;
}

export default function ValidatorPage({
  params,
}: {
  params: Promise<{ validatorId: string }>;
}) {
  const { validatorId } = React.use(params);
  const { theme } = useTheme();

  const [validator, setValidator] = useState<Validator | null>(null);

  useEffect(() => {
    const fetchValidator = async () => {
      try {
        const response = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators/${validatorId}`
        );
        const data = await response.json();
        const validatorData = data.validator;

        setValidator({
          moniker: validatorData.description.moniker,
          operatorAddress: validatorData.operator_address,
          website: validatorData.description.website,
          tokens: parseInt(validatorData.tokens).toLocaleString(),
          commission: `${
            parseFloat(validatorData.commission.commission_rates.rate) * 100
          }%`,
        });
      } catch (error) {
        console.error("Error fetching validator:", error);
      }
    };

    fetchValidator();
  }, [validatorId]);

  if (!validator) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="px-6">
        <div
          className="grid grid-cols-2 gap-6 w-full px-6 h-full rounded-xl"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex flex-col items-start gap-4 p-6 h-full">
            <div className="flex gap-4">
              <div className="w-1/3">
                <div className="relative w-28 h-28">
                  <div
                    style={{ backgroundColor: theme.primaryTextColor }}
                    className="w-full h-full rounded-full"
                  />
                  <div className="pl-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                      width="47"
                      height="29"
                      viewBox="0 0 47 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.94615 0H0V29H2.94615V0ZM28.716 11.7773C27.2653 10.3989 27.2697 8.1597 28.716 6.78561L33.3317 2.40041H40.9113L30.7694 12.036L32.5505 13.7324L47 0H21.1408L10.7356 9.88579V0H7.78944V29H10.7356V19.2584L20.9891 29H46.8348L28.716 11.7773ZM15.7887 15.6748C15.6503 15.8062 15.5208 15.9462 15.3959 16.0861C15.3601 16.1243 15.3334 16.1625 15.2977 16.2049C15.2039 16.3152 15.1191 16.4297 15.0343 16.5442C15.0075 16.5823 14.9807 16.6205 14.9539 16.6587C14.8602 16.7944 14.7754 16.9301 14.695 17.0743C14.6861 17.0913 14.6772 17.1082 14.6682 17.1209C14.3915 17.6214 14.1951 18.1557 14.079 18.7113C14.079 18.724 14.0746 18.741 14.0701 18.7537C14.0522 18.8343 14.0344 18.9106 14.021 18.9912L11.9944 17.0658C11.2936 16.4 10.9052 15.5136 10.9052 14.5679C10.9052 13.6221 11.2936 12.7357 11.9944 12.0699L22.1854 2.39617H29.765L15.7887 15.6748ZM22.0336 26.6038C22.0336 26.6038 17.3957 22.1889 17.3198 22.0956C17.3109 22.0829 17.3019 22.0744 17.293 22.0617C16.2931 20.87 16.2217 19.199 17.0877 17.9395C17.0877 17.9352 17.0966 17.9267 17.1011 17.9183C17.1591 17.8377 17.2216 17.7571 17.2841 17.6808C17.2975 17.6638 17.3109 17.6468 17.3242 17.6299C17.4001 17.5408 17.4805 17.456 17.5653 17.3754C17.5653 17.3754 17.5698 17.3669 17.5742 17.3669L19.6008 15.4415C19.6097 15.5009 19.6231 15.5603 19.6365 15.6196C19.6499 15.6832 19.6588 15.7469 19.6722 15.8105C19.699 15.9377 19.7347 16.0607 19.7704 16.1837C19.7838 16.2303 19.7972 16.2812 19.8106 16.3279C19.8642 16.4975 19.9267 16.6629 19.9981 16.8241C20.016 16.8622 20.0338 16.8962 20.0517 16.9343C20.1097 17.0616 20.1722 17.1846 20.2391 17.3075C20.2704 17.3627 20.3016 17.4136 20.3329 17.4687C20.3954 17.5705 20.4579 17.6723 20.5248 17.7741C20.5605 17.8292 20.6007 17.8843 20.6364 17.9352C20.7079 18.037 20.7882 18.1345 20.8686 18.2321C20.9043 18.2745 20.94 18.3211 20.9802 18.3636C21.1007 18.5035 21.2301 18.635 21.364 18.7665L29.6177 26.6081H22.0381L22.0336 26.6038ZM23.1451 17.0701C22.4443 16.4042 22.0559 15.5178 22.0559 14.5721C22.0559 13.6264 22.4443 12.74 23.1451 12.0741L25.1762 10.1445C25.3637 11.3617 25.9484 12.5322 26.9349 13.4694L40.7506 26.6038H33.1799L23.1451 17.0701Z"
                        fill="#05000F"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-2/3">
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: theme.primaryTextColor }}
                >
                  {validator.moniker}
                </h2>
                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: theme.secondaryTextColor }}
                >
                  {validator.operatorAddress}
                </p>
                <div className="pt-4">
                  <button
                    className="text-lg p-2 rounded-lg"
                    style={{
                      backgroundColor: theme.bgColor,
                      color: theme.accentColor,
                    }}
                  >
                    Create Stake
                  </button>
                </div>
              </div>
            </div>
            {validator.website && (
              <a
                href={validator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: theme.accentColor }}
              ></a>
            )}
            <div className="flex flex-col gap-4 mt-4">
              <a
                href="#"
                className="text-lg flex items-center gap-2"
                style={{ color: theme.primaryTextColor }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_810_4212)">
                    <path
                      d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                      stroke="#D2AAFA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 16.5C10.6569 16.5 12 13.1421 12 9C12 4.85786 10.6569 1.5 9 1.5C7.34315 1.5 6 4.85786 6 9C6 13.1421 7.34315 16.5 9 16.5Z"
                      stroke="#D2AAFA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.5 9H16.5"
                      stroke="#D2AAFA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_810_4212">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Website:
                <p
                  className="text-base underline"
                  style={{ color: theme.primaryTextColor }}
                >
                  https://app.kiichain.io
                </p>
              </a>

              <a
                href="#"
                className="text-lg flex items-center gap-2"
                style={{ color: theme.primaryTextColor }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 3.5V11.5C2 11.7652 2.10536 12.0196 2.29289 12.2071C2.48043 12.3946 2.73478 12.5 3 12.5H13C13.2652 12.5 13.5196 12.3946 13.7071 12.2071C13.8946 12.0196 14 11.7652 14 11.5V3.5H2ZM2 2.5H14C14.2652 2.5 14.5196 2.60536 14.7071 2.79289C14.8946 2.98043 15 3.23478 15 3.5V11.5C15 12.0304 14.7893 12.5391 14.4142 12.9142C14.0391 13.2893 13.5304 13.5 13 13.5H3C2.46957 13.5 1.96086 13.2893 1.58579 12.9142C1.21071 12.5391 1 12.0304 1 11.5V3.5C1 3.23478 1.10536 2.98043 1.29289 2.79289C1.48043 2.60536 1.73478 2.5 2 2.5Z"
                    fill="#D2AAFA"
                  />
                  <path
                    d="M14.125 3.5L10.258 7.92C9.97642 8.24189 9.62927 8.49986 9.23984 8.67661C8.8504 8.85336 8.42767 8.94479 8 8.94479C7.57233 8.94479 7.1496 8.85336 6.76016 8.67661C6.37073 8.49986 6.02358 8.24189 5.742 7.92L1.875 3.5H14.125ZM3.204 3.5L6.494 7.261C6.68172 7.47565 6.91317 7.64768 7.17283 7.76554C7.43248 7.88341 7.71434 7.94439 7.9995 7.94439C8.28466 7.94439 8.56651 7.88341 8.82617 7.76554C9.08583 7.64768 9.31728 7.47565 9.505 7.261L12.796 3.5H3.204Z"
                    fill="#D2AAFA"
                  />
                </svg>
                Contact:
                <p
                  className="text-base underline"
                  style={{ color: theme.primaryTextColor }}
                >
                  support@kiichain.io
                </p>
              </a>
              <div className="flex items-center gap-2 pt-2 pl-1">
                <p
                  className="text-lg"
                  style={{ color: theme.primaryTextColor }}
                >
                  Validator Status
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8368 9.33334C12.2344 9.33369 12.6156 9.49188 12.8966 9.77315C13.1776 10.0544 13.3354 10.4357 13.3354 10.8333V11.2167C13.3354 11.8127 13.1221 12.3893 12.7354 12.842C11.6888 14.064 10.0974 14.6673 8.0001 14.6673C5.90277 14.6673 4.3121 14.064 3.2681 12.8407C2.88184 12.3882 2.66957 11.8129 2.66943 11.218V10.8327C2.66961 10.4351 2.82763 10.0538 3.10877 9.77268C3.38991 9.49154 3.77117 9.33351 4.16877 9.33334H11.8368ZM11.8368 10.3333H4.1681C4.03549 10.3333 3.90832 10.386 3.81455 10.4798C3.72078 10.5736 3.6681 10.7007 3.6681 10.8333V11.218C3.6681 11.5747 3.7961 11.92 4.0281 12.1913C4.86343 13.1707 6.17477 13.6673 7.99943 13.6673C9.82543 13.6673 11.1368 13.1707 11.9748 12.192C12.2072 11.9202 12.3349 11.5743 12.3348 11.2167V10.8327C12.3346 10.7004 12.282 10.5736 12.1886 10.48C12.0951 10.3864 11.969 10.3337 11.8368 10.3333ZM8.0001 1.33667C8.43784 1.33667 8.87129 1.42289 9.27571 1.5904C9.68013 1.75792 10.0476 2.00345 10.3571 2.31298C10.6667 2.62251 10.9122 2.98997 11.0797 3.39439C11.2472 3.79881 11.3334 4.23226 11.3334 4.67C11.3334 5.10774 11.2472 5.5412 11.0797 5.94561C10.9122 6.35003 10.6667 6.7175 10.3571 7.02703C10.0476 7.33655 9.68013 7.58209 9.27571 7.7496C8.87129 7.91712 8.43784 8.00334 8.0001 8.00334C7.11605 8.00334 6.2682 7.65215 5.64308 7.02703C5.01796 6.4019 4.66677 5.55406 4.66677 4.67C4.66677 3.78595 5.01796 2.9381 5.64308 2.31298C6.2682 1.68786 7.11605 1.33667 8.0001 1.33667ZM8.0001 2.33667C7.69368 2.33667 7.39027 2.39702 7.10717 2.51428C6.82408 2.63155 6.56685 2.80342 6.35018 3.02009C6.13351 3.23676 5.96164 3.49398 5.84438 3.77708C5.72712 4.06017 5.66677 4.36359 5.66677 4.67C5.66677 4.97642 5.72712 5.27984 5.84438 5.56293C5.96164 5.84602 6.13351 6.10325 6.35018 6.31992C6.56685 6.53659 6.82408 6.70846 7.10717 6.82572C7.39027 6.94298 7.69368 7.00334 8.0001 7.00334C8.61894 7.00334 9.21243 6.7575 9.65002 6.31992C10.0876 5.88233 10.3334 5.28884 10.3334 4.67C10.3334 4.05116 10.0876 3.45767 9.65002 3.02009C9.21243 2.5825 8.61894 2.33667 8.0001 2.33667Z"
                    fill="#D2AAFA"
                  />
                </svg>
                <p
                  className="text-lg"
                  style={{ color: theme.primaryTextColor }}
                >
                  Status:
                </p>
                <p
                  className="text-lg underline"
                  style={{ color: theme.primaryTextColor }}
                >
                  Bonded
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.49992 10.625H8.50559M8.49992 4.95837V8.50004M2.83325 7.9702C2.83325 13.4152 7.7335 15.3277 8.41988 15.5692C8.47324 15.5881 8.5266 15.5881 8.57996 15.5692C9.26775 15.3355 14.1666 13.4711 14.1666 7.97091V3.04871C14.1667 2.9854 14.1457 2.92387 14.1068 2.87393C14.0679 2.82399 14.0134 2.78851 13.952 2.77316L8.56863 1.42521C8.52352 1.41393 8.47632 1.41393 8.43121 1.42521L3.04788 2.77316C2.98646 2.78851 2.93196 2.82399 2.89306 2.87393C2.85416 2.92387 2.8331 2.9854 2.83325 3.04871V7.9702Z"
                    stroke="#D2AAFA"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p
                  className="text-lg"
                  style={{ color: theme.primaryTextColor }}
                >
                  Jailed: -
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="py-6">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 8 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.666748 8.5H2.00008C2.00008 9.22 2.91341 9.83333 4.00008 9.83333C5.08675 9.83333 6.00008 9.22 6.00008 8.5C6.00008 7.76667 5.30675 7.5 3.84008 7.14667C2.42675 6.79333 0.666748 6.35333 0.666748 4.5C0.666748 3.30667 1.64675 2.29333 3.00008 1.95333V0.5H5.00008V1.95333C6.35341 2.29333 7.33341 3.30667 7.33341 4.5H6.00008C6.00008 3.78 5.08675 3.16667 4.00008 3.16667C2.91341 3.16667 2.00008 3.78 2.00008 4.5C2.00008 5.23333 2.69341 5.5 4.16008 5.85333C5.57341 6.20667 7.33341 6.64667 7.33341 8.5C7.33341 9.69333 6.35341 10.7067 5.00008 11.0467V12.5H3.00008V11.0467C1.64675 10.7067 0.666748 9.69333 0.666748 8.5Z"
                        fill="#D2AAFA"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Total Bonded Tokens
                    </div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.tokens} KII
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-lg mt-1"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.6666 3.83331L3.33325 13.1666M11.3333 13.1666C10.9796 13.1666 10.6405 13.0262 10.3904 12.7761C10.1404 12.5261 9.99992 12.1869 9.99992 11.8333C9.99992 11.4797 10.1404 11.1406 10.3904 10.8905C10.6405 10.6405 10.9796 10.5 11.3333 10.5C11.6869 10.5 12.026 10.6405 12.2761 10.8905C12.5261 11.1406 12.6666 11.4797 12.6666 11.8333C12.6666 12.1869 12.5261 12.5261 12.2761 12.7761C12.026 13.0262 11.6869 13.1666 11.3333 13.1666ZM4.66659 6.49998C4.31296 6.49998 3.97382 6.3595 3.72378 6.10946C3.47373 5.85941 3.33325 5.52027 3.33325 5.16665C3.33325 4.81302 3.47373 4.47389 3.72378 4.22384C3.97382 3.97379 4.31296 3.83331 4.66659 3.83331C5.02021 3.83331 5.35935 3.97379 5.60939 4.22384C5.85944 4.47389 5.99992 4.81302 5.99992 5.16665C5.99992 5.52027 5.85944 5.85941 5.60939 6.10946C5.35935 6.3595 5.02021 6.49998 4.66659 6.49998Z"
                        stroke="#E0B1FF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Self Bonded
                    </div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.selfBonded || "100,000 KII"} (
                      {(
                        (parseFloat(validator.selfBonded || "100000") /
                          parseFloat(validator.tokens.replace(/,/g, ""))) *
                        100
                      ).toFixed(1)}
                      %)
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-lg mt-1"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8368 9.83334C12.2344 9.83369 12.6156 9.99188 12.8966 10.2731C13.1776 10.5544 13.3354 10.9357 13.3354 11.3333V11.7167C13.3354 12.3127 13.1221 12.8893 12.7354 13.342C11.6888 14.564 10.0974 15.1673 8.0001 15.1673C5.90277 15.1673 4.3121 14.564 3.2681 13.3407C2.88184 12.8882 2.66957 12.3129 2.66943 11.718V11.3327C2.66961 10.9351 2.82763 10.5538 3.10877 10.2727C3.38991 9.99154 3.77117 9.83351 4.16877 9.83334H11.8368ZM11.8368 10.8333H4.1681C4.03549 10.8333 3.90832 10.886 3.81455 10.9798C3.72078 11.0736 3.6681 11.2007 3.6681 11.3333V11.718C3.6681 12.0747 3.7961 12.42 4.0281 12.6913C4.86343 13.6707 6.17477 14.1673 7.99943 14.1673C9.82543 14.1673 11.1368 13.6707 11.9748 12.692C12.2072 12.4202 12.3349 12.0743 12.3348 11.7167V11.3327C12.3346 11.2004 12.282 11.0736 12.1886 10.98C12.0951 10.8864 11.969 10.8337 11.8368 10.8333ZM8.0001 1.83667C8.43784 1.83667 8.87129 1.92289 9.27571 2.0904C9.68013 2.25792 10.0476 2.50345 10.3571 2.81298C10.6667 3.12251 10.9122 3.48997 11.0797 3.89439C11.2472 4.29881 11.3334 4.73226 11.3334 5.17C11.3334 5.60774 11.2472 6.0412 11.0797 6.44561C10.9122 6.85003 10.6667 7.2175 10.3571 7.52703C10.0476 7.83655 9.68013 8.08209 9.27571 8.2496C8.87129 8.41712 8.43784 8.50334 8.0001 8.50334C7.11605 8.50334 6.2682 8.15215 5.64308 7.52703C5.01796 6.9019 4.66677 6.05406 4.66677 5.17C4.66677 4.28595 5.01796 3.4381 5.64308 2.81298C6.2682 2.18786 7.11605 1.83667 8.0001 1.83667ZM8.0001 2.83667C7.69368 2.83667 7.39027 2.89702 7.10717 3.01428C6.82408 3.13155 6.56685 3.30342 6.35018 3.52009C6.13351 3.73676 5.96164 3.99398 5.84438 4.27708C5.72712 4.56017 5.66677 4.86359 5.66677 5.17C5.66677 5.47642 5.72712 5.77984 5.84438 6.06293C5.96164 6.34602 6.13351 6.60325 6.35018 6.81992C6.56685 7.03659 6.82408 7.20846 7.10717 7.32572C7.39027 7.44298 7.69368 7.50334 8.0001 7.50334C8.61894 7.50334 9.21243 7.2575 9.65002 6.81992C10.0876 6.38233 10.3334 5.78884 10.3334 5.17C10.3334 4.55116 10.0876 3.95767 9.65002 3.52009C9.21243 3.0825 8.61894 2.83667 8.0001 2.83667Z"
                        fill="#D2AAFA"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    ></div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.tokens} KII
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      99.86%
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="p-3 rounded-lg mt-1"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.914746 13.1666C0.520954 13.1666 0.244392 12.9812 0.0850573 12.6103C-0.0742768 12.2393 -0.00975576 11.9096 0.278621 11.6212L4.0045 7.89389C4.1711 7.72723 4.37193 7.63632 4.607 7.62117C4.84206 7.60601 5.05016 7.68177 5.23131 7.84844L7.82125 10.0757L12.9102 4.98481H12.365C12.1075 4.98481 11.8918 4.89753 11.718 4.72299C11.5441 4.54844 11.4569 4.33268 11.4562 4.07572C11.4556 3.81875 11.5429 3.60299 11.718 3.42844C11.8931 3.2539 12.1087 3.16663 12.365 3.16663H15.0912C15.3487 3.16663 15.5647 3.2539 15.7392 3.42844C15.9137 3.60299 16.0006 3.81875 16 4.07572V6.80298C16 7.06056 15.9128 7.27662 15.7383 7.45117C15.5638 7.62571 15.3481 7.71268 15.0912 7.71208C14.8344 7.71147 14.6187 7.6242 14.4442 7.45026C14.2697 7.27632 14.1825 7.06056 14.1825 6.80298V6.25753L8.50281 11.9393C8.3362 12.106 8.13537 12.1969 7.90031 12.2121C7.66524 12.2272 7.45714 12.1515 7.276 11.9848L4.68606 9.75753L1.55087 12.8939C1.47514 12.9696 1.38063 13.0342 1.26734 13.0875C1.15405 13.1409 1.03652 13.1672 0.914746 13.1666Z"
                        fill="#E0B1FF"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    ></div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.tokens} KII
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      99.86%
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-lg mt-1"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.33341 7.16663L8.00008 11.1666L10.6667 7.16663"
                        stroke="#D2AAFA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      Commission
                    </div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.commission}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="p-3 rounded-lg mt-1"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 8.5C2 9.28793 2.15519 10.0681 2.45672 10.7961C2.75825 11.5241 3.20021 12.1855 3.75736 12.7426C4.31451 13.2998 4.97595 13.7417 5.7039 14.0433C6.43185 14.3448 7.21207 14.5 8 14.5C8.78793 14.5 9.56815 14.3448 10.2961 14.0433C11.0241 13.7417 11.6855 13.2998 12.2426 12.7426C12.7998 12.1855 13.2417 11.5241 13.5433 10.7961C13.8448 10.0681 14 9.28793 14 8.5C14 6.9087 13.3679 5.38258 12.2426 4.25736C11.1174 3.13214 9.5913 2.5 8 2.5C6.4087 2.5 4.88258 3.13214 3.75736 4.25736C2.63214 5.38258 2 6.9087 2 8.5Z"
                        stroke="#D2AAFA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.16663V8.49996L10 10.5"
                        stroke="#D2AAFA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    ></div>
                    <div
                      className="text-base font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.tokens} KII
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      99.86%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6 px-6">
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex flex-col">
            <h3
              className="text-lg font-medium"
              style={{ color: theme.primaryTextColor }}
            >
              Commission Rate
            </h3>
            <p
              className="text-xs mt-1"
              style={{ color: theme.secondaryTextColor }}
            >
              Updated At 2024-12-17 12:55:40
            </p>
            <div className="relative w-full h-48 flex items-center justify-center mt-4">
              <div className="relative w-40 h-40">
                <div className="absolute w-full h-full rounded-full border-[16px] border-[#2A2A3A] rotate-[135deg]"></div>
                <div
                  className="absolute w-full h-full rounded-full border-[16px] border-[#00FFB0] rotate-[135deg]"
                  style={{
                    clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
                  }}
                ></div>
                <div
                  className="absolute w-full h-full rounded-full border-[16px] border-[#D2AAFA] rotate-[135deg]"
                  style={{
                    clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00FFB0]"></div>
                <span
                  className="text-xs"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Rate: 10%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D2AAFA]"></div>
                <span
                  className="text-xs"
                  style={{ color: theme.secondaryTextColor }}
                >
                  24h: 1%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00FFB0]"></div>
                <span
                  className="text-xs"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Max: 2.0%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex flex-col h-full">
            <h3
              className="text-lg font-medium"
              style={{ color: theme.primaryTextColor }}
            >
              Commissions & Rewards
            </h3>
            <div className="flex flex-col gap-6 mt-6">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Commissions
                </p>
                <p
                  className="text-lg font-medium p-2 rounded"
                  style={{
                    color: theme.accentColor,
                    backgroundColor: theme.bgColor,
                  }}
                >
                  14.89 KII
                </p>
              </div>
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: theme.secondaryTextColor }}
                >
                  Outstanding Rewards
                </p>
                <p
                  className="text-lg font-medium p-2 rounded"
                  style={{
                    color: theme.accentColor,
                    backgroundColor: theme.bgColor,
                  }}
                >
                  148.91 KII
                </p>
              </div>
              <button
                className="w-full py-3 text-sm font-medium rounded-lg mt-auto"
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.accentColor,
                }}
              >
                CLAIM REWARDS
              </button>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex flex-col">
            <h3
              className="text-lg font-medium mb-6"
              style={{ color: theme.primaryTextColor }}
            >
              Addresses
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-base"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    Account Address
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={theme.accentColor}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "Kii1umlbw2c8fxcq36x2zitdrd93Vxmj3cztppe"
                      )
                    }
                  >
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                  </svg>
                </div>
                <p
                  className="text-xs break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  Kii1umlbw2c8fxcq36x2zitdrd93Vxmj3cztppe
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-base"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    Operator Address
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={theme.accentColor}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "Kiivaloperbum1ow2c8fxcq36x2zitdrd93Vxmj3dr5sjdd"
                      )
                    }
                  >
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                  </svg>
                </div>
                <p
                  className="text-xs break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  Kiivaloperbum1ow2c8fxcq36x2zitdrd93Vxmj3dr5sjdd
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-base"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    Hex Address
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={theme.accentColor}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "5A4F8EA32133508E058FE88F5B0G478F859A22590"
                      )
                    }
                  >
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                  </svg>
                </div>
                <p
                  className="text-xs break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  5A4F8EA32133508E058FE88F5B0G478F859A22590
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-base"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    Signer Address
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={theme.accentColor}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "Kii1akzom318emjzpwq4jqysvp5phs9ckx6y4e3e5fxg"
                      )
                    }
                  >
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                  </svg>
                </div>
                <p
                  className="text-xs break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  Kii1akzom318emjzpwq4jqysvp5phs9ckx6y4e3e5fxg
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-base"
                    style={{ color: theme.secondaryTextColor }}
                  >
                    Consensus Public Key
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={theme.accentColor}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        '{"@type":"cosmos.crypto.Ed25519.PubKey","key":"MSYpPChw/WL9hgoLiupu53xR5LauWv5vdsg=CG="}'
                      )
                    }
                  >
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                  </svg>
                </div>
                <p
                  className="text-xs break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  {
                    '{"@type":"cosmos.crypto.Ed25519.PubKey","key":"MSYpPChw/WL9hgoLiupu53xR5LauWv5vdsg=CG="}'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 px-6">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-medium"
              style={{ color: theme.primaryTextColor }}
            >
              Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th
                    className="text-left text-lg font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Height
                  </th>
                  <th
                    className="text-left text-lg font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Hash
                  </th>
                  <th
                    className="text-left text-lg font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Messages
                  </th>
                  <th
                    className="text-left text-lg font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="text-lg py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    244322
                  </td>
                  <td
                    className="text-lg py-2 max-w-[300px] truncate"
                    style={{ color: theme.primaryTextColor }}
                  >
                    0xc1fe48d...2b7b4b2b
                  </td>
                  <td className="py-2 flex items-center justify-between pr-12">
                    <span style={{ color: theme.primaryTextColor }}>SEND</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3334 4L6.00008 11.3333L2.66675 8"
                        stroke="#4BB543"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </td>
                  <td
                    className="text-lg py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    23 Days Ago
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-lg py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    155156
                  </td>
                  <td
                    className="text-lg py-2 max-w-[300px] truncate"
                    style={{ color: theme.primaryTextColor }}
                  >
                    0xf28666d...5b7a6c23
                  </td>
                  <td className="py-2 flex items-center justify-between pr-12">
                    <span style={{ color: theme.primaryTextColor }}>SEND</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3334 4L6.00008 11.3333L2.66675 8"
                        stroke="#4BB543"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </td>
                  <td
                    className="text-lg py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    23 Days Ago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
