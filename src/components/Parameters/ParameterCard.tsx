import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface ParameterCardProps {
  title: string;
  value: string;
}

export function ParameterCard({ title, value }: ParameterCardProps) {
  const { theme } = useTheme();

  return (
    <div className={`bg-[${theme.boxColor}] p-4 rounded-lg shadow-lg`}>
      <h3 className={`text-[${theme.secondaryTextColor}] text-sm`}>{title}</h3>
      <p className={`text-[${theme.primaryTextColor}] text-lg`}>{value}</p>
    </div>
  );
}
