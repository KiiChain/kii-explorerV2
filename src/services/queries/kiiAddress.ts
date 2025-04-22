import { CHAIN_LCD_ENDPOINT } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";

export const useKiiAddressQuery = (evmAddress?: string) => {
  return useQuery({
    queryKey: ["kiiAddress", evmAddress],
    queryFn: async () => {
      const response = await fetch(
        `${CHAIN_LCD_ENDPOINT}/kiichain/evm/kii_address?evm_address=${evmAddress}`
      );
      return response.json();
    },
    enabled: !!evmAddress && evmAddress.startsWith("0x"),
  });
};
