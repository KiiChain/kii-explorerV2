import { toBech32 } from "@cosmjs/encoding";
import { isAddress } from "ethers";

// evmAddrToCosmos converts the evm address into the cosmos (Bench32) address
export function evmAddrToCosmos(evmAddress: string): string {
  if (!evmAddress.startsWith("0x")) {
    throw new Error("Hex address must start with 0x");
  }

  if (!isAddress(evmAddress)) {
    throw new Error(`${evmAddress} is not a valid hex address`);
  }

  const bytes = Buffer.from(evmAddress.slice(2), "hex");
  if (bytes.length !== 20) {
    throw new Error("Ethereum address must be 20 bytes");
  }

  return toBech32("kii", bytes);
}
