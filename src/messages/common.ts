export const MESSAGES = {
  LOADING: 'Loading...',
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
  },
  SUCCESS: {
    SAVED: 'Successfully saved!',
    DELETED: 'Successfully deleted!',
    UPDATED: 'Successfully updated!',
    CREATED: 'Successfully created!',
  },
} as const