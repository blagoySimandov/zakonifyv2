import {
  Calendar,
  Clock,
  Settings,
  LayoutTemplate as Template,
} from "lucide-react";

export const TABS = [
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    description: "Set your weekly working hours",
  },
  {
    id: "breaks",
    label: "Breaks",
    icon: Clock,
    description: "Configure lunch breaks and buffer times",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Consultation duration and pricing",
  },
  {
    id: "templates",
    label: "Templates",
    icon: Template,
    description: "Use predefined schedule templates",
  },
] as const;

export const SCHEDULE_CONSTANTS = {
  DAYS: {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
  },
  SCHEDULE_EDITOR: {
    TITLE: "Weekly Schedule",
    SUBTITLE: "Set your working hours for each day of the week",
  },
  CONSULTATION_SETTINGS: {
    TITLE: "Consultation Settings",
    SUBTITLE: "Configure consultation duration, pricing, and booking rules",
  },
} as const;

export const DEFAULTS = {
  TIMEZONE: "America/New_York",
} as const;

export const VALIDATION = {
  DURATION: {
    MIN: 15,
    MAX: 240,
  },
  BUFFER_TIME: {
    MIN: 0,
    MAX: 60,
  },
  CONSULTATIONS_PER_DAY: {
    MIN: 1,
    MAX: 20,
  },
  ADVANCE_BOOKING: {
    MIN_HOURS: 1,
    MAX_DAYS: 365,
  },
} as const;
