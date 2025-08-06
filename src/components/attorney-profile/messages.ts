export const PROFILE_MESSAGES = {
  LOADING: {
    PROFILE: 'Loading attorney profile...',
    REVIEWS: 'Loading reviews...',
  },

  ERROR: {
    NOT_FOUND: 'Attorney not found',
    LOAD_FAILED: 'Failed to load attorney profile',
    INVALID_ID: 'Invalid attorney ID provided',
    NETWORK_ERROR: 'Network error. Please try again.',
  },

  SUCCESS: {
    PROFILE_LOADED: 'Attorney profile loaded successfully',
    MESSAGE_SENT: 'Message sent successfully',
    CONSULTATION_BOOKED: 'Consultation booked successfully',
  },

  INFO: {
    NO_BIOGRAPHY: 'No biography provided.',
    NO_EDUCATION: 'Education information not available.',
    NO_REVIEWS: 'No reviews yet.',
    CONTACT_FOR_PRICING: 'Contact for pricing information.',
    CONSULTATION_DISCLAIMER: 'Initial consultation does not constitute legal advice.',
  },

  ACTIONS: {
    BOOK_NOW: 'Book Now',
    SEND_MESSAGE: 'Send Message', 
    VIEW_REVIEWS: 'View All Reviews',
    CONTACT_ATTORNEY: 'Contact Attorney',
    GET_QUOTE: 'Get Quote',
  },

  PLACEHOLDER: {
    NO_DESCRIPTION: 'No description available',
    CONTACT_FOR_INFO: 'Contact attorney for more information',
  },

  CONFIRMATION: {
    BOOK_CONSULTATION: 'Are you sure you want to book a consultation?',
    SEND_MESSAGE: 'Your message will be sent to the attorney.',
  },
} as const