"use client";

import React, { useState } from "react";
import { WalletIcon } from "@/components/ui/icons";
import { useTheme } from "@/context/ThemeContext";
import { CAPTCHA_KEY, FAUCET_BACKEND } from "@/constants/captcha";
import Turnstile from "react-turnstile";

export function FaucetDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme } = useTheme();

  const handleClaimTokens = async () => {
    if (!walletAddress) {
      setError("Please enter a wallet address");
      return;
    }

    if (!captchaToken) {
      setError("CAPTCHA is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send request to backend with CAPTCHA token
      const response = await fetch(`${FAUCET_BACKEND}/api/faucet`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          captcha: captchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setSuccess("Successfully claimed the faucet");
      setWalletAddress("");
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to claim tokens. Please try again later."
      );
      console.error("Faucet error:", err);
    } finally {
      setIsLoading(false);
      setCaptchaToken("");
      setCaptchaKey((prev) => prev + 1);
    }
  };

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="p-6">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          style={{ backgroundColor: theme.boxColor }}
          className="p-20 rounded-lg shadow-lg w-full max-w-xl"
        >
          <h1
            style={{ color: theme.primaryTextColor }}
            className="text-4xl font-bold mb-6"
          >
            Testnet Oro Faucet
          </h1>

          <div className="space-y-6">
            <div>
              <h2
                style={{ color: theme.primaryTextColor }}
                className="text-xl mb-4"
              >
                How to use KiiChain&apos;s faucet?
              </h2>
              <ol
                style={{ color: theme.primaryTextColor }}
                className="list-decimal list-inside space-y-2 ml-4"
              >
                <li>
                  Set up your testnet wallet{" "}
                  <a
                    href="#"
                    style={{
                      color: theme.tertiaryTextColor,
                      fontWeight: "bold",
                    }}
                  >
                    here.
                  </a>
                </li>
                <li>Insert your wallet address.</li>
                <li>Claim your KII.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  style={{ color: theme.primaryTextColor }}
                  className="flex items-center mb-2"
                >
                  <WalletIcon className="w-5 h-5 mr-2" />
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Wallet Address"
                  style={{
                    backgroundColor: theme.faucetColor,
                    color: theme.faucetTextColor,
                  }}
                  className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 shadow-lg"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              {success && (
                <div className="text-green-500 text-sm mt-2">{success}</div>
              )}

              <button
                style={{
                  backgroundColor: theme.faucetColor2,
                  color: theme.faucetTextColor2,
                  opacity: isLoading ? 0.7 : 1,
                }}
                className="w-full py-3 text-left font-bold rounded-lg hover:opacity-90 transition-opacity pl-4 shadow-lg"
                onClick={handleClaimTokens}
                disabled={isLoading}
              >
                {isLoading ? "Claiming..." : "Claim your tokens"}
              </button>

              {/* Cloudflare Turnstile CAPTCHA */}
              <div className="flex justify-center">
                <Turnstile
                  sitekey={CAPTCHA_KEY}
                  onSuccess={(token) => setCaptchaToken(token)}
                  refreshExpired="auto"
                  theme="auto"
                  key={captchaKey}
                  fixedSize={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
