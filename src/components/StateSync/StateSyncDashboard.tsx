"use client";

import { CHAIN_RPC_ENDPOINT } from "@/config/chain";
import { useTheme } from "@/context/ThemeContext";
import { useStateSyncInfo } from "@/services/queries/stateSync";

export function StateSyncDashboard() {
  const { theme } = useTheme();
  const { data: blockInfo } = useStateSyncInfo();

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="px-6">
      <div className="pt-20">
        <div
          style={{ backgroundColor: theme.boxColor }}
          className="p-10 rounded-lg shadow-lg mb-6"
        >
          <h2
            style={{ color: theme.primaryTextColor }}
            className="text-xl font-bold mb-2"
          >
            <p className="text-base">What&apos;s State Sync?</p>
          </h2>
          <p
            className="text-base pt-1"
            style={{ color: theme.primaryTextColor }}
          >
            The Tendermint Core 0.34 release includes support for State Sync,
            which allows a new node to join a network by fetching a snapshot of
            the application state at a recent height instead of fetching and
            replaying all historical blocks. This can reduce the time needed to
            sync with the network from days to minutes. Click{" "}
            <a
              href="https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f"
              style={{ color: theme.accentColor }}
            >
              here
            </a>{" "}
            for more information.
          </p>
        </div>

        <div
          style={{ backgroundColor: theme.boxColor }}
          className="p-10 rounded-lg shadow-lg"
        >
          <h2
            style={{ color: theme.primaryTextColor }}
            className="text-xl font-semibold mb-2"
          >
            <p className="text-base">Starting New Node From State Sync</p>
          </h2>
          <ol
            style={{ color: theme.primaryTextColor }}
            className="list-decimal list-inside text-base pt-1"
          >
            <li>
              Install Binary (Kiichain Version: v3)
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

          <div
            style={{ backgroundColor: "#05000F" }}
            className="p-4 rounded-lg shadow-lg mt-4 overflow-x-auto"
          >
            <div className="flex space-x-2 mb-2 pl-8 py-8">
              <div
                className="rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#787779",
                  opacity: 1,
                }}
              ></div>
              <div
                className="rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#787779",
                  opacity: 1,
                }}
              ></div>
              <div
                className="rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#787779",
                  opacity: 1,
                }}
              ></div>
            </div>
            <pre className="pl-8 pb-8">
              <code>
                <span style={{ color: "#787779" }}>{"> "}</span>
                <span style={{ color: "#FFFFFF" }}>[state-sync]</span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#FFFFFF" }}> enable = </span>
                <span style={{ color: "#FFFFFF" }}>true</span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#FFFFFF" }}> rpc_servers = </span>
                <span style={{ color: "#FFFFFF" }}>
                  &quot;{CHAIN_RPC_ENDPOINT}&quot;
                </span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#FFFFFF" }}> trust_height = </span>
                <span style={{ color: "#FFFFFF" }}>{blockInfo?.height}</span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#FFFFFF" }}> trust_hash = </span>
                <span style={{ color: "#FFFFFF" }}>
                  &quot;{blockInfo?.hash}&quot;
                </span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#00F9A6" }}>
                  # 2/3 of unbonding time
                </span>
                <br />
                <span style={{ color: "#787779" }}>{">"}</span>
                <span style={{ color: "#FFFFFF" }}> trust_period = </span>
                <span style={{ color: "#FFFFFF" }}>&quot;168h&quot;</span>
              </code>
            </pre>
          </div>

          <p
            className="mt-4 text-base"
            style={{ color: theme.primaryTextColor }}
          >
            3. Start the daemon:{" "}
            <code
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.bgColor,
              }}
            >
              kiichaind start
            </code>
            <br />
            If you are resetting node, run{" "}
            <code
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.bgColor,
              }}
            >
              kiichaind unsafe-reset-all
            </code>{" "}
            or{" "}
            <code
              style={{
                color: theme.secondaryTextColor,
                backgroundColor: theme.bgColor,
              }}
            >
              kiichaind tendermint unsafe-reset-all --home ~/.HOME
            </code>{" "}
            before you start the daemon.
          </p>
        </div>
      </div>
    </div>
  );
}
