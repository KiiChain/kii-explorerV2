"use client";

import type { NextPage } from "next";
import GovernanceList from "../../components/Governance/GovernanceList";
import { useTheme } from "@/context/ThemeContext";

const Governance: NextPage = () => {
  const { theme } = useTheme();

  return (
    <div className="mx-12 mt-20" style={{ backgroundColor: theme.boxColor }}>
      <GovernanceList />
    </div>
  );
};

export default Governance;
