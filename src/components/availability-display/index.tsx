"use client";
import { Id } from "../../../convex/_generated/dataModel";
import { useNextAvailableSlot, useFormatAvailabilityDisplay } from "./hooks";
import { AVAILABILITY_DISPLAY_MESSAGES } from "./messages";

interface AvailabilityDisplayProps {
  attorneyId: Id<"attorneys">;
}

export function AvailabilityDisplay({ attorneyId }: AvailabilityDisplayProps) {
  const nextAvailableSlot = useNextAvailableSlot(attorneyId);
  const formattedAvailability = useFormatAvailabilityDisplay(nextAvailableSlot);

  return (
    <div className="mb-4">
      <div className="text-sm text-gray-600">
        <span className="text-blue-600">
          {AVAILABILITY_DISPLAY_MESSAGES.EARLIEST_AVAILABLE}:
        </span>{" "}
        <span className="font-medium">{formattedAvailability}</span>
      </div>
    </div>
  );
}

