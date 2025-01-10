import React, { useState, useEffect } from "react";

interface SmartContract {
  transaction: {
    hash: string;
    to: string | null;
    value: string;
  };
  sender: string;
  success: boolean;
  timestamp: number;
  BlockNumber: number;
  contractAddress: string;
}

interface SmartContractsResponse {
  success: boolean;
  errorMessage: string;
  smartContracts: SmartContract[];
  quantity: number;
  page: number;
}

function SmartContracts() {
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(
          "https://kii.backend.kiivalidator.com/explorer/smartContracts"
        );
        const data: SmartContractsResponse = await response.json();

        if (data.success) {
          setContracts(data.smartContracts);
        }
      } catch (error) {
        console.error("Error fetching smart contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {contracts.map((contract) => (
        <div key={contract.transaction.hash}>
          <h3>Contract Address: {contract.contractAddress}</h3>
          <p>Block Number: {contract.BlockNumber}</p>
          <p>Sender: {contract.sender}</p>
          <p>Status: {contract.success ? "Success" : "Failed"}</p>
          <p>Timestamp: {new Date(contract.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default SmartContracts;
