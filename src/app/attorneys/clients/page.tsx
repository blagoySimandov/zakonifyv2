"use client";

import { useState } from "react";
import { trpc } from "@/utils";
import { AttorneyLayout, ClientsSection } from "@/components";
import { MOCK_ATTORNEY_ID } from "@/constants";

export default function AttorneyClients() {
  // In a real app, obtain the logged-in attorney id from auth/session
  const [attorneyId] = useState<string>(MOCK_ATTORNEY_ID);

  // Fetch clients for this attorney
  const { data: clients = [] } = trpc.clients.getByAttorneyId.useQuery({
    attorneyId,
  });

  return (
    <AttorneyLayout title="Clients" attorneyId={attorneyId}>
      {/* Clients Section - Full screen height */}
      <div className="flex-1 p-6 overflow-hidden">
        <ClientsSection clients={clients} />
      </div>
    </AttorneyLayout>
  );
}
