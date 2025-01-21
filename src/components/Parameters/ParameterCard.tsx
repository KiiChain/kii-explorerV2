import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface ParameterCardProps {
  title: string;
  value: string;
}

export function ParameterCard({ title, value }: ParameterCardProps) {
  const { theme } = useTheme();

  return (
    <div
      style={{ backgroundColor: theme.boxColor }}
      className="p-4 rounded-lg shadow-lg"
    >
      <h3 style={{ color: theme.secondaryTextColor }} className="text-sm">
        {title}
      </h3>
      <p
        style={{ color: theme.primaryTextColor }}
        className="text-base text-bold pt-1"
      >
        {value}
      </p>
    </div>
  );
}
