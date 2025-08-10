export const REVIEW_FORM_MESSAGES = {
  SUCCESS: {
    SUBMITTED: "Review Submitted Successfully!",
    THANK_YOU: "Thank you for taking the time to share your experience.",
  },

  ERROR: {
    SUBMIT_FAILED: "Failed to submit review. Please try again.",
    VALIDATION_FAILED: "Please fix the errors below and try again.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
  },

  INFO: {
    REVIEWING_FOR: "You are writing a review for:",
    REQUIRED_FIELDS: "Fields marked with * are required.",
    EMAIL_PRIVACY: "Your email will not be displayed publicly.",
    REVIEW_GUIDELINES: "Please keep your review professional and constructive.",
  },

  VALIDATION: {
    NAME_REQUIRED: "Your name is required",
    NAME_TOO_SHORT: "Name must be at least 2 characters",
    NAME_TOO_LONG: "Name must be less than 100 characters",
    EMAIL_REQUIRED: "Email address is required",
    EMAIL_INVALID: "Please enter a valid email address",
    RATING_REQUIRED: "Please select a rating",
    RATING_INVALID: "Rating must be between 1 and 5 stars",
    COMMENT_REQUIRED: "Review comment is required",
    COMMENT_TOO_SHORT: "Comment must be at least 10 characters",
    COMMENT_TOO_LONG: "Comment must be less than 1000 characters",
  },
} as const;
