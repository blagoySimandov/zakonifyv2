import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AVAILABILITY_DISPLAY_CONSTANTS } from "./constants";
import { AVAILABILITY_DISPLAY_MESSAGES } from "./messages";

export const useNextAvailableSlot = (attorneyId: Id<"attorneys">) => {
  return useQuery(api.availability.getNextAvailableSlot, {
    attorneyId,
    consultationType: "video",
  });
};

export const useFormatAvailabilityDisplay = (nextAvailableSlot: { startTime: number } | null | undefined) => {
  if (nextAvailableSlot === undefined) {
    return AVAILABILITY_DISPLAY_MESSAGES.LOADING_AVAILABILITY;
  }

  if (nextAvailableSlot === null) {
    return AVAILABILITY_DISPLAY_MESSAGES.NO_AVAILABILITY;
  }

  const slotDate = new Date(nextAvailableSlot.startTime);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const slotDay = new Date(
    slotDate.getFullYear(),
    slotDate.getMonth(),
    slotDate.getDate(),
  );

  const time = slotDate.toLocaleTimeString(
    AVAILABILITY_DISPLAY_CONSTANTS.LOCALE,
    AVAILABILITY_DISPLAY_CONSTANTS.TIME_FORMAT_OPTIONS,
  );

  let day;
  if (slotDay.getTime() === today.getTime()) {
    day = AVAILABILITY_DISPLAY_MESSAGES.TODAY;
  } else if (slotDay.getTime() === tomorrow.getTime()) {
    day = AVAILABILITY_DISPLAY_MESSAGES.TOMORROW;
  } else {
    day = slotDate.toLocaleDateString(
      AVAILABILITY_DISPLAY_CONSTANTS.LOCALE,
      AVAILABILITY_DISPLAY_CONSTANTS.DATE_FORMAT_OPTIONS,
    );
  }

  return `${day} ${AVAILABILITY_DISPLAY_MESSAGES.TIME_SEPARATOR} ${time}`;
};