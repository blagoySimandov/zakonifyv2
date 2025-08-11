"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Calendar, AttorneyLayout } from "@/components";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { MOCK_ATTORNEY_ID } from "@/constants";

type ConsultationWithMatter = Doc<"consultations"> & {
  matter?: Doc<"matters"> | null;
};

export default function AttorneyCalendar() {
  // In a real app, obtain the logged-in attorney id from auth/session
  const [attorneyId] = useState<string>(MOCK_ATTORNEY_ID);

  // Fetch consultations for calendar
  const consultations = useQuery(api.consultations.getByAttorneyId, {
    attorneyId: attorneyId as Id<"attorneys">,
    status: undefined,
  }) || [];

  return (
    <AttorneyLayout title="Calendar" attorneyId={attorneyId}>
      {/* Calendar - Full screen height */}
      <div className="flex-1 p-6 overflow-hidden">
        <Calendar
          consultations={consultations as ConsultationWithMatter[]}
          onConsultationClick={(consultation) => {
            // Handle consultation click, maybe scroll to consultation details
            console.log("Clicked consultation:", consultation);
          }}
        />
      </div>
    </AttorneyLayout>
  );
}
