"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useBlockDetails } from "@/services/queries/blockDetails";

interface BlockHeader {
  version: {
    block: string;
    app: string;
  };
  chain_id: string;
  height: string;
  time: string;
  proposer_address: string;
  app_hash: string;
}

interface JSONValue {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | JSONValue
    | JSONValue[]
    | Record<string, string | number | boolean | null>[];
}

export default function BlockPage({
  params,
}: {
  params: Promise<{ height: string }>;
}) {
  const resolvedParams = React.use(params);
  const { height } = resolvedParams;
  const { data: blockData } = useBlockDetails(height);
  const { theme } = useTheme();

  const formatJSON = (
    json:
      | BlockHeader
      | JSONValue
      | null
      | undefined
      | Array<Record<string, string | number | boolean | null>>
  ) => {
    if (!json) return "";
    return JSON.stringify(json, null, 2)
      .replace(/"(\w+)":/g, '<span style="color: #F3F5FB">"$1"</span>:')
      .replace(/: "(\d+)"/g, ': <span style="color: #F3F5FB">"$1"</span>')
      .replace(/: \[(.*?)\]/g, ': <span style="color: #F3F5FB">[$1]</span>')
      .replace(/: null/g, ': <span style="color: #D2AAFA">null</span>');
  };

  return (
    <div className="p-4 md:p-6 mx-2 md:mx-6">
      <div className="space-y-4 md:space-y-6">
        <div
          className="rounded-xl px-4 md:px-6 pb-4 md:pb-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <h2
            className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 px-4 md:px-6 pt-4 md:pt-6"
            style={{ color: theme.primaryTextColor }}
          >
            Block Summary
          </h2>
          <div className="px-2 md:px-6 space-y-3 md:space-y-4 text-xs md:text-sm">
            <div
              className="grid gap-2 md:gap-4"
              style={{ gridTemplateColumns: "100px 1fr" }}
            >
              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Block Hash</p>
              </div>
              <div
                className="rounded-lg p-2 break-all"
                style={{
                  color: theme.accentColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                {blockData?.block_id.hash}
              </div>

              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Height</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  color: theme.primaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                {blockData?.block.header.height}
              </div>

              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Chain ID</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: theme.bgColor }}
              >
                <span
                  className="px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm"
                  style={{
                    backgroundColor: theme.boxColor,
                    color: theme.accentColor,
                  }}
                >
                  {blockData?.block.header.chain_id}
                </span>
              </div>

              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Time</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  color: theme.primaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                {blockData?.block.header.time}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div
            className="rounded-xl p-4 md:p-6"
            style={{ backgroundColor: theme.bgCodeColor }}
          >
            <h2
              className="text-xl md:text-2xl font-semibold mb-4 md:mb-6"
              style={{ color: theme.primaryTextColor }}
            >
              Block Details
            </h2>
            <pre
              className="p-2 md:p-4 rounded-lg whitespace-pre-wrap text-xs md:text-sm overflow-x-auto"
              style={{
                backgroundColor: theme.bgCodeColor,
                color: "#00ff9d",
              }}
              dangerouslySetInnerHTML={{
                __html: formatJSON(blockData?.block.header),
              }}
            />
          </div>

          <div
            className="rounded-xl p-4 md:p-6"
            style={{ backgroundColor: theme.bgCodeColor }}
          >
            <h2
              className="text-xl md:text-2xl font-semibold mb-4 md:mb-6"
              style={{ color: theme.primaryTextColor }}
            >
              Signatures
            </h2>
            <pre
              className="p-2 md:p-4 rounded-lg whitespace-pre-wrap text-xs md:text-sm overflow-x-auto"
              style={{
                backgroundColor: theme.bgCodeColor,
                color: "#00ff9d",
              }}
              dangerouslySetInnerHTML={{
                __html: formatJSON(blockData?.block.last_commit.signatures),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
