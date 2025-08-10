export const BOOKING_CONSTANTS = {
  TITLE: "Book Consultation",

  LABELS: {
    CONSULTATION_TYPE: "Consultation Type",
    DATE: "Date",
    TIME: "Time",
    DURATION: "Duration",
    CLIENT_NAME: "Full Name",
    CLIENT_EMAIL: "Email Address",
    CLIENT_PHONE: "Phone Number",
    PACKAGE: "Package",
    NOTES: "Notes",
  },

  PLACEHOLDERS: {
    CLIENT_NAME: "Enter your full name",
    CLIENT_EMAIL: "Enter your email address",
    CLIENT_PHONE: "Enter your phone number",
    NOTES: "Brief description of your legal matter...",
  },

  BUTTONS: {
    NEXT: "Next",
    BACK: "Back",
    BOOK: "Book Consultation",
    BOOKING: "Booking...",
    CANCEL: "Cancel",
    CLOSE: "Close",
  },

  STEPS: {
    DATETIME: "Date & Time",
    PACKAGE: "Package Selection",
    DETAILS: "Your Details",
  },

  CONSULTATION_TYPES: {
    HOURLY: {
      label: "Hourly Consultation",
      description: "Pay by the hour for legal consultation",
    },
    FIXED: {
      label: "Fixed Fee Package",
      description: "Choose from available fixed-price packages",
    },
  },

  DURATIONS: [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
    { value: 240, label: "4 hours" },
  ],

  BUSINESS_HOURS: {
    START: 9,
    END: 17,
  },

  LIMITS: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    NOTES_MAX: 500,
    DURATION_MIN: 30,
    DURATION_MAX: 480,
  },
} as const;
