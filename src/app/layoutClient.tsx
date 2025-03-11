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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { TESTNET_ORO_EVM } from "@/config/chain";
import { defineChain } from "@reown/appkit/networks";
import { Toaster } from "sonner";
import { Footer } from "@/components/ui/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const projectId = "e471f55bc9c6f7da3205b4343042da59";

const networks = [TESTNET_ORO_EVM] as [
  ReturnType<typeof defineChain>,
  ...ReturnType<typeof defineChain>[]
];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: false,
    receive: false,
    send: false,
    swaps: false,
  },
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
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <ContentWrapper>{children}</ContentWrapper>
                <Toaster richColors />
              </QueryClientProvider>
            </WagmiProvider>
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
        className="flex min-h-screen w-full flex-col"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div className="flex flex-1">
          <Sidebar className="mt-10">
            <SidebarHeader className="flex items-center justify-between p-4">
              <Logo />
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent />
          </Sidebar>
          <main className="flex flex-col flex-1 pl-28">
            <div className="px-12 pt-12">
              <UptimeHeader />
            </div>
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
