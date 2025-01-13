import { useTheme } from "@/context/ThemeContext";

interface AddressCardProps {
  account: string;
}

export function AddressCard({ account }: AddressCardProps) {
  const { theme } = useTheme();

  return (
    <div className={`mt-8 p-6 bg-[${theme.boxColor}] rounded-lg`}>
      <div className={`text-[${theme.primaryTextColor}] text-xl mb-4`}>
        Address
      </div>
      <div className={`text-[${theme.secondaryTextColor}] mb-6`}>{account}</div>
    </div>
  );
}
