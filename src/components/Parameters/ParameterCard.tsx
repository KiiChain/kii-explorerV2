// src/components/Parameters/ParameterCard.tsx
import React from "react";

interface ParameterCardProps {
  title: string;
  value: string;
}

export function ParameterCard({ title, value }: ParameterCardProps) {
  return (
    <div className="bg-[#231C32] p-4 rounded-lg shadow-lg">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-[#F3F5FB] text-lg">{value}</p>
    </div>
  );
}
