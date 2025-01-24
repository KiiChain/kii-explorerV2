"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletSession {
  balance: string;
  staking: string;
  reward: string;
  withdrawals: string;
  stakes: {
    validator: string;
    amount: string;
    rewards: string;
  }[];
}

interface WalletContextType {
  account: string;
  session: WalletSession | null;
  setAccount: (account: string) => void;
  setSession: (session: WalletSession | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string>("");
  const [session, setSession] = useState<WalletSession | null>(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAccount");
    const savedSession = localStorage.getItem("walletSession");

    if (savedAccount) {
      setAccount(savedAccount);
    }
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem("walletAccount", account);
    } else {
      localStorage.removeItem("walletAccount");
    }
  }, [account]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("walletSession", JSON.stringify(session));
    } else {
      localStorage.removeItem("walletSession");
    }
  }, [session]);

  return (
    <WalletContext.Provider
      value={{ account, session, setAccount, setSession }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
