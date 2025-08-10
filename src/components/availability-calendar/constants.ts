export const CALENDAR_CONSTANTS = {
  TITLE: "Book a Consultation",
  SUBTITLE: "Select an available time slot to schedule your consultation",
  LOADING_MESSAGE: "Loading availability...",
  ERROR_LOADING: "Unable to load availability",
  NO_AVAILABILITY: "No available times",
  TRY_DIFFERENT_DATES:
    "Try selecting different dates or adjust your preferences",
  NEXT_AVAILABLE: "Next available:",
  BOOK_NEXT_AVAILABLE: "Book Next",

  FILTERS: {
    CONSULTATION_TYPE: "Consultation Type",
    DURATION: "Duration",
    DATE_RANGE: "Date Range",
  },

  VIEW_MODES: {
    CALENDAR: "Calendar View",
    LIST: "List View",
  },

  TIME_SLOT: {
    AVAILABLE: "Available",
    BOOKED: "Booked",
    UNAVAILABLE: "Unavailable",
    SELECTED: "Selected",
    RESERVED: "Reserved",
    PRICE_LABEL: "Price:",
    DURATION_LABEL: "Duration:",
    TYPE_LABEL: "Type:",
  },

  CALENDAR_GRID: {
    DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    TIME_SLOTS_AVAILABLE: "slots available",
    NO_SLOTS_TODAY: "No slots available",
    CLICK_TO_VIEW: "Click to view available times",
  },

  TIME_SLOT_LIST: {
    TITLE: "Available Time Slots",
    TODAY: "Today",
    TOMORROW: "Tomorrow",
    THIS_WEEK: "This Week",
    NEXT_WEEK: "Next Week",
    SELECT_SLOT: "Select Time",
    BOOK_NOW: "Book Now",
  },

  BOOKING_MODAL: {
    TITLE: "Confirm Booking",
    CONSULTATION_DETAILS: "Consultation Details",
    ATTORNEY_LABEL: "Attorney:",
    DATE_TIME_LABEL: "Date & Time:",
    DURATION_LABEL: "Duration:",
    TYPE_LABEL: "Type:",
    PRICE_LABEL: "Price:",
    NOTES_LABEL: "Additional Notes (Optional):",
    NOTES_PLACEHOLDER:
      "Please provide any additional information about your legal matter...",
    CONTACT_INFO: "Contact Information",
    NAME_LABEL: "Full Name:",
    EMAIL_LABEL: "Email:",
    PHONE_LABEL: "Phone:",
    CONFIRM_BOOKING: "Confirm Booking",
    CANCEL: "Cancel",
    BOOKING: "Booking...",
    TERMS_TEXT: "By booking this consultation, you agree to our",
    TERMS_LINK: "Terms of Service",
    PRIVACY_LINK: "Privacy Policy",
  },

  CONSULTATION_TYPES: {
    video: {
      label: "Video Call",
      description: "Meet via secure video conference",
      icon: "Video",
    },
    phone: {
      label: "Phone Call",
      description: "Traditional phone consultation",
      icon: "Phone",
    },
    "in-person": {
      label: "In-Person",
      description: "Meet at attorney office",
      icon: "MapPin",
    },
  },

  DURATION_OPTIONS: [
    { value: 15, label: "15 minutes", price_multiplier: 0.25 },
    { value: 30, label: "30 minutes", price_multiplier: 0.5 },
    { value: 60, label: "1 hour", price_multiplier: 1 },
    { value: 90, label: "1.5 hours", price_multiplier: 1.5 },
    { value: 120, label: "2 hours", price_multiplier: 2 },
    { value: 180, label: "3 hours", price_multiplier: 3 },
  ],

  TIME_ZONES: {
    ATTORNEY_TIME: "Attorney Time",
    YOUR_TIME: "Your Time",
    DIFFERENT_TIMEZONE_WARNING: "Note: Times shown in your local timezone",
  },

  NAVIGATION: {
    PREVIOUS_WEEK: "Previous Week",
    NEXT_WEEK: "Next Week",
    TODAY: "Today",
    GO_TO_DATE: "Go to Date",
  },

  STATUS_MESSAGES: {
    BOOKING_SUCCESS: "Consultation booked successfully!",
    BOOKING_FAILED: "Failed to book consultation. Please try again.",
    SLOT_EXPIRED: "This time slot is no longer available.",
    SLOT_RESERVED: "Time slot reserved for 5 minutes",
    RESERVATION_EXPIRED: "Reservation expired. Please select a new time.",
    NETWORK_ERROR: "Network error. Please check your connection.",
  },

  VALIDATION: {
    NAME_REQUIRED: "Full name is required",
    EMAIL_REQUIRED: "Email address is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PHONE_INVALID: "Please enter a valid phone number",
    SLOT_REQUIRED: "Please select a time slot",
    NOTES_TOO_LONG: "Notes cannot exceed 500 characters",
  },

  ACCESSIBILITY: {
    CALENDAR_DESCRIPTION: "Calendar showing available consultation times",
    TIME_SLOT_BUTTON: "Book consultation at",
    PREVIOUS_WEEK_BUTTON: "View previous week availability",
    NEXT_WEEK_BUTTON: "View next week availability",
    FILTER_CONSULTATION_TYPE: "Filter by consultation type",
    FILTER_DURATION: "Filter by consultation duration",
  },

  PRICING: {
    FREE_CONSULTATION: "Free Consultation",
    STARTING_FROM: "Starting from",
    PER_HOUR: "per hour",
    TOTAL: "Total:",
    INCLUDES_TAX: "All prices include applicable taxes",
  },

  EMERGENCY_SLOTS: {
    AVAILABLE: "Emergency appointment available",
    CONTACT_INFO: "For urgent legal matters, call:",
    DISCLAIMER: "Emergency slots are for urgent legal matters only",
  },
} as const;
