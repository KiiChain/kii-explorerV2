import ProposalDetail from "@/components/Governance/ProposalDetail";

const mockProposal = {
  id: "5",
  type: "cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
  title: "Upgrade v2.0.0",
  description: "Upgrade v2.0.0",
  status: "PASSED",
  plan: {
    name: "v2.0.0",
    time: "-",
    height: "-",
    info: "-",
    upgradedClientState: "-",
  },
  tally: {
    turnout: 82.67,
    yes: 100,
    no: 0,
    noWithVeto: 0,
    abstain: 0,
  },
  timeline: {
    submitted: "2025-02-24 10:04",
    deposited: "2025-02-24 10:04",
    votingStart: "2025-02-24 10:04",
    votingEnd: "2025-02-24 22:04",
    upgradePlan: "0 days 0 hours 0 minutes 0 seconds",
  },
};

export default function Page() {
  return (
    <main>
      <ProposalDetail proposal={mockProposal} />
    </main>
  );
}
