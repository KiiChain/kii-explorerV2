import { useRouter } from "next/navigation";

export const useSearch = () => {
  const router = useRouter();

  const searchItem = async (searchKey: string) => {
    if (!searchKey) {
      return { error: "Please enter a value!" };
    }

    const height = /^\d+$/;
    const txhash = /^[A-Z\d]{64}$/;
    const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;
    const evmAddr = /^0x[a-fA-F0-9]{40}$/;
    const evmTxHash = /^0x[a-fA-F0-9]{64}$/;

    if (height.test(searchKey)) {
      router.push(`/blocksID/${searchKey}`);
    } else if (txhash.test(searchKey) || evmTxHash.test(searchKey)) {
      router.push(`/transaction/${searchKey}`);
    } else if (addr.test(searchKey) || evmAddr.test(searchKey)) {
      router.push(`/account/${searchKey}`);
    } else {
      return { error: "The input not recognized" };
    }
  };

  return { searchItem };
};
