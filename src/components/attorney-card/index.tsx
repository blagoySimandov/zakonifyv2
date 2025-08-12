"use client";

import { Attorney } from "@/types";
import { ATTORNEY_CARD_MESSAGES } from "./messages";
import { ActionButtons } from "../action-buttons";
import { AttorneyProfileImage } from "../attorney-profile-image";
import { AttorneyHeader } from "../attorney-header";
import { VerificationBadge } from "../verification-badge";
import { ConsultationFeatures } from "../consultation-features";
import { AvailabilityDisplay } from "../availability-display";

interface AttorneyCardProps {
  attorney: Attorney;
  attorneyProfileHref: string;
}

export function AttorneyCard({
  attorney,
  attorneyProfileHref,
}: AttorneyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        <AttorneyProfileImage
          profileImageStorageId={attorney.profileImageStorageId}
          fullName={attorney.fullName}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <AttorneyHeader
              fullName={attorney.fullName}
              practiceAreas={attorney.practiceAreas}
              location={attorney.location}
              attorneyId={attorney._id}
            />
            <VerificationBadge isVerified={attorney.isVerified} />
          </div>

          <ConsultationFeatures />
          <AvailabilityDisplay attorneyId={attorney._id} />

          <ActionButtons
            buttons={[
              {
                text: ATTORNEY_CARD_MESSAGES.BOOK_CONSULTATION,
                href: attorneyProfileHref,
                variant: "primary",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
