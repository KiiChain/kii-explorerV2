"use client";

import React, { useState, useEffect } from "react";
import { BlocksHeader } from "@/components/headerDashboard";

export function BlocksDashboard() {
  const [activeTab, setActiveTab] = useState<"blocks" | "transactions">(
    "blocks"
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);
  }, []);

  return (
    <div className="p-6">
      {/* Header Component */}
      <BlocksHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Solo renderizar en el cliente para evitar discrepancias de hidratación */}
      {isClient && (
        <>
          {/* Grid de bloques - solo se muestra si activeTab es 'blocks' */}
          {activeTab === "blocks" && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index + 1}
                  className="bg-[#231C32] hover:bg-opacity-80 transition-colors duration-200 p-4 rounded-lg cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-white font-semibold">
                      Block {index + 1}
                    </div>
                    <div className="text-gray-400 text-sm">40s Ago</div>
                    <div className="text-gray-400 text-sm">
                      KiiChain Validator 1
                    </div>
                    <div className="text-gray-400 text-sm">5 Tx</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contenido de Recent Transactions - se muestra si activeTab es 'transactions' */}
          {activeTab === "transactions" && (
            <div className="text-gray-400 mt-6">
              Recent Transactions Content
            </div>
          )}
        </>
      )}
    </div>
  );
}
