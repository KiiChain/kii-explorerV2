"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface TransactionDetails {
  tx_hash: string;
  height: string;
  status: string;
  gas: string;
  raw_log: string;
}

interface TransactionLog {
  address: string;
  topics: string[];
  data: string;
}

interface JsonResponse {
  BlockHash: string;
  BlockNumber: string;
  ContractAddress: string | null;
  CumulativeGasUsed: string;
  EffectiveGasPrice: string;
  From: string;
  GasUsed: string;
  Logs: TransactionLog[];
  LogsBloom: string;
  Status: string;
  To: string;
  TransactionHash: string;
  TransactionIndex: number;
  Type: string;
}

interface EventAttribute {
  key: string;
  value: string;
}

interface Event {
  type: string;
  attributes: EventAttribute[];
}

interface EventData {
  [key: string]: {
    [key: string]: string;
  };
}

export default function TransactionPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const hash = React.use(params).hash;
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  const [jsonView, setJsonView] = useState<JsonResponse | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [sourceCode, setSourceCode] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/tx/v1beta1/txs/${hash}`
        );
        const data = await response.json();

        setTxDetails({
          tx_hash: data.tx_response.txhash,
          height: data.tx_response.height,
          status: data.tx_response.code === 0 ? "Success" : "Failed",
          gas: `${data.tx_response.gas_used} KII`,
          raw_log: data.tx_response.raw_log,
        });

        const message = data.tx_response.tx?.body?.messages?.[0] || {};

        setJsonView({
          BlockHash: data.tx_response.txhash,
          BlockNumber: data.tx_response.height,
          ContractAddress: message.contract_address || null,
          CumulativeGasUsed: data.tx_response.gas_used,
          EffectiveGasPrice: data.tx_response.gas_wanted || "0",
          From: message.from_address || message.sender || "",
          GasUsed: data.tx_response.gas_used,
          Logs: data.tx_response.logs || [],
          LogsBloom: "",
          Status: data.tx_response.code === 0 ? "Success" : "Failed",
          To: message.to_address || message.recipient || "",
          TransactionHash: data.tx_response.txhash,
          TransactionIndex: 0,
          Type: message["@type"] || "Unknown",
        });

        if (data.tx_response.logs && data.tx_response.logs.length > 0) {
          const events = data.tx_response.logs[0].events;
          const formattedEvents = events.reduce(
            (acc: Record<string, Record<string, string>>, event: Event) => {
              const attributes = event.attributes.reduce(
                (attrs: Record<string, string>, attr: EventAttribute) => {
                  attrs[attr.key] = attr.value;
                  return attrs;
                },
                {}
              );
              acc[event.type] = attributes;
              return acc;
            },
            {}
          );
          setEventData(formattedEvents);
        }

        setSourceCode("// Contract source code not available");
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    if (hash) {
      fetchTransactionDetails();
    }
  }, [hash]);

  const formatJSON = (json: JsonResponse | EventData | null) => {
    if (!json) return "";

    return JSON.stringify(json, null, 2)
      .replace(/"(\w+)":/g, '<span style="color: #F3F5FB">"$1"</span>:')
      .replace(/: "(\d+)"/g, ': <span style="color: #F3F5FB">"$1"</span>')
      .replace(/: \[(.*?)\]/g, ': <span style="color: #F3F5FB">[$1]</span>')
      .replace(/: null/g, ': <span style="color: #D2AAFA">null</span>');
  };

  const formatSourceCode = (code: string) => {
    return code
      .split("\n")
      .map(
        (line, index) =>
          `<div class="flex">
            <span style="color: #D2AAFA; min-width: 2rem; margin-right: 1rem; text-align: right">${
              index + 1
            }</span>
            <span style="color: #F3F5FB">${line}</span>
          </div>`
      )
      .join("");
  };

  return (
    <div className="p-6 mx-6">
      <div className="space-y-6">
        <div
          className="rounded-xl px-6 pb-6"
          style={{ backgroundColor: theme.boxColor }}
        >
          <h2
            className="text-2xl font-semibold mb-6 px-6 pt-6"
            style={{ color: theme.primaryTextColor }}
          >
            Summary
          </h2>
          <div className="px-6 space-y-4 text-xs">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "124px 1fr" }}
            >
              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Tx Hash</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  color: theme.accentColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                {txDetails?.tx_hash}
              </div>
            </div>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "124px 1fr" }}
            >
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
                {txDetails?.height}
              </div>
            </div>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "124px 1fr" }}
            >
              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Status</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: theme.bgColor }}
              >
                <span
                  className="px-3 py-1 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.boxColor,
                    color: theme.accentColor,
                  }}
                >
                  {txDetails?.status}
                </span>
              </div>
            </div>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "124px 1fr" }}
            >
              <div
                className="rounded-lg"
                style={{
                  color: theme.secondaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                <p className="p-2">Gas</p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  color: theme.primaryTextColor,
                  backgroundColor: theme.bgColor,
                }}
              >
                {txDetails?.gas}
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: theme.bgCodeColor }}
        >
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: theme.primaryTextColor }}
          >
            JSON
          </h2>
          <pre
            className="p-4 rounded-lg whitespace-pre-wrap text-xs"
            style={{
              backgroundColor: theme.bgCodeColor,
              color: "#00ff9d",
              fontSize: "0.875rem",
            }}
            dangerouslySetInnerHTML={{ __html: formatJSON(jsonView) }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: theme.bgCodeColor }}
          >
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: theme.primaryTextColor }}
            >
              Events
            </h2>
            <pre
              className="p-4 rounded-lg whitespace-pre-wrap text-xs"
              style={{
                backgroundColor: theme.bgCodeColor,
                color: "#00ff9d",
                fontSize: "0.875rem",
              }}
              dangerouslySetInnerHTML={{
                __html: formatJSON(eventData),
              }}
            />
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: theme.bgCodeColor }}
          >
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bgCodeColor }}
            >
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ color: theme.primaryTextColor }}
              >
                Source Code
              </h2>
              <pre
                className="p-4 rounded-lg whitespace-pre-wrap text-xs"
                style={{
                  color: "#00ff9d",
                  fontSize: "0.875rem",
                }}
                dangerouslySetInnerHTML={{
                  __html: formatSourceCode(sourceCode),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
