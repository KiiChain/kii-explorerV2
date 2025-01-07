"use client";

import { UptimeHeader } from "@/components/Uptime/UptimeHeader";

export function StateSyncDashboard() {
  return (
    <div className="p-6 bg-[#05000F]">
      <UptimeHeader />

      <div className="pt-24">
        <div className="bg-[#231C32] p-10 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            What&apos;s State Sync?
          </h2>
          <p className="text-[#FFFFFF]">
            The Tendermint Core 0.34 release includes support for State Sync,
            which allows a new node to join a network by fetching a snapshot of
            the application state at a recent height instead of fetching and
            replaying all historical blocks. This can reduce the time needed to
            sync with the network from days to minutes. Click{" "}
            <a href="#" className="text-blue-500">
              here
            </a>{" "}
            for more information.
          </p>
        </div>

        <div className="bg-[#231C32] p-10 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">
            Starting New Node From State Sync
          </h2>
          <ol className="list-decimal list-inside text-[#FFFFFF]">
            <li>
              Install Binary (Kiichain Version: 71882bc)
              <p className="ml-4">
                We need to install the binary first and make sure that the
                version is the one currently in use on mainnet.
              </p>
            </li>
            <li className="mt-2">
              Enable State Sync
              <p className="ml-4">
                We can configure Tendermint to use State Sync in
                $DAEMON_HOME/config/config.toml.
              </p>
            </li>
          </ol>

          <div className="bg-[#05000F] p-4 rounded-lg shadow-lg mt-4 overflow-x-auto">
            <div className="flex space-x-2 mb-2 pl-8 pt-8">
              <div className="w-3.5 h-3.5 bg-[#787779] rounded-full"></div>
              <div className="w-3.5 h-3.5 bg-[#787779] rounded-full"></div>
              <div className="w-3.5 h-3.5 bg-[#787779] rounded-full"></div>
            </div>
            <pre className="text-[#FFFFFF] pl-8 pb-8">
              <code>
                {`>  [state-sync]
>  enable = true
>
>  rpc_servers = "https://a.sentry.testnet.kiivalidator.com:26658,https://b.sentry.testnet.kiivalidator.com:26658"
>  trust_height = 800000
>  trust_hash = "1697AC815D2A0367173530BEAD5D126868736AD172613586CF43240D8EF2E050"
>
>  # 2/3 of unbonding time
>  trust_period = "168h"`}
              </code>
            </pre>
          </div>

          <p className="text-[#FFFFFF] mt-4">
            3. Start the daemon:{" "}
            <code className="text-[#ABABAB] bg-[#05000F]">kiichaind start</code>
            <br />
            If you are resetting node, run{" "}
            <code className="text-[#ABABAB] bg-[#05000F]">
              kiichaind unsafe-reset-all
            </code>{" "}
            or{" "}
            <code className="text-[#ABABAB] bg-[#05000F]">
              kiichaind tendermint unsafe-reset-all --home ~/.HOME
            </code>{" "}
            before you start the daemon.
          </p>
        </div>
      </div>
    </div>
  );
}
