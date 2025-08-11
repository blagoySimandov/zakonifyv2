"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AttorneyLayout, ClientsSection } from "@/components";
import { MOCK_ATTORNEY_ID } from "@/constants";

export default function AttorneyClients() {
  // In a real app, obtain the logged-in attorney id from auth/session
  const [attorneyId] = useState<string>(MOCK_ATTORNEY_ID);

  // Fetch clients for this attorney
  const clients = useQuery(api.clients.getByAttorneyId, {
    attorneyId: attorneyId as Id<"attorneys">,
  }) || [];

  return (
    <AttorneyLayout title="Clients" attorneyId={attorneyId}>
      {/* Clients Section - Full screen height */}
      <div className="flex-1 p-6 overflow-hidden">
        <ClientsSection clients={clients} />
      </div>
    </AttorneyLayout>
  );
}
