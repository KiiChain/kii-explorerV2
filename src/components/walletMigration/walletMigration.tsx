"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  CHAIN_RPC_ENDPOINT,
  KIICHAIN_ORO_DENOM,
  testnetV3COSMOS,
} from "@/config/chain";
import { useAccount, useDisconnect } from "wagmi";
import { ArrowDownIcon } from "../ui/icons";
import { useAppKit } from "@reown/appkit/react";
import { getSigningKiiChainClient } from "@kiichain/kiijs-proto";
import { useMigrateCosmosTokensMutation } from "@/services/mutations/migration";
import { KIICHAIN_BASE_DENOM } from "@kiichain/kiijs-evm";
import { SigningStargateClient } from "@cosmjs/stargate";
import { HiChevronDown } from "react-icons/hi";

export function WalletMigrationDashboard() {
  const { theme } = useTheme();
  const [keplrConnected, setKeplrConnected] = useState(false);
  const [keplrAddress, setKeplrAddress] = useState("");
  const [kiiBalance, setKiiBalance] = useState("");
  const [oroBalance, setOroBalance] = useState("");
  const [keplrClient, setKeplClient] = useState<
    SigningStargateClient | undefined
  >();
  const [fetchBalance, setFetchBalance] = useState(false);
  const { address: evmAddress, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const migrateCosmosTokensMutation = useMigrateCosmosTokensMutation();

  const evmDropdownRef = useRef<HTMLDivElement>(null);
  const keplrDropdownRef = useRef<HTMLDivElement>(null);
  const evmButtonRef = useRef<HTMLButtonElement>(null);
  const keplrButtonRef = useRef<HTMLButtonElement>(null);

  const [showEvmDropdown, setShowEvmDropdown] = useState(false);
  const [showKeplrDropdown, setShowKeplrDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        evmDropdownRef.current &&
        !evmDropdownRef.current.contains(target) &&
        evmButtonRef.current &&
        !evmButtonRef.current.contains(target)
      ) {
        setShowEvmDropdown(false);
      }

      if (
        keplrDropdownRef.current &&
        !keplrDropdownRef.current.contains(target) &&
        keplrButtonRef.current &&
        !keplrButtonRef.current.contains(target)
      ) {
        setShowKeplrDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const balance = async () => {
      // format Kii balance
      const kiiBalance = await keplrClient?.getBalance(
        keplrAddress,
        KIICHAIN_BASE_DENOM
      );
      const kiiFormated = (Number(kiiBalance?.amount) / 1_000_000).toFixed(2);
      setKiiBalance(kiiFormated);

      // format Oro balance
      const oroBalance = await keplrClient?.getBalance(
        keplrAddress,
        KIICHAIN_ORO_DENOM
      );
      const oroFormatted = (Number(oroBalance?.amount) / 1_000_000).toFixed(2);
      setOroBalance(oroFormatted);
    };

    if (fetchBalance) {
      balance();
      setFetchBalance(false);
    }
  }, [fetchBalance, keplrAddress, keplrClient]);

  // handleConnectKeplr connects keplr wallet, obtain user wallet and signer
  const handleConnectKeplr = async () => {
    try {
      // Check if keplr is installed
      if (!window.keplr) {
        throw new Error("Keplr extension not found");
      }

      // suggest the wallet
      try {
        await window.keplr.experimentalSuggestChain(testnetV3COSMOS);
      } catch (suggestError) {
        console.warn("Failed to suggest chain:", suggestError);
        throw new Error("Failed to add KiiChain network to Keplr");
      }

      // request permissions for the chainId get signer
      await window.keplr.enable(testnetV3COSMOS.chainId);
      const signer = window.keplr.getOfflineSigner(testnetV3COSMOS.chainId);

      // get accounts
      const accounts = await signer.getAccounts();
      if (accounts.length === 0) {
        throw new Error("No accounts found in Keplr");
      }

      // Save userAddress
      setKeplrAddress(accounts[0].address);
      setKeplrConnected(true);

      // create client, store it and get balance
      const client = await getSigningKiiChainClient({
        rpcEndpoint: CHAIN_RPC_ENDPOINT,
        signer,
      });

      if (!client) {
        throw new Error("Error gettint the signing client");
      }

      setKeplClient(client);

      setFetchBalance(true);
    } catch (err) {
      console.error("Keplr connection error:", err);
    }
  };

  // formatAddress formats the address string as kii11....1234
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}....${address.substring(
      address.length - 4
    )}`;
  };

  // handleMigrateFunds send funds from the keplr to the evm wallet
  const handleMigrateFunds = async () => {
    if (!keplrConnected) {
      console.error("Please connect your Keplr wallet");
      return;
    }

    if (!isConnected) {
      console.error("Please connect your evm wallet");
      return;
    }

    migrateCosmosTokensMutation.mutate({
      cosmosAddr: keplrAddress,
      evmAddr: evmAddress!,
      cosmosClient: keplrClient!,
      setFetchBalance,
    });
  };

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          style={{
            backgroundColor: theme.boxColor,
            border: `1px solid ${theme.borderColor}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px ${theme.borderColor}33`,
          }}
          className="p-20 rounded-lg w-full max-w-xl relative z-10"
        >
          <h1
            style={{ color: theme.primaryTextColor, lineHeight: "1.3" }}
            className="text-4xl font-bold mb-6"
          >
            Wallet Migration Tool
          </h1>

          <div className="space-y-6">
            <div>
              <h2
                style={{ color: theme.primaryTextColor, lineHeight: "1.3" }}
                className="text-xl mb-4"
              >
                How to migrate funds from Keplr to EVM?
              </h2>
              <ol
                style={{ color: theme.secondaryTextColor }}
                className="list-decimal list-inside space-y-2 ml-4"
              >
                <li className="mb-2">Connect your Evm wallet</li>
                <li className="mb-2">Connect your Keplr wallet</li>
                <li className="mb-2">
                  Click <strong>Migrate</strong> to complete the transfer
                </li>
              </ol>
            </div>

            <div className="space-y-6">
              {/* Connect Keplr button */}
              <div className="relative">
                <button
                  ref={keplrButtonRef}
                  style={{
                    backgroundColor: theme.faucetColor2,
                    color: theme.faucetTextColor2,
                    opacity: migrateCosmosTokensMutation.isPending ? 0.7 : 1,
                  }}
                  className="w-full py-3 px-4 font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg flex justify-center items-center relative"
                  onClick={() => {
                    if (keplrConnected) {
                      setShowKeplrDropdown(!showKeplrDropdown);
                    } else {
                      handleConnectKeplr();
                    }
                  }}
                >
                  <span className="text-center truncate">
                    {keplrConnected
                      ? `${formatAddress(keplrAddress)}`
                      : "Connect Keplr"}
                  </span>

                  {keplrConnected && (
                    <HiChevronDown className="absolute right-4 w-4 h-4" />
                  )}
                </button>

                {showKeplrDropdown && (
                  <div
                    ref={keplrDropdownRef}
                    className="absolute right-0 mt-2 w-full rounded-lg shadow-lg overflow-hidden z-50"
                    style={{ backgroundColor: theme.boxColor }}
                  >
                    <button
                      className="w-full px-4 py-2 text-left transition-colors hover:bg-white/10"
                      style={{ color: theme.primaryTextColor }}
                      onClick={() => {
                        setKeplrConnected(false);
                        setKeplrAddress("");
                        setShowKeplrDropdown(false);
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

              {/* Connect Evm button */}
              <div className="relative">
                <div className="flex justify-center mb-5">
                  <ArrowDownIcon className="w-6 h-6 text-gray-500" />
                </div>

                <button
                  ref={evmButtonRef}
                  style={{
                    backgroundColor: theme.faucetColor2,
                    color: theme.faucetTextColor2,
                    opacity: migrateCosmosTokensMutation.isPending ? 0.7 : 1,
                  }}
                  className="w-full py-3 px-4 font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg flex justify-center items-center relative"
                  onClick={() => {
                    if (isConnected) {
                      setShowEvmDropdown(!showEvmDropdown);
                    } else {
                      open();
                    }
                  }}
                >
                  {isConnected
                    ? `${formatAddress(evmAddress!)}`
                    : "Connect Evm"}

                  {isConnected && (
                    <HiChevronDown className="absolute right-4 w-4 h-4" />
                  )}
                </button>

                {showEvmDropdown && (
                  <div
                    ref={evmDropdownRef}
                    className="absolute right-0 mt-2 w-full rounded-lg shadow-lg overflow-hidden z-50"
                    style={{ backgroundColor: theme.boxColor }}
                  >
                    <button
                      className="w-full px-4 py-2 text-left transition-colors hover:bg-white/10"
                      style={{ color: theme.primaryTextColor }}
                      onClick={() => {
                        disconnect();
                        setShowEvmDropdown(false);
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

              {/* Migrate button */}
              {keplrConnected && isConnected && (
                <>
                  <button
                    style={{
                      backgroundColor: theme.faucetColor2,
                      color: theme.faucetTextColor2,
                      opacity: migrateCosmosTokensMutation.isPending ? 0.7 : 1,
                    }}
                    className="w-full py-3 text-center font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                    onClick={handleMigrateFunds}
                    disabled={migrateCosmosTokensMutation.isPending}
                  >
                    {migrateCosmosTokensMutation.isPending
                      ? "Migrating..."
                      : `Migrate ${kiiBalance} Kii and ${oroBalance} Oro`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
