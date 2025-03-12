import ProposalDetail from "@/components/Governance/ProposalDetail";
import { getProposalDetails } from "@/services/queries/governance";
import { Suspense } from "react";

async function ProposalData({ id }: { id: string }) {
  const proposal = await getProposalDetails(id);
  return <ProposalDetail proposal={proposal} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <Suspense fallback={<div className="px-20 py-12">Loading...</div>}>
        <ProposalData id={id} />
      </Suspense>
    </main>
  );
}
