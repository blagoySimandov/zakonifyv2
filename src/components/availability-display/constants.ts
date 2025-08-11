export const AVAILABILITY_DISPLAY_CONSTANTS = {
  LOCALE: "bg-BG",
  TIME_FORMAT_OPTIONS: {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false,
  },
  DATE_FORMAT_OPTIONS: {
    weekday: "long" as const,
  },
} as const;