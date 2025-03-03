import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

const fetchCosmosAddress = async (evmAddress: string) => {
  const response = await fetch(
    `${API_ENDPOINTS.LCD}/kiichain/evm/kii_address?evm_address=${evmAddress}`
  );
  const data = await response.json();
  return data.kii_address;
};

export const useCosmosAddress = (address: string | undefined) => {
  return useQuery({
    queryKey: ["cosmosAddress", address],
    queryFn: async () => {
      if (!address) return "";
      return fetchCosmosAddress(address);
    },
    enabled: !!address,
  });
};
