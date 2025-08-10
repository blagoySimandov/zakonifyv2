"use client";

import Image from "next/image";
import { Attorney } from "@/types";
import { ATTORNEY_CARD_CONSTANTS } from "./constants";
import { ATTORNEY_CARD_MESSAGES } from "./messages";
import { DollarSign, User, Star, Video } from "lucide-react";
import { SEARCH_CONSTANTS } from "../attorney-search/constants";
import { ActionButtons } from "../action-buttons";
import { trpc } from "@/utils/trpc";
import { formatAvailabilitySlot } from "./hooks";

interface AttorneyCardProps {
  attorney: Attorney;
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  const {
    data: nextSlot,
    isLoading: isLoadingSlot,
    error,
  } = trpc.attorneys.getNextAvailableSlot.useQuery(
    {
      attorneyId: attorney._id,
      consultationType: "video", // Default to video consultation
      duration: 60,
    },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            {attorney.profileImage ? (
              <Image
                src={attorney.profileImage}
                alt={attorney.fullName}
                width={ATTORNEY_CARD_CONSTANTS.PROFILE_IMAGE_SIZE}
                height={ATTORNEY_CARD_CONSTANTS.PROFILE_IMAGE_SIZE}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {attorney.fullName}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {/* Star Rating */}
                <div className="flex items-center">
                  {Array.from(
                    { length: ATTORNEY_CARD_CONSTANTS.STAR_RATING_COUNT },
                    (_, i) => i + 1,
                  ).map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">
                  2 {ATTORNEY_CARD_MESSAGES.REVIEWS_TEXT}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {attorney.practiceAreas
                  .slice(0, ATTORNEY_CARD_CONSTANTS.MAX_PRACTICE_AREAS_DISPLAY)
                  .join(" • ")}{" "}
                • {attorney.location.city}
              </div>
            </div>

            {attorney.isVerified && (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                {ATTORNEY_CARD_MESSAGES.VERIFIED_TEXT}
              </span>
            )}
          </div>

          {/* Consultation Options */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Video className="w-4 h-4" />
              <span>{ATTORNEY_CARD_MESSAGES.VIDEO_CONSULTATIONS}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{ATTORNEY_CARD_MESSAGES.PUBLISHED_PRICES}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              <span className="text-blue-600">
                {SEARCH_CONSTANTS.AVAILABILITY.EARLIEST_SLOT}
              </span>{" "}
              <span className="font-medium">
                {isLoadingSlot
                  ? SEARCH_CONSTANTS.AVAILABILITY.LOADING
                  : error
                    ? SEARCH_CONSTANTS.AVAILABILITY.NO_AVAILABILITY
                    : formatAvailabilitySlot(nextSlot)}
              </span>
            </div>
          </div>

          <ActionButtons
            buttons={[
              {
                text: ATTORNEY_CARD_MESSAGES.VIEW_PROFILE_TEXT,
                href: `/attorneys/${attorney._id}`,
                variant: "primary",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
