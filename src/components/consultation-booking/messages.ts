export const BOOKING_MESSAGES = {
  SUCCESS: {
    BOOKED: "Consultation Booked Successfully!",
    CONFIRMATION:
      "The attorney will confirm your appointment and send you further details.",
    EMAIL_SENT: "A confirmation email has been sent to your email address.",
  },

  ERROR: {
    BOOKING_FAILED: "Failed to book consultation. Please try again.",
    SLOT_UNAVAILABLE:
      "This time slot is no longer available. Please select another time.",
    VALIDATION_FAILED: "Please fix the errors below and try again.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    PAST_DATE: "Cannot book consultation in the past.",
  },

  INFO: {
    BOOKING_FOR: "You are booking a consultation with:",
    REQUIRED_FIELDS: "Fields marked with * are required.",
    EMAIL_PRIVACY: "Your email will be used for booking confirmation only.",
    CONSULTATION_DISCLAIMER:
      "This booking is subject to attorney availability and confirmation.",
    BUSINESS_HOURS: "Consultations are available Monday-Friday, 9 AM - 5 PM.",
    CANCELLATION_POLICY:
      "Cancellations must be made at least 24 hours in advance.",
  },

  VALIDATION: {
    NAME_REQUIRED: "Full name is required",
    NAME_TOO_SHORT: "Name must be at least 2 characters",
    NAME_TOO_LONG: "Name must be less than 100 characters",
    EMAIL_REQUIRED: "Email address is required",
    EMAIL_INVALID: "Please enter a valid email address",
    DATE_REQUIRED: "Please select a date",
    TIME_REQUIRED: "Please select a time slot",
    DURATION_REQUIRED: "Please select consultation duration",
    DURATION_TOO_SHORT: "Duration must be at least 30 minutes",
    DURATION_TOO_LONG: "Duration cannot exceed 8 hours",
    PACKAGE_REQUIRED: "Please select a package",
    NOTES_TOO_LONG: "Notes must be less than 500 characters",
  },

  LOADING: {
    SLOTS: "Loading available time slots...",
    BOOKING: "Processing your booking...",
    PACKAGES: "Loading packages...",
  },

  EMPTY_STATES: {
    NO_SLOTS:
      "No available time slots for this date. Please select another date.",
    NO_PACKAGES: "No fixed fee packages available.",
  },
} as const;
