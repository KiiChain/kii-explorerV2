import React from "react";
import { UptimeDashboard } from "@/components/Uptime/UptimeDashboard";

const validators = [
  {
    id: 1,
    name: "Validator 1",
    uptime: "99%",
    lastJailedTime: "None",
    signedPrecommits: "100%",
    startHeight: 100,
    tombstoned: false,
  },
  {
    id: 2,
    name: "Validator 2",
    uptime: "98%",
    lastJailedTime: "Yesterday",
    signedPrecommits: "99%",
    startHeight: 200,
    tombstoned: false,
  },
];

export default function UptimePage() {
  return (
    <div className="px-6">
      <UptimeDashboard validators={validators} />
    </div>
  );
}
