"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { AvailableSlot, ConsultationType } from "@/types/availability";
import { AvailabilityCalendar } from "../availability-calendar";
import { BOOKING_CONSTANTS } from "./constants";

interface AvailabilityStepProps {
  attorneyId: Id<"attorneys">;
  consultationType: ConsultationType | null;
  duration: number | null;
  selectedSlot: AvailableSlot | null;
  onSlotSelect: (slot: AvailableSlot) => void;
}

export function AvailabilityStep({
  attorneyId,
  consultationType,
  duration,
  selectedSlot,
  onSlotSelect,
}: AvailabilityStepProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_CONSTANTS.AVAILABILITY_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_CONSTANTS.AVAILABILITY_STEP.SUBTITLE}
        </p>
      </div>

      <AvailabilityCalendar
        attorneyId={attorneyId}
        consultationType={consultationType || "video"}
        duration={duration || 60}
        onSlotSelected={onSlotSelect}
        showBookingModal={false}
      />

      {selectedSlot && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">
            {BOOKING_CONSTANTS.AVAILABILITY_STEP.SELECTED_SLOT}
          </h3>
          <p className="text-green-700">
            {new Date(selectedSlot.startTime).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <button
            onClick={() => onSlotSelect(selectedSlot)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1"
          >
            {BOOKING_CONSTANTS.AVAILABILITY_STEP.CHANGE_SELECTION}
          </button>
        </div>
      )}
    </div>
  );
}
