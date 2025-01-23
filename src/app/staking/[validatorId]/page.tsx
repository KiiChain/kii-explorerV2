"use client";

interface SignDoc {
  chain_id: string;
  account_number: string;
  sequence: string;
  fee: {
    amount: Array<{ denom: string; amount: string }>;
    gas: string;
  };
  msgs: Array<{
    type: string;
    value: {
      delegator_address: string;
      validator_address: string;
      amount: {
        denom: string;
        amount: string;
      };
    };
  }>;
  memo: string;
}

interface ChainInfo {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bip44: { coinType: number };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId?: string;
  }>;
  feeCurrencies: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId?: string;
    gasPriceStep?: {
      low: number;
      average: number;
      high: number;
    };
  }>;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId?: string;
  };
  features?: string[];
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}

declare global {
  interface Window {
    keplr?: {
      signAmino: (
        chainId: string,
        signer: string,
        signDoc: SignDoc
      ) => Promise<{ signed: SignDoc; signature: string }>;
      signArbitrary: (
        chainId: string,
        signer: string,
        data: string
      ) => Promise<{ signature: string }>;
      enable: (chainId: string) => Promise<void>;
      getOfflineSigner: (chainId: string) => {
        getAccounts: () => Promise<Array<{ address: string }>>;
      };
      getKey: (chainId: string) => Promise<{ address: string }>;
      experimentalSuggestChain: (chainInfo: ChainInfo) => Promise<void>;
    };
  }
}

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { use } from "react";

import { useEffect, useState } from "react";

interface Validator {
  moniker: string;
  operatorAddress: string;
  website?: string;
  tokens: string;
  selfBonded?: string;
  commission: string;
}

interface Theme {
  boxColor: string;
  bgColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
}

interface DelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  validator: Validator;
  theme: Theme;
}

function DelegateModal({
  isOpen,
  onClose,
  validator,
  theme,
}: DelegateModalProps) {
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState("2000");
  const [gas, setGas] = useState("200000");
  const [memo, setMemo] = useState("ping.pub");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    async function getWalletAddress() {
      if (window.keplr) {
        try {
          await window.keplr.enable("kiichain");
          const offlineSigner = window.keplr.getOfflineSigner("kiichain");
          const accounts = await offlineSigner.getAccounts();
          setWalletAddress(accounts[0].address);
        } catch (error) {
          console.error("Error getting wallet address:", error);
        }
      }
    }

    if (isOpen) {
      getWalletAddress();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await handleCreateStake(amount, validator);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="relative w-[500px] rounded-xl p-6"
        style={{ backgroundColor: theme.boxColor }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="font-semibold"
            style={{ color: theme.primaryTextColor }}
          >
            Delegate
          </h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Sender
            </label>
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="w-full p-3 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            />
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Validator
            </label>
            <select
              className="w-full p-3 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
              defaultValue={`${validator.moniker} (${(
                parseFloat(validator.commission) * 100
              ).toFixed(2)}%)`}
            >
              <option>{`${validator.moniker} (${(
                parseFloat(validator.commission) * 100
              ).toFixed(2)}%)`}</option>
            </select>
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Amount
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Available: 1882873676"
                className="flex-1 p-3 rounded-lg"
                style={{ backgroundColor: theme.bgColor }}
              />
              <select
                className="w-24 p-3 rounded-lg"
                style={{ backgroundColor: theme.bgColor }}
              >
                <option>ukii</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Fees
            </label>
            <input
              type="text"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            />
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Gas
            </label>
            <input
              type="text"
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            />
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Memo
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="advance" />
            <label htmlFor="advance" style={{ color: theme.primaryTextColor }}>
              Advance
            </label>
          </div>

          <button
            className="w-full p-3 rounded-lg mt-6 text-white"
            style={{ backgroundColor: theme.accentColor }}
            onClick={handleSubmit}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}

const handleCopyClick = (text: string, label: string) => {
  if (window.confirm(`¿Deseas copiar ${label}?`)) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Texto copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        alert("No se pudo copiar el texto");
      });
  }
};

async function handleCreateStake(amount: string, validator: Validator) {
  try {
    if (!window.keplr) {
      throw new Error("Please install Keplr wallet");
    }

    let chainId = "kiichain";
    try {
      await window.keplr.enable(chainId);
    } catch {
      chainId = "kiitestnet-1";
      await window.keplr.enable(chainId);
    }

    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    const userAddress = accounts[0].address;

    const accountResponse = await fetch(
      `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/auth/v1beta1/accounts/${userAddress}`
    );
    const accountData = await accountResponse.json();

    if (!accountData?.account) {
      throw new Error("Failed to get account data");
    }

    const accountInfo = accountData.account;
    const accountNumber = accountInfo.account_number?.toString() || "0";
    const sequence = accountInfo.sequence?.toString() || "0";

    const signDoc = {
      chain_id: "kiichain",
      account_number: accountNumber,
      sequence: sequence,
      fee: {
        amount: [{ denom: "ukii", amount: "2000" }],
        gas: "200000",
      },
      msgs: [
        {
          type: "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: userAddress,
            validator_address: validator.operatorAddress,
            amount: {
              denom: "ukii",
              amount: amount,
            },
          },
        },
      ],
      memo: "ping.pub",
    };

    const signature = await window.keplr.signAmino(
      "kiichain",
      userAddress,
      signDoc
    );

    const txBytes = Buffer.from(JSON.stringify(signature)).toString("base64");

    const broadcastPayload = {
      tx_bytes: txBytes,
      mode: "BROADCAST_MODE_SYNC",
    };

    const broadcastResponse = await fetch(
      "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(broadcastPayload),
      }
    );

    const result = await broadcastResponse.json();

    if (!result.tx_response?.txhash) {
      throw new Error("Failed to broadcast transaction");
    }

    const txResponse = await fetch(
      `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs/${result.tx_response.txhash}`
    );
    const txResult = await txResponse.json();

    if (txResult.tx_response.code !== 0) {
      throw new Error(txResult.tx_response.raw_log || "Transaction failed");
    }

    alert("Transaction completed successfully!");
    return txResult;
  } catch (error) {
    console.error("Stake creation failed:", error);
    throw error;
  }
}

export default function ValidatorPage({
  params,
}: {
  params: Promise<{ validatorId: string }>;
}) {
  const { validatorId } = use(params);
  const router = useRouter();
  const { theme } = useTheme();
  const [validator, setValidator] = useState<Validator | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchValidator() {
      try {
        const response = await fetch(
          `https://lcd.dos.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators/${validatorId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data?.validator) {
          throw new Error("No validator data found");
        }

        if (data.validator.status !== "BOND_STATUS_BONDED") {
          router.push("/staking");
          return;
        }

        setValidator({
          moniker: data.validator.description.moniker,
          operatorAddress: data.validator.operator_address,
          website: data.validator.description.website,
          tokens: data.validator.tokens,
          selfBonded: data.validator.delegator_shares,
          commission: data.validator.commission.commission_rates.rate,
        });
      } catch (error) {
        console.error("Error fetching validator:", error);
        router.push("/staking");
      } finally {
        setLoading(false);
      }
    }

    fetchValidator();
  }, [validatorId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!validator) {
    return null;
  }

  return (
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <div className="px-6">
        <div
          className="grid grid-cols-2 gap-6 w-full px-6 h-full rounded-xl"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex flex-col items-start gap-4 p-6 h-full">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
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
              <div className="w-full md:w-2/3">
                <h2
                  className="text-base font-bold mb-1 md:truncate"
                  style={{ color: theme.primaryTextColor }}
                >
                  {validator.moniker.length > 15
                    ? `${validator.moniker.substring(0, 15)}...`
                    : validator.moniker}
                </h2>
                <p
                  className="text-xs font-bold mb-1 break-all"
                  style={{ color: theme.secondaryTextColor }}
                >
                  {validator.operatorAddress}
                </p>
                <div className="pt-4">
                  <button
                    className="text-xs p-2 rounded-lg w-full md:w-auto"
                    style={{
                      backgroundColor: theme.bgColor,
                      color: theme.accentColor,
                    }}
                    onClick={() => setIsDelegateModalOpen(true)}
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
            <div className="flex flex-col gap-4 mt-4 w-full">
              <a
                href="#"
                className="text-sm flex flex-col md:flex-row items-start md:items-center gap-2"
                style={{ color: theme.primaryTextColor }}
              >
                <div className="flex items-center gap-2">
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
                </div>
                <p
                  className="text-sm underline break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  https://app.kiichain.io
                </p>
              </a>

              <a
                href="#"
                className="text-sm flex flex-col md:flex-row items-start md:items-center gap-2"
                style={{ color: theme.primaryTextColor }}
              >
                <div className="flex items-center gap-2">
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
                </div>
                <p
                  className="text-sm underline break-all"
                  style={{ color: theme.primaryTextColor }}
                >
                  support@kiichain.io
                </p>
              </a>
              <div className="flex items-center gap-2 pt-2 pl-1">
                <p
                  className="text-sm"
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
                    d="M11.8368 9.33334C12.2344 9.33369 12.6156 9.49188 12.8966 9.77315C13.1776 10.0544 13.3354 10.4357 13.3354 10.8333V11.2167C13.3354 11.8127 13.1221 12.3893 12.7354 12.842C11.6888 14.064 10.0974 14.6673 8.0001 14.6673C5.90277 14.6673 4.3121 14.064 3.2681 12.8407C2.88184 12.3882 2.66957 11.8129 2.66943 11.218V10.8327C2.66961 10.4351 2.82763 10.0538 3.10877 9.77268C3.38991 9.49154 3.77117 9.33351 4.16877 9.33334H11.8368ZM11.8368 10.3333H4.1681C4.03549 10.3333 3.90832 10.386 3.81455 10.4798C3.72078 11.0736 3.6681 11.2007 3.6681 11.3333V11.718C3.6681 12.0747 3.7961 12.42 4.0281 12.6913C4.86343 13.6707 6.17477 14.1673 7.99943 14.1673C9.82543 14.1673 11.1368 13.6707 11.9748 12.692C12.2072 12.4202 12.3349 12.0743 12.3348 11.7167V10.8327C12.3346 10.7004 12.282 10.5736 12.1886 10.48C12.0951 10.3864 11.969 10.3337 11.8368 10.3333ZM8.0001 1.33667C8.43784 1.33667 8.87129 1.42289 9.27571 1.5904C9.68013 1.75792 10.0476 2.00345 10.3571 2.31298C10.6667 2.62251 10.9122 2.98997 11.0797 3.39439C11.2472 3.79881 11.3334 4.23226 11.3334 4.67C11.3334 5.10774 11.2472 5.5412 11.0797 5.94561C10.9122 6.35003 10.6667 6.7175 10.3571 7.02703C10.0476 7.33655 9.68013 7.58209 9.27571 7.7496C8.87129 7.91712 8.43784 8.00334 8.0001 8.00334C7.11605 8.00334 6.2682 7.65215 5.64308 7.02703C5.01796 6.4019 4.66677 5.55406 4.66677 4.67C4.66677 3.78595 5.01796 2.9381 5.64308 2.31298C6.2682 1.68786 7.11605 1.33667 8.0001 1.33667ZM8.0001 2.33667C7.69368 2.83667 7.39027 2.89702 7.10717 3.01428C6.82408 3.13155 6.56685 3.30342 6.35018 3.52009C6.13351 3.73676 5.96164 3.99398 5.84438 4.27708C5.72712 4.56017 5.66677 4.86359 5.66677 5.17C5.66677 5.47642 5.72712 5.77984 5.84438 6.06293C5.96164 6.34602 6.13351 6.60325 6.35018 6.81992C6.56685 7.03659 6.82408 7.20846 7.10717 7.32572C7.39027 7.44298 7.69368 7.50334 8.0001 7.50334C8.61894 7.50334 9.21243 7.2575 9.65002 6.81992C10.0876 6.38233 10.3334 5.78884 10.3334 5.17C10.3334 4.55116 10.0876 3.95767 9.65002 3.52009C9.21243 3.0825 8.61894 2.83667 8.0001 2.83667Z"
                    fill="#D2AAFA"
                  />
                </svg>
                <p
                  className="text-sm"
                  style={{ color: theme.primaryTextColor }}
                >
                  Status:
                </p>
                <p
                  className="text-sm underline"
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
                  className="text-sm"
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
                      className="text-xs font-bold"
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
                      className="text-xs font-bold"
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
                        d="M11.8368 9.83334C12.2344 9.83369 12.6156 9.99188 12.8966 10.2731C13.1776 10.5544 13.3354 10.9357 13.3354 11.3333V11.7167C13.3354 12.3127 13.1221 12.8893 12.7354 12.842C11.6888 14.064 10.0974 14.6673 8.0001 14.6673C5.90277 14.6673 4.3121 14.064 3.2681 12.8407C2.88184 12.3882 2.66957 11.8129 2.66943 11.218V10.8327C2.66961 10.4351 2.82763 10.0538 3.10877 9.77268C3.38991 9.49154 3.77117 9.33351 4.16877 9.33334H11.8368ZM11.8368 10.3333H4.1681C4.03549 10.3333 3.90832 10.386 3.81455 10.4798C3.72078 11.0736 3.6681 11.2007 3.6681 11.3333V11.718C3.6681 12.0747 3.7961 12.42 4.0281 12.6913C4.86343 13.6707 6.17477 14.1673 7.99943 14.1673C9.82543 14.1673 11.1368 13.6707 11.9748 12.692C12.2072 12.4202 12.3349 12.0743 12.3348 11.7167V10.8327C12.3346 10.7004 12.282 10.5736 12.1886 10.48C12.0951 10.3864 11.969 10.3337 11.8368 10.3333ZM8.0001 1.83667C8.43784 1.83667 8.87129 1.92289 9.27571 2.0904C9.68013 2.25792 10.0476 2.50345 10.3571 2.81298C10.6667 3.12251 10.9122 3.48997 11.0797 3.89439C11.2472 4.29881 11.3334 4.73226 11.3334 5.17C11.3334 5.60774 11.2472 6.0412 11.0797 6.44561C10.9122 6.85003 10.6667 7.2175 10.3571 7.52703C10.0476 7.83655 9.68013 8.08209 9.27571 8.2496C8.87129 8.41712 8.43784 8.50334 8.0001 8.50334C7.11605 8.50334 6.2682 8.15215 5.64308 7.52703C5.01796 6.9019 4.66677 6.05406 4.66677 5.17C4.66677 4.28595 5.01796 3.4381 5.64308 2.81298C6.2682 2.18786 7.11605 1.83667 8.0001 1.83667ZM8.0001 2.83667C7.69368 2.83667 7.39027 2.89702 7.10717 3.01428C6.82408 3.13155 6.56685 3.30342 6.35018 3.52009C6.13351 3.73676 5.96164 3.99398 5.84438 4.27708C5.72712 4.56017 5.66677 4.86359 5.66677 5.17C5.66677 5.47642 5.72712 5.77984 5.84438 6.06293C5.96164 6.34602 6.13351 6.60325 6.35018 6.81992C6.56685 7.03659 6.82408 7.20846 7.10717 7.32572C7.39027 7.44298 7.69368 7.50334 8.0001 7.50334C8.61894 7.50334 9.21243 7.2575 9.65002 6.81992C10.0876 6.38233 10.3334 5.78884 10.3334 5.17C10.3334 4.55116 10.0876 3.95767 9.65002 3.52009C9.21243 3.0825 8.61894 2.83667 8.0001 2.83667Z"
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
                      className="text-xs font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator.tokens} KII
                    </div>
                    <div
                      className="text-xs"
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
                      className="text-xs font-bold"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {(parseFloat(validator.commission) * 100).toFixed(2)}%
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
                      viewBox="0 0 24 24"
                      fill={theme.accentColor}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleCopyClick(
                          "Kii1umlbw2c8fxcq36x2zitdrd93Vxmj3cztppe",
                          "Account Address"
                        )
                      }
                    >
                      <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: theme.secondaryTextColor }}
                    ></div>
                    <div
                      className="text-xs font-bold"
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
      <div className="mt-6 px-6">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-medium"
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
                    className="text-left text-sm font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Height
                  </th>
                  <th
                    className="text-left text-sm font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Hash
                  </th>
                  <th
                    className="text-left text-sm font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Messages
                  </th>
                  <th
                    className="text-left text-sm font-normal pb-4"
                    style={{ color: theme.primaryTextColor }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="text-sm py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    244322
                  </td>
                  <td
                    className="text-sm py-2 max-w-[300px] truncate"
                    style={{ color: theme.primaryTextColor }}
                  >
                    0xc1fe48d...2b7b4b2b
                  </td>
                  <td className="py-2 flex items-center justify-between pr-12">
                    <span
                      className="text-xs"
                      style={{ color: theme.primaryTextColor }}
                    >
                      SEND
                    </span>
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
                    className="text-sm py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    23 Days Ago
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-sm py-2"
                    style={{ color: theme.primaryTextColor }}
                  >
                    155156
                  </td>
                  <td
                    className="text-sm py-2 max-w-[300px] truncate"
                    style={{ color: theme.primaryTextColor }}
                  >
                    0xf28666d...5b7a6c23
                  </td>
                  <td className="py-2 flex items-center justify-between pr-12">
                    <span
                      className="text-xs"
                      style={{ color: theme.primaryTextColor }}
                    >
                      SEND
                    </span>
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
                    className="text-sm py-2"
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
      <DelegateModal
        isOpen={isDelegateModalOpen}
        onClose={() => setIsDelegateModalOpen(false)}
        validator={validator}
        theme={theme}
      />
    </div>
  );
}
