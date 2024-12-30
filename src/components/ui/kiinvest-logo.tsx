import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/Logo.svg"
      alt="Kiinvest Logo"
      width={131}
      height={23}
      className="h-6 w-auto"
      priority
    />
  );
}
