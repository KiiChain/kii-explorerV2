import React from "react";
import { UptimeDashboard } from "@/components/Uptime/UptimeDashboard";

// Assuming you have some data to pass to UptimeDashboard
const validators = [
  // Example data
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
  // Add more validators as needed
];

export default function UptimePage() {
  return (
    <div className="p-6">
      <UptimeDashboard validators={validators} />
    </div>
  );
}
