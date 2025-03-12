import ProposalDetail from "@/components/Governance/ProposalDetail";
import { Suspense } from "react";

async function ProposalData({ id }: { id: string }) {
  return <ProposalDetail proposalId={id} />;
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
