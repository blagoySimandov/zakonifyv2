import { SEARCH_CONSTANTS } from "../attorney-search/constants";

/**
 * Maps English day strings from the API to localized translations
 */
export function translateDay(day: string): string {
  switch (day.toLowerCase()) {
    case "today":
      return SEARCH_CONSTANTS.AVAILABILITY.TODAY;
    case "tomorrow":
      return SEARCH_CONSTANTS.AVAILABILITY.TOMORROW;
    default:
      // For other days like weekday names, return as is for now
      // Could be extended to translate weekday names if needed
      return day;
  }
}

/**
 * Formats availability slot display text with proper localized translation
 */
export function formatAvailabilitySlot(
  slot: { day: string; time: string } | null | undefined
): string {
  if (!slot) {
    return SEARCH_CONSTANTS.AVAILABILITY.NO_AVAILABILITY;
  }

  const translatedDay = translateDay(slot.day);
  return `${translatedDay} в ${slot.time}`;
}