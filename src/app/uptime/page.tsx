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

async function getValidators() {
  const response = await fetch(
    "https://uno.sentry.testnet.v3.kiivalidator.com/cosmos/staking/v1beta1/validators?pagination.limit=200&status=BOND_STATUS_BONDED"
  );
  const data = await response.json();

  return data.validators.map((validator: ValidatorResponse) => ({
    operatorAddress: validator.operator_address,
    moniker: validator.description.moniker,
    status: validator.status,
    tokens: validator.tokens,
    commission: validator.commission.commission_rates.rate,
    website: validator.description.website,
    jailed: validator.jailed,
  }));
}

export default async function UptimePage() {
  const validators = await getValidators();

  return (
    <div className="px-6">
      <UptimeDashboard validators={validators} />
    </div>
  );
}
