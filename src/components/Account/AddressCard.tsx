import { useTheme } from "@/context/ThemeContext";

interface AddressCardProps {
  account: string;
}

export function AddressCard({ account }: AddressCardProps) {
  const { theme } = useTheme();

  return (
    <div
      style={{ backgroundColor: theme.boxColor }}
      className="mt-8 p-6 rounded-lg"
    >
      <div className="flex items-center gap-4 mb-4">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.66667 4V0H12V4H6.66667ZM0 6.66667V0H5.33333V6.66667H0ZM6.66667 12V5.33333H12V12H6.66667ZM0 12V8H5.33333V12H0ZM1.33333 5.33333H4V1.33333H1.33333V5.33333ZM8 10.6667H10.6667V6.66667H8V10.6667ZM8 2.66667H10.6667V1.33333H8V2.66667ZM1.33333 10.6667H4V9.33333H1.33333V10.6667Z"
            fill="#D2AAFA"
          />
        </svg>
        <div style={{ color: theme.primaryTextColor }} className="text-xl">
          Address
        </div>
      </div>
      <div style={{ color: theme.secondaryTextColor }}>{account}</div>
    </div>
  );
}
