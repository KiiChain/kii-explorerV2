import { API_ENDPOINTS } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useWithdrawHistoryQuery = (
  kiiAddress?: string,
  withdrawAddress?: string
) => {
  return useQuery({
    queryKey: ["withdrawHistory", kiiAddress, withdrawAddress],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/delegators/${kiiAddress}/rewards/${withdrawAddress}`
      );
      return response.json();
    },
    enabled: !!kiiAddress && !!withdrawAddress,
  });
};

export const useWithdrawalsQuery = (kiiAddress?: string) => {
  return useQuery({
    queryKey: ["withdrawals", kiiAddress],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/distribution/v1beta1/delegators/${kiiAddress}/withdraw_address`
      );
      return response.json();
    },
    enabled: !!kiiAddress,
  });
};
