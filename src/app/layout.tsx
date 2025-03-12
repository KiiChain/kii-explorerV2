import { metadata } from "./metadata";
import LayoutClient from "./layoutClient";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
