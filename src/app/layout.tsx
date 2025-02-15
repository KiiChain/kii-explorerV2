"use client";

import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/Logo";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { WalletProvider } from "@/context/WalletContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} font-sans`}>
      <body className={`${montserrat.className}`}>
        <ThemeProvider>
          <WalletProvider>
            <ContentWrapper>{children}</ContentWrapper>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className="flex h-screen w-full overflow-hidden"
        style={{ backgroundColor: theme.bgColor }}
      >
        <Sidebar className="mt-10">
          <SidebarHeader className="flex items-center justify-between p-4">
            <Logo />
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent />
        </Sidebar>
        <main className="flex-1 relative overflow-y-auto pl-28">
          <div className="px-12 pt-12">
            <UptimeHeader />
          </div>

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
