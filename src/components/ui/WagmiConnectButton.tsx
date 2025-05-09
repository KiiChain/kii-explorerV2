import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { CHAIN_RPC_ENDPOINT, TESTNET_ORO_EVM } from "@/config/chain";
import { GoArrowUpRight } from "react-icons/go";

interface WagmiConnectButtonProps {
  customStyle?: React.CSSProperties;
}

export const WagmiConnectButton = ({
  customStyle,
}: WagmiConnectButtonProps) => {
  const { theme } = useTheme();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleConnect = async () => {
    if (!isConnected) {
      open();
    } else if (chainId !== TESTNET_ORO_EVM.id) {
      try {
        // Primero solicitamos acceso a la cuenta
        await (
          window.ethereum as {
            request: (args: {
              method: string;
              params: unknown[];
            }) => Promise<unknown>;
          }
        )?.request({
          method: "eth_requestAccounts",
          params: [],
        });

        // Luego intentamos cambiar la red
        await (
          window.ethereum as {
            request: (args: {
              method: string;
              params: unknown[];
            }) => Promise<unknown>;
          }
        )?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${TESTNET_ORO_EVM.id.toString(16)}` }],
        });
      } catch (error: unknown) {
        if (error instanceof Error && "code" in error && error.code === 4902) {
          try {
            await (
              window.ethereum as {
                request: (args: {
                  method: string;
                  params: unknown[];
                }) => Promise<unknown>;
              }
            )?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${TESTNET_ORO_EVM.id.toString(16)}`,
                  chainName: "Kiichain Testnet",
                  nativeCurrency: {
                    name: "UORO",
                    symbol: "UORO",
                    decimals: 18,
                  },
                  rpcUrls: [CHAIN_RPC_ENDPOINT],
                  blockExplorerUrls: ["https://testnet.kiiexplorer.io"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add network:", addError);
          }
        }
        console.error("Failed to switch network:", error);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
        style={{
          backgroundColor: theme.boxColor,
          color: theme.primaryTextColor,
          ...customStyle,
        }}
        onClick={handleConnect}
      >
        {!isConnected
          ? "Connect Wallet"
          : chainId !== TESTNET_ORO_EVM.id
          ? "Switch Network"
          : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        <GoArrowUpRight className="w-4 h-4" />
      </button>

      {showDropdown && isConnected && chainId === TESTNET_ORO_EVM.id && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: theme.boxColor,
            top: "100%",
            zIndex: 50,
          }}
        >
          <button
            className="w-full px-4 py-2 text-left transition-colors hover:bg-white/10"
            style={{ color: theme.primaryTextColor }}
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
