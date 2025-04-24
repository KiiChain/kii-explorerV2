import { toBech32 } from "@cosmjs/encoding";
import { isAddress } from "ethers";
import { useMemo } from "react";

// useHexToBech converts the evm address into the cosmos (Bech32) address
export function useHexToBech(evmAddress?: string) {
  const cosmosAddress = useMemo(() => {
    if (!evmAddress || !evmAddress.startsWith("0x") || !isAddress(evmAddress)) {
      return null;
    }

    const bytes = Buffer.from(evmAddress.slice(2), "hex");
    if (bytes.length !== 20) {
      return null;
    }

    return toBech32("kii", bytes);
  }, [evmAddress]);

  return { cosmosAddress };
}
