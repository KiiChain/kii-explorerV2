"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { ethers } from "ethers";
import {
  WalletIcon,
  ContractIcon,
  HeightIcon,

  ValidatorsIcon,
  CashIcon,
  BondedTokensIcon,
  InflationIcon,
  CommunityPoolIcon,

  CashIcon,
  CommunityPoolIcon,
  ValidatorsIcon,
  BondedTokensIcon,
  InflationIcon,

} from "./ui/icons";
import { useRouter } from "next/navigation";
import { UptimeHeader } from "@/components/Uptime/UptimeHeader";
import { useTheme } from "@/context/ThemeContext";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  variant?: "default" | "horizontal";

  className?: string;
  style?: React.CSSProperties;

}

function StatCard({
  title,
  value,
  unit,
  icon,
  variant = "default",
}: StatCardProps) {

  const { theme } = useTheme();

  if (variant === "horizontal") {
    return (
      <Card className={`bg-[${theme.boxColor}] border-0`}>

        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}

              <span
                className={`text-sm xl:text-base font-normal text-[${theme.secondaryTextColor}]`}
              >
                {title}
              </span>
            </div>
            <div
              className={`text-xl md:text-2xl xl:text-3xl font-bold text-[${theme.secondaryTextColor}]`}
            >
              {value}
              {unit && (
                <span
                  className={`pl-1 ml-1 text-[10px] xl:text-xs text-[${theme.secondaryTextColor}]`}
                >

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
    <Card className={`bg-[${theme.boxColor}] border-0`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        <CardTitle
          className={`text-sm xl:text-base font-normal text-[${theme.secondaryTextColor}]`}
        >

          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>

        <div
          className={`text-xl md:text-2xl xl:text-3xl font-bold text-[${theme.secondaryTextColor}]`}
        >
          {value}
          {unit && (
            <span
              className={`pl-1 ml-1 text-[10px] xl:text-xs text-[${theme.secondaryTextColor}]`}
            >

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
  const { theme } = useTheme();
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
    <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
      <UptimeHeader />
      <div className="px-6 pt-12"></div>

      <div
        className="pt-6 rounded-xl mb-6"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
          style={{ backgroundColor: theme.bgColor }}
        >
          <StatCard
            title="KII Price"
            value="N/A"
            unit="TESTNET"
            style={{ backgroundColor: theme.boxColor }}
          />
          <StatCard
            title="Gas Price"
            value="2500"
            unit="Tekii"
            style={{ backgroundColor: theme.boxColor }}
          />
          <StatCard
            title="Transactions"
            value="333,422"
            style={{ backgroundColor: theme.boxColor }}
          />
          <StatCard
            title="Block Height"
            value="2,577,053"
            style={{ backgroundColor: theme.boxColor }}
          />

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Height"
            value="2,576,146"

            icon={
              <HeightIcon
                className={`w-5 h-5 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
          <StatCard
            title="Validators"
            value="3"

            icon={
              <ValidatorsIcon
                className={`w-5 h-5 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
          <StatCard
            title="Supply"
            value="1,800,000,000"

            icon={
              <CashIcon
                className={`w-5 h-5 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Bonded Tokens"
            value="300,000"

            icon={
              <BondedTokensIcon
                className={`w-5 h-5 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
          <StatCard
            title="Inflation"
            value="0%"

            icon={
              <InflationIcon
                className={`w-4 h-4 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
          <StatCard
            title="Community Pool"
            value="-"

            icon={
              <CommunityPoolIcon
                className={`w-5 h-5 text-[${theme.secondaryTextColor}]`}
              />
            }

            variant="horizontal"
          />
        </div>

        <Card
          className="border-0 mt-6"
          style={{ backgroundColor: `${theme.boxColor}` }}
        >
          <CardContent className="p-6">
            {!account ? (
              <button
                onClick={connectWallet}
                className={`flex items-center gap-2 px-4 py-2 text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
              >
                <WalletIcon />
                Wallet not connected
              </button>
            ) : (
              <div className="space-y-6">
                <div
                  className="text-xl mb-4"
                  style={{ color: theme.primaryTextColor }}
                >
                  {account}
                </div>

                <div className="grid grid-cols-4 gap-4 ">
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Balance</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.balance}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${session?.balance}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Staking</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.staking}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${session?.staking}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Reward</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
                      {session?.reward}
                    </div>
                    <div className="text-sm text-gray-400">$0</div>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="text-gray-400">Withdrawals</div>
                    <div
                      className="text-lg"
                      style={{ color: theme.primaryTextColor }}
                    >
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
                          className={`border-t border-[${theme.borderColor}] bg-[${theme.bgColor}]`}
                        >
                          <td
                            className={`p-4 text-[${theme.primaryTextColor}]`}
                          >
                            {stake.validator}
                          </td>
                          <td
                            className={`p-4 text-[${theme.primaryTextColor}]`}
                          >
                            {stake.amount}
                          </td>
                          <td
                            className={`p-4 text-[${theme.primaryTextColor}]`}
                          >
                            {stake.rewards}
                          </td>
                          <td className="p-4">
                            <button
                              className={`px-4 py-2 bg-[${theme.boxColor}] text-[${theme.accentColor}] rounded-lg hover:opacity-80`}
                            >
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
                    className={`px-8 py-3 bg-[${theme.boxColor}] text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
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
                  <button
                    className={`px-8 py-3 bg-[${theme.boxColor}] text-[${theme.primaryTextColor}] rounded-lg hover:opacity-80`}
                  >
                    Create Stake
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className={`bg-[${theme.boxColor}] border-0`}>
            <div className={`p-6 bg-[${theme.boxColor}]`}>
              <div className="flex justify-between items-center">
                <div className="flex gap-6 flex-1">
                  <div className={`text-[${theme.primaryTextColor}]`}>
                    Latest Blocks
                  </div>
                  <div className={`text-[${theme.primaryTextColor}] ml-[30%]`}>
                    Latest transactions
                  </div>
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
                        style={{ backgroundColor: theme.bgColor }}
                        className="rounded-lg mb-4 w-full"
                      >
                        <td className="p-4 grid grid-cols-12 gap-4 items-center">
                          <span
                            className={`text-[${theme.accentColor}] col-span-2 flex items-center gap-2`}
                          >
                            <ContractIcon className="w-4 h-4" />
                            <span
                              className={`text-[${theme.secondaryTextColor}]`}
                            >
                              2578179
                            </span>
                          </span>
                          <div className="flex items-center gap-2 col-span-3">
                            <span
                              className={`text-[${theme.secondaryTextColor}]`}
                            >
                              Fee Recipient
                            </span>
                            <span className={`text-[${theme.accentColor}]`}>
                              Kiichain Validator 1
                            </span>
                          </div>
                          <span
                            className={`text-[${theme.accentColor}] col-span-2 flex items-center gap-2`}
                          >
                            <ContractIcon className="w-4 h-4" />
                            <span
                              className={`text-[${theme.secondaryTextColor}]`}
                            >
                              0x4f02c2fb1798
                            </span>
                          </span>
                          <div className="flex flex-col col-span-3">
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-[${theme.secondaryTextColor}]`}
                                >
                                  From:
                                </span>
                                <span className={`text-[${theme.accentColor}]`}>
                                  0xf61aE263853B62Ce48...
                                </span>
                              </div>
                            </span>
                            <span className="text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-[${theme.secondaryTextColor}]`}
                                >
                                  To:
                                </span>
                                <span className={`text-[${theme.accentColor}]`}>
                                  0x7f32360b4ea9bf2682...
                                </span>
                              </div>
                            </span>
                          </div>
                          <span
                            style={{ backgroundColor: theme.boxColor }}
                            className={`text-[${theme.accentColor}] px-3 py-1 rounded-full col-span-2 text-center inline-block w-fit`}
                          >
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
          <Card className={`bg-[${theme.bgColor}] border-0`}>
            <div className="p-6">
              <h2 className={`text-[${theme.primaryTextColor}] text-xl mb-6`}>
                Application Versions
              </h2>

              <table className="w-full">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Name
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Kiichain
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      App_name
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Kiichaind
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Version
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      26c1fe7
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Git_commit
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      87eefca1ad86ec69374874c25558f430afdb5555c8
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Build_tags
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      App_v1
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Go_version
                    </td>
                    <td className={`py-4 text-[${theme.secondaryTextColor}]`}>
                      Go Version Go1.19 Linux/Amd64
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full mt-4">
                <tbody>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td
                      className={`py-4 text-[${theme.secondaryTextColor}] w-1/4`}
                    >
                      Cloud.Google.Com/Go
                    </td>
                    <td
                      className={`py-4 text-[${theme.secondaryTextColor}] w-1/4`}
                    >
                      V0.110.0
                    </td>
                    <td className={`py-4 text-[${theme.accentColor}]`}>
                      H1:Zc8gqp3+A9/Eyph2KDmcGaPtbKRloqq4YTlL4NMD0Ys=Cloud
                    </td>
                  </tr>
                  <tr className="border-b border-[#231C32]/50">
                    <td className="py-4 w-1/4"></td>
                    <td
                      className={`py-4 text-[${theme.secondaryTextColor}] w-1/4`}
                    >
                      Cloud.Google.Com/Go
                    </td>
                    <td
                      className={`py-4 text-[${theme.secondaryTextColor}] w-1/4`}
                    >
                      V0.110.0
                    </td>
                    <td className={`py-4 text-[${theme.accentColor}]`}>
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
