import React from "react";
import { UptimeDashboard } from "@/components/Uptime/UptimeDashboard";

export interface ValidatorResponse {
  operator_address: string;
  description: {
    moniker: string;
    website: string;
  };
  status: string;
  tokens: string;
  commission: {
    commission_rates: {
      rate: string;
    };
  };
  jailed: boolean;
}

async function fetchValidators() {
  try {
    const response = await fetch(
      "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators"
    );
    const data = await response.json();
    return data.validators.map((v: ValidatorResponse) => ({
      operatorAddress: v.operator_address,
      moniker: v.description.moniker,
      status: v.status,
      tokens: v.tokens,
      commission: v.commission.commission_rates.rate,
      website: v.description.website,
      jailed: v.jailed,
      uptime: 0,
    }));
  } catch (error) {
    console.error("Error fetching validators:", error);
    return [];
  }
}

export default async function UptimePage() {
  const validators = await fetchValidators();

  return (
    <div className="px-6">
      <UptimeDashboard validators={validators} />
    </div>
  );
}
