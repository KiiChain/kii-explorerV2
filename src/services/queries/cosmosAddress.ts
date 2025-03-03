import { useQuery } from "@tanstack/react-query";

const fetchCosmosAddress = async (evmAddress: string) => {
  const response = await fetch(
    `https://lcd.uno.sentry.testnet.v3.kiivalidator.com/kiichain/evm/kii_address?evm_address=${evmAddress}`
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
