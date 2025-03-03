import { API_ENDPOINTS } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useKiiAddressQuery = (evmAddress?: string) => {
  return useQuery({
    queryKey: ["kiiAddress", evmAddress],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/kiichain/evm/kii_address?evm_address=${evmAddress}`
      );
      return response.json();
    },
    enabled: !!evmAddress && evmAddress.startsWith("0x"),
  });
};
