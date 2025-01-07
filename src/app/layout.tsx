"use client";

import { Montserrat } from "next/font/google";
import "./globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/kiinvest-logo";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

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
    <html lang="en" className={montserrat.variable}>
      <body>
        <ThemeProvider>
          <ContentWrapper>{children}</ContentWrapper>
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
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <Logo />
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent />
        </Sidebar>
        <main className="flex-1 relative overflow-y-auto pl-28">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
