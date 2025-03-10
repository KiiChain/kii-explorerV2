"use client";

import React from "react";
import { UptimeDashboard } from "@/components/Uptime/UptimeDashboard";
import { useValidatorsWithUptime } from "@/services/queries/validators";

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

export default function UptimePage() {
  const { data: validators = [] } = useValidatorsWithUptime();

  return (
    <div className="px-6">
      <UptimeDashboard validators={validators} />
    </div>
  );
}
