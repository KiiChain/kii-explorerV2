import { FAUCET_BACKEND } from "@/constants/captcha";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Claim tokens from the faucet
const claimTokens = async (
  walletAddress: string,
  recaptchaToken: string | null
) => {
  const response = await fetch(`${FAUCET_BACKEND}/api/faucet`, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: walletAddress,
      captcha: recaptchaToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
};

// Mutation wrapper for the claim tokens
export const useClaimTokens = () => {
  return useMutation({
    mutationFn: ({
        walletAddress,
        captchaValue,
      }: {
        walletAddress: string;
        captchaValue: string;
      }) => claimTokens(walletAddress, captchaValue),
    onSuccess: () => {
      console.log("Faucet claimed!");
      toast("Faucet claimed!");
    },
    onError: (error: unknown) => {
      console.error("Faucet error:", error);
      toast("Error claiming the faucet");
    },
    retry: false,
  });
};
