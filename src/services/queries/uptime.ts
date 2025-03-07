import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface Validator {
  operatorAddress: string;
  moniker: string;
  status: string;
  tokens: string;
  commission: string;
  website: string;
  jailed: boolean;
  uptime: number;
  selfBonded?: string;
}

interface SigningInfo {
  address: string;
  missed_blocks_counter: string;
  index_offset: string;
  start_height: string;
}

export const useValidatorsData = () => {
  return useQuery({
    queryKey: ["validators-data"],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.LCD}/cosmos/staking/v1beta1/validators`
      );
      const data = await response.json();
      return data.validators;
    },
    staleTime: 30000,
  });
};

export const useSigningInfos = () => {
  const pageSize = 200;

  return useQuery({
    queryKey: ["signing-infos"],
    queryFn: async () => {
      const fetchPage = async (page: number) => {
        const response = await fetch(
          `${
            API_ENDPOINTS.LCD
          }/cosmos/slashing/v1beta1/signing_infos?pagination.limit=${pageSize}&pagination.offset=${
            (page - 1) * pageSize
          }`
        );
        const data = await response.json();
        return {
          infos: data.info,
          total: parseInt(data.pagination.total),
        };
      };

      const firstPage = await fetchPage(1);
      const totalPages = Math.ceil(firstPage.total / pageSize);

      let allInfos = [...firstPage.infos];

      // Fetch remaining pages if any
      for (let page = 2; page <= totalPages; page++) {
        const { infos } = await fetchPage(page);
        allInfos = [...allInfos, ...infos];
      }

      return allInfos.reduce(
        (acc: Record<string, SigningInfo>, info: SigningInfo) => {
          acc[info.address] = info;
          return acc;
        },
        {}
      );
    },
    staleTime: 30000,
  });
};

export const calculateUptime = (
  validator: Validator,
  signingInfos: Record<string, SigningInfo>
) => {
  const signedBlocksWindow = 1000;
  const signingInfo = signingInfos[validator.operatorAddress];
  if (!signingInfo) return 0;

  const missedBlocks = Number(signingInfo.missed_blocks_counter);
  return ((signedBlocksWindow - missedBlocks) / signedBlocksWindow) * 100;
};
