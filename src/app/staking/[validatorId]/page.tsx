"use client";

import React, { useState, use } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAccount, useBalance, useWalletClient } from "wagmi";
import { toast } from "react-hot-toast";

import { useDelegateMutation } from "@/services/mutations/staking";

import { useValidatorQuery } from "@/services/queries/validator";
import { useUnbondingDelegationsQuery } from "@/services/queries/unbondingDelegations";

import { useValidatorIcons } from "@/services/queries/validators";
import { WagmiConnectButton } from "@/components/ui/WagmiConnectButton";
import { useValidatorHistory } from "@/services/queries/validatorHistory";
import { Table } from "@/components/ui/Table/Table";

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
      getOfflineSigner: any;
      getKey: (chainId: string) => Promise<{ address: string }>;
      experimentalSuggestChain: (chainInfo: ChainInfo) => Promise<void>;
    };
  }
}

interface ValidatorProps {
  moniker: string;
  operatorAddress: string;
  tokens: string;
  selfBonded: string;
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
  validator: ValidatorProps;
  theme: Theme;
}

interface DelegationItem {
  type: string;
  amount: string;
  status: string;
  completionTime: string;
}

interface TransactionItem {
  type: string;
  amount: string;
  time: string;
  status: string;
}

const formatNumber = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  if (Number.isInteger(num)) {
    return num.toString();
  }

  return num.toFixed(4);
};

const formatAmount = (amount: string, decimals: number = 6) => {
  const value = parseInt(amount);
  if (isNaN(value)) return "0";
  const converted = value / Math.pow(10, decimals);
  return formatNumber(converted);
};

const DelegateModal = ({
  isOpen,
  onClose,
  validator,
  theme,
}: DelegateModalProps) => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { data: walletClient } = useWalletClient();

  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState("2000");
  const [gas, setGas] = useState("200000");
  const [memo, setMemo] = useState("ping.pub");
  const [isLoading, setIsLoading] = useState(false);

  const delegateMutation = useDelegateMutation();

  const availableBalance = formatAmount(balance?.value?.toString() || "0", 18);
  const formattedCommission = (parseFloat(validator.commission) * 100).toFixed(
    4
  );

  const handleStake = async () => {
    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    try {
      setIsLoading(true);
      await delegateMutation.mutateAsync({
        walletClient,
        amount,
        validatorAddress: validator.operatorAddress,
      });

      toast.success(
        "Successfully staked tokens\nYour tokens have been staked with the validator"
      );

      onClose();
    } catch (error) {
      console.error("Staking error:", error);
      toast.error(
        "Failed to stake tokens\nPlease try again or check your wallet connection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
              value={address}
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
              defaultValue={`${validator.moniker} (${formattedCommission}%)`}
            >
              <option>{`${validator.moniker} (${formattedCommission}%)`}</option>
            </select>
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ color: theme.secondaryTextColor }}
            >
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Available: ${availableBalance} KII`}
              className="w-full p-3 rounded-lg mt-2"
              style={{
                backgroundColor: theme.bgColor,
                color: theme.primaryTextColor,
              }}
            />
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
              value={formatAmount(fees)}
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

          <div className="pt-4">
            <button
              className="text-base font-semibold px-6 py-3 rounded-lg w-full md:w-auto hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: theme.bgColor,
                color: theme.accentColor,
              }}
              onClick={handleStake}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Stake Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default function ValidatorPage({
  params,
}: {
  params: Promise<{ validatorId: string }>;
}) {
  const { validatorId } = use(params);
  const { isConnected, address } = useAccount();
  const { theme } = useTheme();
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const router = useRouter();

  const { data: validator } = useValidatorQuery(validatorId);
  const { data: validatorHistory, isLoading: historyLoading } =
    useValidatorHistory(address, validatorId);

  useUnbondingDelegationsQuery(validatorId);

  const { getValidatorIcon, handleImageError } = useValidatorIcons();

  const formattedValidator: ValidatorProps | null = validator
    ? {
        moniker: validator.description.moniker,
        operatorAddress: validator.operator_address,
        tokens: validator.tokens,
        selfBonded: validator.self_bonded || "0",
        commission: validator.commission.commission_rates.rate,
      }
    : null;

  const delegationColumns = [
    {
      header: "Type",
      key: "type",
    },
    {
      header: "Amount",
      key: "amount",
      render: (item: DelegationItem) => `${item.amount} KII`,
    },
    {
      header: "Status",
      key: "status",
      render: (item: DelegationItem) => (
        <span
          className="px-2 py-1 rounded-full"
          style={{
            backgroundColor:
              item.status === "Active" ? theme.accentColor : theme.bgColor,
            color:
              item.status === "Active" ? theme.boxColor : theme.accentColor,
          }}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Completion Time",
      key: "completionTime",
    },
  ];

  const transactionColumns = [
    {
      header: "Transaction Type",
      key: "type",
    },
    {
      header: "Amount",
      key: "amount",
      render: (item: TransactionItem) => `${item.amount} KII`,
    },
    {
      header: "Time",
      key: "time",
    },
    {
      header: "Status",
      key: "status",
      render: (item: TransactionItem) => (
        <span
          className="px-2 py-1 rounded-full"
          style={{
            backgroundColor:
              item.status === "Completed" ? theme.accentColor : theme.bgColor,
            color:
              item.status === "Completed" ? theme.boxColor : theme.accentColor,
          }}
        >
          {item.status}
        </span>
      ),
    },
  ];

  if (!validator) {
    return <div>Validator not found</div>;
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
                  <div className="w-full h-full rounded-full" />
                  <div className="pl-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src={getValidatorIcon(validator?.description?.website)}
                      alt={`${validator?.description?.moniker} icon`}
                      width={94}
                      height={58}
                      className="rounded-lg"
                      onError={() =>
                        handleImageError(validator?.description?.website)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex items-center gap-4">
                  <div>
                    <h1
                      className="text-2xl font-bold pb-4"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {validator?.description?.moniker}
                    </h1>
                    <p
                      className="text-xs font-bold mb-1 break-all"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      {validator.operator_address}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    {!isConnected ? (
                      <WagmiConnectButton
                        customStyle={{
                          backgroundColor: theme.bgColor,
                          color: theme.accentColor,
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setIsDelegateModalOpen(true)}
                        className="px-4 py-2 rounded-lg text-white"
                        style={{
                          backgroundColor: theme.bgColor,
                          color: theme.accentColor,
                        }}
                      >
                        Create Stake
                      </button>
                    )}
                  </div>
                  {isConnected && (
                    <div>
                      <button
                        onClick={() => {
                          if (address) {
                            router.push(`/account/${address}`);
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-white"
                        style={{
                          backgroundColor: theme.bgColor,
                          color: theme.accentColor,
                        }}
                      >
                        My delegations
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {validator.description.website && (
              <a
                href={validator.description.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: theme.accentColor }}
              >
                {validator.description.website}
              </a>
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
                  {validator.description.website || "No website provided"}
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
                      d="M14.125 3.5L10.258 7.92C9.97642 8.24189 9.62927 8.49986 9.23984 8.67661C8.8504 8.85336 8.42767 8.94479C8 8.94479C7.57233 8.94479 7.1496 8.85336 6.76016 8.67661C6.37073 8.49986 6.02358 8.24189 5.742 7.92L1.875 3.5H14.125ZM3.204 3.5L6.494 7.261C6.68172 7.47565 6.91317 7.64768 7.17283 7.76554C7.43248 7.88341 7.71434 7.94439C8.28466 7.94439 8.56651 7.88341 8.82617 7.76554C9.08583 7.64768 9.31728 7.47565 9.505 7.261L12.796 3.5H3.204Z"
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
                      {formatAmount(validator.tokens)} KII
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
                        d="M12.6666 3.83331L3.33325 13.1666M11.3333 13.1666C10.9796 13.1666 10.6405 13.0262 10.3904 12.7761C10.1404 12.5261 9.99992 12.1869 9.99992 11.8333C9.99992 11.4797 10.1404 11.1406 10.3904 10.8905C10.6405 10.6405 10.9796 10.5 11.3333 10.5C11.6869 10.5 12.026 10.6405 12.2761 10.8905C12.5261 11.1406 12.6666 11.4797 12.6666 11.8333C12.6666 12.1869 12.5261 12.5261 12.2761 12.7761C12.026 13.0262 11.6869 13.1666 11.3333 13.1666ZM4.66659 6.49998C4.31296 6.49998 3.97382 6.3595 3.72378 6.10946C3.47373 5.85941 3.33325 5.52027 3.33325 5.16665C3.33325 4.81302 3.47378 4.47389 3.72378 4.22384C3.97382 3.97379 4.31296 3.83331 4.66659 3.83331C5.02021 3.83331 5.35935 3.97379 5.60939 4.22384C5.85944 4.47389 5.99992 4.81302 5.99992 5.16665C5.99992 5.52027 5.85944 5.85941 5.60939 6.10946C5.35935 6.3595 5.02021 6.49998 4.66659 6.49998Z"
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
                      {formatAmount(validator.self_bonded || "0")} KII
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.secondaryTextColor }}
                    >
                      {(
                        (parseFloat(
                          formatAmount(validator.self_bonded || "0")
                        ) /
                          parseFloat(formatAmount(validator.tokens))) *
                        100
                      ).toFixed(4)}
                      %
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
                        d="M11.8368 9.83334C12.2344 9.83369 12.6156 9.99188 12.8966 10.2731C13.1776 10.5544 13.3354 10.9357 13.3354 10.8333V11.2167C13.3354 11.8127 13.1221 12.3893 12.7354 12.842C11.6888 14.064 10.0974 14.6673 8.0001 14.6673C5.90277 14.6673 4.3121 14.064 3.2681 12.8407C2.88184 12.3882 2.66957 11.8129 2.66943 11.218V10.8327C2.66961 10.4351 2.82763 10.0538 3.10877 9.77268C3.38991 9.49154 3.77117 9.33351 4.16877 9.33334H11.8368ZM11.8368 10.3333H4.1681C4.03549 10.3333 3.90832 10.386 3.81455 10.4798C3.72078 11.0736 3.6681 11.2007 3.6681 11.3333V11.718C3.6681 12.0747 3.7961 12.42 4.0281 12.6913C4.86343 13.6707 6.17477 14.1673 7.99943 14.1673C9.82543 14.1673 11.1368 13.6707 11.9748 12.692C12.2072 12.4202 12.3349 12.0743 12.3348 11.7167V10.8327C12.3346 10.7004 12.282 10.5736 12.1886 10.48C12.0951 10.3864 11.969 10.3337 11.8368 10.3333ZM8.0001 1.83667C8.43784 1.83667 8.87129 1.92289 9.27571 2.0904C9.68013 2.25792 10.0476 2.50345 10.3571 2.81298C10.6667 3.12251 10.9122 3.48997 11.0797 3.89439C11.2472 4.29881 11.3334 4.73226 11.3334 5.17C11.3334 5.60774 11.2472 6.0412 11.0797 6.44561C10.9122 6.85003 10.6667 7.2175 10.3571 7.52703C10.0476 7.83655 9.68013 8.08209 9.27571 8.2496C8.87129 8.41712 8.43784 8.50334 8.0001 8.50334C7.11605 8.50334 6.2682 8.15215 5.64308 7.52703C5.01796 6.9019 4.66677 6.05406 4.66677 5.17C4.66677 4.28595 5.01796 3.4381 5.64308 2.81298C6.2682 2.18786 7.11605 1.83667 8.0001 1.83667ZM8.0001 2.83667C7.69368 2.83667 7.39027 2.89702 7.10717 3.01428C6.82408 3.13155 6.56685 3.30342 6.35018 3.52009C6.13351 3.73676 5.96164 3.99398 5.84438 4.27708C5.72712 4.56017 5.66677 4.86359 5.66677 5.17C5.66677 5.47642 5.72712 5.77984 5.84438 6.06293C5.96164 6.34602 6.13351 6.60325 6.35018 6.81992C6.56685 7.03659 6.82408 7.20846 7.10717 7.32572C7.39027 7.44298 7.69368 7.50334 8.0001 7.50334C8.61894 7.50334 9.21243 7.2575 9.65002 6.81992C10.0876 6.38233 10.3334 5.78884 10.3334 5.17C10.3334 4.55116 10.0876 3.95767 9.65002 3.52009C9.21243 3.0825 8.61894 2.83667 8.0001 2.83667Z"
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
                      {formatAmount(validator.tokens)} KII
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
                      {(
                        parseFloat(
                          validator.commission?.commission_rates?.rate || "0"
                        ) * 100
                      ).toFixed(2)}
                      %
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
                      {formatAmount(validator.tokens)} KII
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
              Delegations & Unbondings
            </h3>
          </div>
          {!address ? (
            <div>Please connect your wallet to view delegation history</div>
          ) : historyLoading ? (
            <div>Loading delegation history...</div>
          ) : !validatorHistory || !validatorHistory[0]?.delegations ? (
            <div>No delegation history available for this validator</div>
          ) : (
            <Table
              columns={delegationColumns}
              data={[
                ...(validatorHistory[0]?.delegations?.map((delegation) => ({
                  type: "Delegation",
                  amount: formatAmount(delegation?.balance?.amount || "0"),
                  status: "Active",
                  completionTime: "-",
                })) || []),
                ...(validatorHistory[0]?.unbondings?.map((unbonding) => ({
                  type: "Unbonding",
                  amount: formatAmount(unbonding.amount || "0"),
                  status: "Unbonding",
                  completionTime: new Date(
                    unbonding.completion_time
                  ).toLocaleString(),
                })) || []),
                ...(validatorHistory[0]?.redelegations?.map((redelegation) => ({
                  type: "Redelegation",
                  amount: formatAmount(redelegation.amount || "0"),
                  status: "Redelegating",
                  completionTime: new Date(
                    redelegation.completion_time
                  ).toLocaleString(),
                })) || []),
              ]}
              theme={theme}
              emptyMessage="No delegation history available"
            />
          )}
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
              Transaction History
            </h3>
          </div>
          <Table
            columns={transactionColumns}
            data={[
              ...(validatorHistory?.[0]?.delegations?.map((d) => ({
                type: "Delegation",
                amount: formatAmount(d?.balance?.amount || "0"),
                time: new Date().toLocaleString(),
                status: "Completed",
              })) || []),
              ...(validatorHistory?.[0]?.unbondings?.map((u) => ({
                type: "Unbonding",
                amount: formatAmount(u.amount || "0"),
                time: new Date(u.completion_time).toLocaleString(),
                status: "Processing",
              })) || []),
              ...(validatorHistory?.[0]?.redelegations?.map((r) => ({
                type: "Redelegation",
                amount: formatAmount(r.amount || "0"),
                time: new Date(r.completion_time).toLocaleString(),
                status: "Processing",
              })) || []),
            ].sort(
              (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
            )}
            theme={theme}
            emptyMessage="No transaction history available"
          />
        </div>
      </div>
      {formattedValidator && (
        <DelegateModal
          isOpen={isDelegateModalOpen}
          onClose={() => setIsDelegateModalOpen(false)}
          validator={formattedValidator}
          theme={theme}
        />
      )}
    </div>
  );
}
