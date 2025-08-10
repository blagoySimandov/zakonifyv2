export const REVIEW_FORM_CONSTANTS = {
  TITLE: "Write a Review",

  LABELS: {
    CLIENT_NAME: "Your Name",
    CLIENT_EMAIL: "Email Address",
    RATING: "Overall Rating",
    COMMENT: "Your Review",
  },

  PLACEHOLDERS: {
    CLIENT_NAME: "Enter your full name",
    CLIENT_EMAIL: "Enter your email address",
    COMMENT: "Share your experience working with this attorney...",
  },

  BUTTONS: {
    SUBMIT: "Submit Review",
    SUBMITTING: "Submitting...",
    CANCEL: "Cancel",
    CLOSE: "Close",
  },

  RATING_LABELS: {
    0: "No rating selected",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  },

  LIMITS: {
    CLIENT_NAME_MIN: 2,
    CLIENT_NAME_MAX: 100,
    COMMENT_MIN: 10,
    COMMENT_MAX: 1000,
  },
} as const;
