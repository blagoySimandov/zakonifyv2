export const PROFILE_CONSTANTS = {
  BUTTONS: {
    BOOK_CONSULTATION: "Book Consultation",
    SEND_MESSAGE: "Send Message",
    VIEW_ALL_REVIEWS: "View All Reviews",
    CONTACT_ATTORNEY: "Contact Attorney",
  },

  SECTIONS: {
    ABOUT: "About",
    PRACTICE_AREAS: "Practice Areas",
    PRICING: "Pricing",
    CONTACT: "Contact Information",
    REVIEWS: "Reviews & Ratings",
    EDUCATION: "Education",
    EXPERIENCE: "Experience",
  },

  PRICING_TYPES: {
    HOURLY: "Hourly Consultation",
    FIXED_FEE: "Fixed Fee Packages",
  },

  CONTACT_LABELS: {
    EMAIL: "Email",
    LOCATION: "Location",
    AVAILABILITY: "Availability",
    PHONE: "Phone",
  },

  AVAILABILITY_STATUS: {
    AVAILABLE: "Available for consultations",
    BUSY: "Currently busy",
    UNAVAILABLE: "Currently unavailable",
  },

  VERIFICATION_STATUS: {
    VERIFIED: "Verified Attorney",
    PENDING: "Verification Pending",
    UNVERIFIED: "Not Verified",
  },

  RATING_BREAKDOWN: {
    EXCELLENT: "5 stars",
    GOOD: "4 stars",
    AVERAGE: "3 stars",
    POOR: "2 stars",
    TERRIBLE: "1 star",
  },
} as const;
