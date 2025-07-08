import { useTheme } from "@/context/ThemeContext";
import { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IBCToken } from "@/services/queries/ibc";
import { ethers } from "ethers";
import { formatBalances } from "@/utils/format";
import { useSendIBC } from "@/services/mutations/ibc";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";

export interface IConnection {
  id: string;
  name: string;
  iconUrl: string;
  chainId: string;
  status: "active" | "inactive";
  channel: string;
  prefix: string;
}

interface BridgeCardProps {
  connection: IConnection;
  balances: IBCToken[] | null;
}

export default function BridgeCard({ connection, balances }: BridgeCardProps) {
  const { theme } = useTheme();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const sendIBCMutation = useSendIBC();
  const { data: walletClient } = useWalletClient();

  const { address: connectedAddress } = useAccount();

  const handleSend = async () => {
    if (!amount || !address || !selectedTokenInfo || parseFloat(amount) <= 0)
      return;

    const regex = new RegExp(`^${connection.prefix}1[0-9a-z]{38}$`);
    const isValid = regex.test(address);

    if (!address || !isValid) {
      toast.error(`Address must have prefix ${connection.prefix}`);
      return;
    }

    sendIBCMutation.mutate({
      amount,
      denom: selectedTokenInfo.base,
      ibc_channel: connection.channel,
      toAddress: address,
      walletClient,
      exponent: selectedTokenInfo?.exponent,
    });

    setSelectedToken("");
    setAmount("");
    setAddress("");
  };

  const selectedTokenInfo = useMemo(() => {
    return balances?.find((t) => t.denom === selectedToken);
  }, [selectedToken, balances]);

  return (
    <Card
      style={{
        backgroundColor: theme.boxColor,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className="border-0 hover:shadow-lg transition-shadow"
    >
      <CardContent className="p-6 rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: theme.bgColor }}
          >
            <img
              src={connection.iconUrl}
              alt={`${connection.name} logo`}
              className="w-12 h-12 object-contain"
            />
          </div>

          <div className="flex-1">
            <h3
              style={{ color: theme.primaryTextColor }}
              className="font-medium text-lg"
            >
              {connection.name}
            </h3>
            <p style={{ color: theme.secondaryTextColor }} className="text-sm">
              {connection.chainId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span
              style={{ color: theme.secondaryTextColor }}
              className="text-xs"
            >
              Active
            </span>
          </div>
        </div>

        {/* Token selector */}
        <div className="mb-4">
          <label
            style={{ color: theme.primaryTextColor }}
            className="text-sm mb-2 block font-medium"
          >
            Token
          </label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger
              style={{
                backgroundColor: theme.bgColor,
                borderColor: "transparent",
              }}
              className="text-white border-0"
            >
              <SelectValue
                placeholder="Select token"
                style={{ color: theme.secondaryTextColor }}
              />
            </SelectTrigger>
            <SelectContent
              style={{
                background: theme.bgColor,
              }}
              className="border-0"
            >
              {balances?.map((token: IBCToken) => (
                <SelectItem
                  key={token.denom}
                  value={token.denom}
                  style={{
                    color: theme.primaryTextColor,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                  }}
                  className="hover:bg-[#2e2e3f] focus:bg-[#2e2e3f] transition-colors"
                >
                  {token.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Balance  */}
          {selectedToken && (
            <p
              className="mt-2 text-sm"
              style={{ color: theme.secondaryTextColor }}
            >
              {`Balance: ${formatBalances(
                ethers.formatUnits(
                  selectedTokenInfo?.amount || 0,
                  selectedTokenInfo?.exponent || 18
                )
              )} ${selectedToken}`}
            </p>
          )}
        </div>

        {/* Address input */}
        <div className="mb-4">
          <label
            style={{ color: theme.primaryTextColor }}
            className="text-sm mb-2 block font-medium"
          >
            Destination Address
          </label>
          <Input
            type="text"
            placeholder={`${connection.prefix}1...`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              backgroundColor: theme.bgColor,
              borderColor: "transparent",
              color: theme.primaryTextColor,
            }}
            className="border-0 placeholder:text-gray-500"
          />
        </div>

        {/* Amount input */}
        <div className="mb-6">
          <label
            style={{ color: theme.primaryTextColor }}
            className="text-sm mb-2 block font-medium"
          >
            Amount
          </label>
          <Input
            type="number"
            placeholder="0"
            step="1"
            value={amount}
            pattern="[0-9]"
            onChange={(e) => setAmount(e.target.value)}
            style={{
              backgroundColor: theme.bgColor,
              borderColor: "transparent",
              color: theme.primaryTextColor,
              MozAppearance: "textfield",
            }}
            className="border-0 placeholder:text-gray-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={
            !selectedToken ||
            !amount ||
            !address ||
            sendIBCMutation.isPending ||
            +amount <= 0 ||
            address == connectedAddress
          }
          className="w-full bg-[#D2AAFA] hover:bg-[#c299f0] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-2"
        >
          {sendIBCMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send to {connection.name}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
