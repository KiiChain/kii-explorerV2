import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

interface CreateStakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  validator: {
    moniker: string;
    operatorAddress: string;
    website?: string;
    tokens: string;
    selfBonded?: string;
    commission: string;
  };
}

export function CreateStakeModal({
  isOpen,
  onClose,
  validator,
}: CreateStakeModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="w-[800px] rounded-xl p-6"
        style={{ backgroundColor: theme.bgColor }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/kii-logo.png"
              alt="Validator Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: theme.primaryTextColor }}
              >
                {validator.moniker}
              </h2>
              <p
                className="text-sm"
                style={{ color: theme.secondaryTextColor }}
              >
                {validator.operatorAddress}
              </p>
              {validator.website && (
                <a
                  href={validator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: theme.accentColor }}
                >
                  {validator.website}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl"
            style={{ color: theme.secondaryTextColor }}
          >
            ×
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div
              className="text-sm mb-1"
              style={{ color: theme.secondaryTextColor }}
            >
              Total Bonded Tokens
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: theme.primaryTextColor }}
            >
              {validator.tokens} KII
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div
              className="text-sm mb-1"
              style={{ color: theme.secondaryTextColor }}
            >
              Self Bonded
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: theme.primaryTextColor }}
            >
              {validator.selfBonded || "100,000 KII"} (
              {(
                (parseFloat(validator.selfBonded || "100000") /
                  parseFloat(validator.tokens)) *
                100
              ).toFixed(1)}
              %)
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div
              className="text-sm mb-1"
              style={{ color: theme.secondaryTextColor }}
            >
              Voting Power
            </div>
            <div
              className="text-xl font-bold"
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

          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.boxColor }}
          >
            <div
              className="text-sm mb-1"
              style={{ color: theme.secondaryTextColor }}
            >
              Commission
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: theme.primaryTextColor }}
            >
              {validator.commission}
            </div>
          </div>
        </div>

        {/* Commission Rate Chart */}
        <div
          className="p-6 rounded-lg mb-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <h3
            className="text-lg mb-4"
            style={{ color: theme.primaryTextColor }}
          >
            Commission Rate
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-48 h-48 relative">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(${theme.accentColor} 10%, #2D1B46 10%)`,
                  mask: "radial-gradient(transparent 55%, white 56%)",
                  WebkitMask: "radial-gradient(transparent 55%, white 56%)",
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
                style={{ color: theme.primaryTextColor }}
              >
                10%
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span style={{ color: theme.secondaryTextColor }}>
                  Rate: 10%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2D1B46]" />
                <span style={{ color: theme.secondaryTextColor }}>24h: 1%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2D1B46]" />
                <span style={{ color: theme.secondaryTextColor }}>
                  Max: 2.0%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <h3
            className="text-lg mb-4"
            style={{ color: theme.primaryTextColor }}
          >
            Transactions
          </h3>
          <table className="w-full">
            <thead>
              <tr style={{ color: theme.secondaryTextColor }}>
                <th className="text-left pb-4">Height</th>
                <th className="text-left pb-4">Hash</th>
                <th className="text-left pb-4">Messages</th>
                <th className="text-left pb-4">Time</th>
                <th className="text-left pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="border-t"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.primaryTextColor,
                }}
              >
                <td className="py-4">245732</td>
                <td className="py-4">
                  3AE7D7638114F14230C6E2E6174F734338B509D8F889C378F39B6EE64FBD8250
                </td>
                <td className="py-4">SEND</td>
                <td className="py-4">23 Days Ago</td>
                <td className="py-4">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
