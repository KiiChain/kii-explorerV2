"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BlocksHeader } from "@/components/headerDashboard";
import { useState } from "react";
import { ethers } from "ethers";
import { WalletIcon } from "./ui/icons";
import { useRouter } from "next/navigation";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
}

function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <Card className="bg-[#231C32]/40 border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm xl:text-base font-normal text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl xl:text-3xl font-bold text-white">
          {value}
          {unit && (
            <span className="ml-1 text-xs xl:text-sm text-muted-foreground">
              ({unit})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export interface WalletSession {
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

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [account, setAccount] = useState<string>("");
  const [session, setSession] = useState<WalletSession | null>(null);
  const router = useRouter();

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        setAccount(account);

        // Simular datos de la sesión
        setSession({
          balance: "335,099,989.9",
          staking: "450,005.1 KII",
          reward: "0 KII",
          withdrawals: "50,000 KII",
          stakes: [
            {
              validator: "KIICHAIN-NODE-0",
              amount: "100.1",
              rewards: "0.0 KII",
            },
            {
              validator: "KIICHAIN-NODE-1",
              amount: "449.905",
              rewards: "0.0 KII",
            },
          ],
        });
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="p-6 bg-[#05000F]">
      <div className="px-6">
        <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="bg-[#05000F] p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard title="KII Price" value="N/A" unit="TESTNET" />
          <StatCard title="Gas Price" value="2500" unit="Tekii" />
          <StatCard title="Transactions" value="333,422" />
          <StatCard title="Block Height" value="2,577,053" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          <StatCard title="Height" value="2,576,146" />
          <StatCard title="Validators" value="3" />
          <StatCard title="Supply" value="1,800,000,000" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          <StatCard title="Bonded Tokens" value="300,000" />
          <StatCard title="Inflation" value="0%" />
          <StatCard title="Community Pool" value="-" />
        </div>

        <Card className="bg-[#231C32]/40 border-0 mt-6">
          <CardContent className="p-6">
            {!account ? (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-80"
              >
                <WalletIcon />
                Wallet not connected
              </button>
            ) : (
              <div className="space-y-6">
                <div className="text-white text-xl mb-4">{account}</div>

                <div className="grid grid-cols-4 gap-4 ">
                  <div className="bg-[#05000F] rounded-lg p-4">
                    <div className="text-gray-400">Balance</div>
                    <div className="text-white text-lg">{session?.balance}</div>
                    <div className="text-sm text-gray-400">
                      ${session?.balance}
                    </div>
                  </div>
                  <div className="bg-[#05000F] rounded-lg p-4">
                    <div className="text-gray-400">Staking</div>
                    <div className="text-white text-lg">{session?.staking}</div>
                    <div className="text-sm text-gray-400">
                      ${session?.staking}
                    </div>
                  </div>
                  <div className="bg-[#05000F] rounded-lg p-4">
                    <div className="text-gray-400">Reward</div>
                    <div className="text-white text-lg">{session?.reward}</div>
                    <div className="text-sm text-gray-400">$0</div>
                  </div>
                  <div className="bg-[#05000F] rounded-lg p-4">
                    <div className="text-gray-400">Withdrawals</div>
                    <div className="text-white text-lg">
                      {session?.withdrawals}
                    </div>
                    <div className="text-sm text-gray-400">$500,000</div>
                  </div>
                </div>

                <div className="mt-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 w-full">
                        <th className="pb-4 w-1/4">Validator</th>
                        <th className="pb-4 w-1/4">Stakes</th>
                        <th className="pb-4 w-1/4">Rewards</th>
                        <th className="pb-4 w-1/4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session?.stakes.map((stake, index) => (
                        <tr
                          key={index}
                          className="border-t border-[#2D4BA0] bg-[#05000F]"
                        >
                          <td className="p-4 text-white">{stake.validator}</td>
                          <td className="p-4 text-white">{stake.amount}</td>
                          <td className="p-4 text-white">{stake.rewards}</td>
                          <td className="p-4">
                            <button className="px-4 py-2 bg-[#231C32] text-[#D2AAFA] rounded-lg hover:opacity-80">
                              CLAIM REWARDS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    className="px-8 py-3 bg-[#231C32] text-white rounded-lg hover:opacity-80"
                    onClick={() => {
                      localStorage.setItem(
                        "walletSession",
                        JSON.stringify({ account, session })
                      );
                      router.push("/account/");
                    }}
                  >
                    My Account
                  </button>
                  <button className="px-8 py-3 bg-[#231C32] text-white rounded-lg hover:opacity-80">
                    Create Stake
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
          <Card className="bg-[#231C32]/40 border-0">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-normal">
                Latest Blocks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Contenido de Latest Blocks */}
            </CardContent>
          </Card>
          <Card className="bg-[#231C32]/40 border-0">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <CardTitle className="text-xl font-normal">
                Latest transactions
              </CardTitle>
              <span className="text-base text-muted-foreground hover:text-white cursor-pointer">
                View All
              </span>
            </CardHeader>
            <CardContent className="p-6">
              {/* Contenido de Latest Transactions */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
