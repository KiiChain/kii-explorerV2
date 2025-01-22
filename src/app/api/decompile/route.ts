import { NextResponse } from "next/server";

const JSON_RPC_ENDPOINT =
  "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    console.log("Received address:", address);

    if (!address) {
      return NextResponse.json(
        { error: "Contract address is required" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(JSON_RPC_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getCode",
          params: [address, "latest"],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.result && data.result !== "0x") {
        const bytecodeInfo = analyzeContract(data.result);

        return NextResponse.json({
          source: bytecodeInfo,
          success: true,
          verified: false,
          bytecode: data.result,
        });
      } else {
        return NextResponse.json({
          source:
            `// No contract code found at ${address}\n` +
            `// This might be a regular address, not a contract`,
          success: false,
          verified: false,
        });
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json({
        source:
          `// Error fetching contract code\n` +
          `// Contract Address: ${address}\n` +
          `// Error: ${
            fetchError instanceof Error ? fetchError.message : "Unknown error"
          }`,
        success: false,
        error:
          fetchError instanceof Error ? fetchError.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch contract code",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function analyzeContract(bytecode: string): string {
  let analysis = `// Contract Analysis for bytecode\n\n`;

  bytecode = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;

  analysis += `/*\n`;
  analysis += ` * Contract Size: ${bytecode.length / 2} bytes\n`;

  if (bytecode.includes("60806040")) {
    analysis += ` * Contains constructor\n`;
  }

  if (bytecode.includes("5b")) {
    analysis += ` * Contains JUMPDEST opcodes (function entry points)\n`;
  }

  analysis += ` * Network: KiiChain Testnet Oro\n`;
  analysis += ` * Chain ID: 1336\n`;
  analysis += ` */\n\n`;

  analysis += `contract UnverifiedContract {\n`;
  analysis += `    // This contract's source code is not verified.\n`;

  analysis += `}\n`;

  return analysis;
}
