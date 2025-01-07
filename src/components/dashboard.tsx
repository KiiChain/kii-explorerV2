"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { ethers } from "ethers";
import {
  WalletIcon,
  ContractIcon,
  HeightIcon,
  CashIcon,
  CommunityPoolIcon,
  ValidatorsIcon,
  BondedTokensIcon,
  InflationIcon,
} from "./ui/icons";
import { useRouter } from "next/navigation";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  variant?: "default" | "horizontal";
}

function StatCard({
  title,
  value,
  unit,
  icon,
  variant = "default",
}: StatCardProps) {
  if (variant === "horizontal") {
    return (
      <Card className="bg-[#231C32]/40 border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm xl:text-base font-normal text-[#F3F5FB]">
                {title}
              </span>
            </div>
            <div className="text-xl md:text-2xl xl:text-3xl font-bold text-[#F3F5FB]">
              {value}
              {unit && (
                <span className="pl-1 ml-1 text-[10px] xl:text-xs text-[#F3F5FB]">
                  ({unit})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#231C32]/40 border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm xl:text-base font-normal text-[#F3F5FB]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl xl:text-3xl font-bold text-[#F3F5FB]">
          {value}
          {unit && (
            <span className="pl-1 ml-1 text-[10px] xl:text-xs text-[#F3F5FB]">
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
      <UptimeHeader />
      <div className="px-6 pt-12"></div>
      <div className="bg-[#05000F] pt-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard title="KII Price" value="N/A" unit="TESTNET" />
          <StatCard title="Gas Price" value="2500" unit="Tekii" />
          <StatCard title="Transactions" value="333,422" />
          <StatCard title="Block Height" value="2,577,053" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Height"
            value="2,576,146"
            icon={<HeightIcon className="w-5 h-5 text-[#F3F5FB]" />}
            variant="horizontal"
          />
          <StatCard
            title="Validators"
            value="3"
            icon={<ValidatorsIcon className="w-5 h-5 text-[#F3F5FB]" />}
            variant="horizontal"
          />
          <StatCard
            title="Supply"
            value="1,800,000,000"
            icon={<CashIcon className="w-5 h-5 text-[#F3F5FB]" />}
            variant="horizontal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Bonded Tokens"
            value="300,000"
            icon={<BondedTokensIcon className="w-5 h-5 text-[#F3F5FB]" />}
            variant="horizontal"
          />
          <StatCard
            title="Inflation"
            value="0%"
            icon={<InflationIcon className="w-4 h-4 text-[#F3F5FB]" />}
            variant="horizontal"
          />
          <StatCard
            title="Community Pool"
            value="-"
            icon={<CommunityPoolIcon className="w-5 h-5 text-[#F3F5FB]" />}
            variant="horizontal"
          />
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

        <div className="mt-6">
          <Card className="bg-[#231C32]/40 border-0">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-6 flex-1">
                  <div className="text-white">Latest Blocks</div>
                  <div className="text-white ml-[30%]">Latest transactions</div>
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer whitespace-nowrap ml-4">
                  View All
                </div>
              </div>
              <div className="mt-4">
                <table className="w-full table-fixed">
                  <tbody className="space-y-4">
                    {[...Array(10)].map((_, index) => (
                      <tr
                        key={index}
                        className="bg-[#05000F] rounded-lg mb-4 w-full"
                      >
                        <td className="p-4 grid grid-cols-12 gap-4 items-center">
                          <span className="text-[#D2AAFA] col-span-2 flex items-center gap-2">
                            <ContractIcon className="w-4 h-4" />
                            <span className="text-[#F3F5FB]">2578179</span>
                          </span>
                          <div className="flex items-center gap-2 col-span-3">
                            <span className="text-[#F3F5FB]">
                              Fee Recipient
                            </span>
                            <span className="text-[#D2AAFA]">
                              Kiichain Validator 1
                            </span>
                          </div>
                          <span className="text-[#D2AAFA] col-span-2 flex items-center gap-2">
                            <ContractIcon className="w-4 h-4" />
                            <span className="text-[#F3F5FB]">
                              0x4f02c2fb1798
                            </span>
                          </span>
                          <div className="flex flex-col col-span-3">
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span className="text-[#F3F5FB]">From:</span>
                                <span className="text-[#D2AAFA]">
                                  0xf61aE263853B62Ce48...
                                </span>
                              </div>
                            </span>
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span className="text-[#F3F5FB]">To:</span>
                                <span className="text-[#D2AAFA]">
                                  0x7f32360b4ea9bf2682...
                                </span>
                              </div>
                            </span>
                          </div>
                          <span className="bg-[#231C32] text-[#D2AAFA] px-3 py-1 rounded-full col-span-2 text-center inline-block w-fit">
                            2,500 KII
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="bg-[#05000F] border-0">
            <div className="p-6">
              <h2 className="text-white text-xl mb-6">Application Versions</h2>

              <table className="w-full">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">Name</td>
                    <td className="py-4 text-[#F3F5FB]">Kiichain</td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">App_name</td>
                    <td className="py-4 text-[#F3F5FB]">Kiichaind</td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">Version</td>
                    <td className="py-4 text-[#F3F5FB]">26c1fe7</td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">Git_commit</td>
                    <td className="py-4 text-[#F3F5FB]">
                      87eefca1ad86ec69374874c25558f430afdb5555c8
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">Build_tags</td>
                    <td className="py-4 text-[#F3F5FB]">App_v1</td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 text-[#F3F5FB]">Go_version</td>
                    <td className="py-4 text-[#F3F5FB]">
                      Go Version Go1.19 Linux/Amd64
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full mt-4">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td className="py-4 text-[#F3F5FB] w-1/4">
                      Cloud.Google.Com/Go
                    </td>
                    <td className="py-4 text-[#F3F5FB] w-1/4">V0.110.0</td>
                    <td className="py-4 text-[#D2AAFA]">
                      H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td className="py-4 text-[#F3F5FB] w-1/4">
                      Cloud.Google.Com/Go
                    </td>
                    <td className="py-4 text-[#F3F5FB] w-1/4">V0.110.0</td>
                    <td className="py-4 text-[#D2AAFA]">
                      H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
