import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
}

function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <Card className="bg-[#1A1A1A]/40 border-0">
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

export function Dashboard() {
  return (
    <div className="absolute inset-0 overflow-auto">
      <div className="min-h-full w-full max-w-[2000px] mx-auto px-4 py-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid gap-6 md:gap-8 xl:gap-10 2xl:gap-12 auto-rows-min">
          {/* Primera fila - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
            <StatCard title="KII Price" value="N/A" unit="TESTNET" />
            <StatCard title="Gas Price" value="2500" unit="Tekii" />
            <StatCard title="Transactions" value="333,422" />
            <StatCard title="Block Height" value="2,577,053" />
          </div>

          {/* Segunda fila - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            <StatCard title="Height" value="2,576,146" />
            <StatCard title="Validators" value="3" />
            <StatCard title="Supply" value="1,800,000,000" />
          </div>

          {/* Tercera fila - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            <StatCard title="Bonded Tokens" value="300,000" />
            <StatCard title="Inflation" value="0%" />
            <StatCard title="Community Pool" value="-" />
          </div>

          {/* Wallet Status */}
          <Card className="bg-[#1A1A1A]/40 border-0">
            <CardContent className="flex items-center p-4 md:p-6">
              <span className="text-muted-foreground text-sm md:text-base">
                Wallet not connected
              </span>
            </CardContent>
          </Card>

          {/* Latest Blocks & Transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 xl:gap-8">
            <Card className="bg-[#1A1A1A]/40 border-0">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg xl:text-xl font-normal">
                  Latest Blocks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* Contenido de Latest Blocks */}
              </CardContent>
            </Card>
            <Card className="bg-[#1A1A1A]/40 border-0">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="text-base md:text-lg xl:text-xl font-normal">
                  Latest transactions
                </CardTitle>
                <span className="text-sm md:text-base text-muted-foreground hover:text-white cursor-pointer">
                  View All
                </span>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* Contenido de Latest Transactions */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
