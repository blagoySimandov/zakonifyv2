export const BOOKING_CONSTANTS = {
  TITLE: "Book Consultation",
  SUBTITLE: "Schedule your legal consultation in a few simple steps",

  STEPS: {
    CONSULTATION_TYPE: "Type & Duration",
    AVAILABILITY: "Select Time",
    CLIENT_INFO: "Your Information",
    PAYMENT: "Payment",
    CONFIRMATION: "Confirm Booking",
  },

  ACTIONS: {
    BACK: "Back",
    CONTINUE: "Continue",
    PROCEED_TO_CONFIRMATION: "Proceed to Confirmation",
    CONFIRM_BOOKING: "Confirm Booking",
    PROCESSING: "Processing...",
    CANCEL: "Cancel",
    EDIT: "Edit",
  },

  CONSULTATION_TYPE_STEP: {
    TITLE: "Choose Consultation Type",
    SUBTITLE: "Select how you'd like to meet and for how long",
    TYPE_LABEL: "Consultation Type",
    DURATION_LABEL: "Duration",
    PRICING_NOTE: "Pricing may vary based on consultation type and duration",
    TYPES: {
      video: {
        title: "Video Call",
        description: "Meet via secure video conference from anywhere",
        features: [
          "Screen sharing",
          "Recording available",
          "Secure & encrypted",
        ],
      },
      phone: {
        title: "Phone Call",
        description: "Traditional phone consultation",
        features: [
          "No video required",
          "Works with any phone",
          "High quality audio",
        ],
      },
      "in-person": {
        title: "In-Person Meeting",
        description: "Meet at the attorney's office",
        features: [
          "Face-to-face discussion",
          "Document review",
          "Personal attention",
        ],
      },
    },
  },

  AVAILABILITY_STEP: {
    TITLE: "Select Available Time",
    SUBTITLE: "Choose a time that works best for your schedule",
    NO_AVAILABILITY: "No availability found",
    LOADING_AVAILABILITY: "Loading available times...",
    TIME_ZONE_NOTE: "All times shown in your local timezone",
    SELECTED_SLOT: "Selected Time Slot",
    CHANGE_SELECTION: "Change Selection",
  },

  CLIENT_INFO_STEP: {
    TITLE: "Your Information",
    SUBTITLE: "Provide your contact details for the consultation",
    PERSONAL_INFO: "Personal Information",
    CONTACT_INFO: "Contact Information",
    CONSULTATION_DETAILS: "Consultation Details",

    FIELDS: {
      FULL_NAME: "Full Name",
      EMAIL: "Email Address",
      PHONE: "Phone Number",
      COMPANY: "Company (Optional)",
      CONSULTATION_TOPIC: "What would you like to discuss?",
      CONSULTATION_TOPIC_PLACEHOLDER:
        "Brief description of your legal matter...",
      ADDITIONAL_NOTES: "Additional Notes (Optional)",
      ADDITIONAL_NOTES_PLACEHOLDER:
        "Any additional information that might be helpful...",
      PRIVACY_CONSENT:
        "I consent to the collection and use of my personal information",
      MARKETING_CONSENT: "I would like to receive updates about legal services",
    },

    VALIDATION: {
      FULL_NAME_REQUIRED: "Full name is required",
      EMAIL_REQUIRED: "Email address is required",
      EMAIL_INVALID: "Please enter a valid email address",
      PHONE_INVALID: "Please enter a valid phone number",
      CONSULTATION_TOPIC_REQUIRED: "Please describe what you'd like to discuss",
      PRIVACY_CONSENT_REQUIRED: "Privacy consent is required to proceed",
    },
  },

  PAYMENT_STEP: {
    TITLE: "Payment Information",
    SUBTITLE: "Secure payment to confirm your consultation",
    CONSULTATION_SUMMARY: "Consultation Summary",
    PAYMENT_METHOD: "Payment Method",
    BILLING_ADDRESS: "Billing Address",
    PAYMENT_SECURITY: "Your payment information is secure and encrypted",

    PRICING: {
      CONSULTATION_FEE: "Consultation Fee",
      PROCESSING_FEE: "Processing Fee",
      TAX: "Tax",
      TOTAL: "Total Amount",
    },

    PAYMENT_METHODS: {
      CREDIT_CARD: "Credit/Debit Card",
      PAYPAL: "PayPal",
      BANK_TRANSFER: "Bank Transfer",
    },

    FIELDS: {
      CARD_NUMBER: "Card Number",
      EXPIRY_DATE: "MM/YY",
      CVC: "CVC",
      CARDHOLDER_NAME: "Cardholder Name",
      BILLING_ADDRESS: "Billing Address",
      CITY: "City",
      STATE: "State",
      ZIP_CODE: "ZIP Code",
      COUNTRY: "Country",
    },

    VALIDATION: {
      CARD_NUMBER_REQUIRED: "Card number is required",
      CARD_NUMBER_INVALID: "Please enter a valid card number",
      EXPIRY_REQUIRED: "Expiry date is required",
      EXPIRY_INVALID: "Please enter a valid expiry date",
      CVC_REQUIRED: "CVC is required",
      CVC_INVALID: "Please enter a valid CVC",
      CARDHOLDER_NAME_REQUIRED: "Cardholder name is required",
      BILLING_ADDRESS_REQUIRED: "Billing address is required",
    },
  },

  CONFIRMATION_STEP: {
    TITLE: "Confirm Your Booking",
    SUBTITLE: "Please review your consultation details before confirming",
    CONSULTATION_DETAILS: "Consultation Details",
    CLIENT_INFORMATION: "Your Information",
    PAYMENT_INFORMATION: "Payment Summary",
    TERMS_AND_CONDITIONS: "Terms & Conditions",
    TERMS_TEXT: "By confirming this booking, you agree to our",
    TERMS_LINK: "Terms of Service",
    PRIVACY_LINK: "Privacy Policy",
    REFUND_POLICY: "Refund Policy",
    CANCELLATION_POLICY:
      "You can cancel or reschedule up to 24 hours before your consultation",
  },

  SUCCESS_MODAL: {
    TITLE: "Booking Confirmed!",
    SUBTITLE: "Your consultation has been successfully booked",
    CONFIRMATION_NUMBER: "Confirmation Number",
    NEXT_STEPS: "What happens next?",
    STEPS_LIST: [
      "You will receive a confirmation email with consultation details",
      "The attorney will contact you if any additional information is needed",
      "Join your consultation at the scheduled time using the provided link",
      "Prepare any relevant documents or questions for your consultation",
    ],
    CALENDAR_REMINDER: "Add to Calendar",
    CLOSE: "Close",
    VIEW_CONSULTATION: "View Consultation Details",
  },

  ERROR_MESSAGES: {
    GENERIC_ERROR: "An error occurred. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection.",
    VALIDATION_ERROR: "Please correct the highlighted fields.",
    PAYMENT_FAILED: "Payment failed. Please check your payment information.",
    BOOKING_FAILED: "Failed to create booking. Please try again.",
    SLOT_UNAVAILABLE: "The selected time slot is no longer available.",
    ATTORNEY_UNAVAILABLE: "Attorney is not available for booking.",
  },

  STATUS: {
    LOADING: "Loading...",
    PROCESSING: "Processing...",
    SUCCESS: "Success",
    ERROR: "Error",
  },

  DURATION_OPTIONS: [
    { value: 30, label: "30 minutes", description: "Quick consultation" },
    { value: 60, label: "1 hour", description: "Standard consultation" },
    { value: 90, label: "1.5 hours", description: "Extended consultation" },
    { value: 120, label: "2 hours", description: "Comprehensive consultation" },
  ],

  CONSULTATION_TOPICS: [
    "Contract Review",
    "Business Formation",
    "Employment Law",
    "Real Estate",
    "Family Law",
    "Criminal Defense",
    "Immigration",
    "Personal Injury",
    "Intellectual Property",
    "Other",
  ],

  ACCESSIBILITY: {
    STEP_COMPLETED: "Step completed",
    STEP_CURRENT: "Current step",
    STEP_UPCOMING: "Upcoming step",
    BACK_BUTTON: "Go back to previous step",
    CONTINUE_BUTTON: "Continue to next step",
    FORM_ERROR: "Form contains errors",
    REQUIRED_FIELD: "Required field",
  },
} as const;
