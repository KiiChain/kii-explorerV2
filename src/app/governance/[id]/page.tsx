import ProposalDetail from "@/components/Governance/ProposalDetail";
import { getProposalDetails } from "@/services/queries/governance";
import { Suspense } from "react";

// Componente para cargar los datos
async function ProposalData({ id }: { id: string }) {
  const proposal = await getProposalDetails(id);
  return <ProposalDetail proposal={proposal} />;
}

// Página principal
export default function Page({ params }: { params: { id: string } }) {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ProposalData id={params.id} />
      </Suspense>
    </main>
  );
}
