export const REGISTRATION_MESSAGES = {
  SUCCESS: {
    SUBMITTED: 'Registration submitted successfully!',
    STEP_COMPLETED: 'Step completed successfully',
    PACKAGE_ADDED: 'Package added successfully',
  },
  
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    VALIDATION: 'Please fix the errors below and try again.',
    SUBMISSION: 'Failed to submit registration. Please try again.',
    EMAIL_EXISTS: 'An account with this email already exists.',
    BAR_ID_EXISTS: 'This bar association ID is already registered.',
  },
  
  INFO: {
    VERIFICATION_PENDING: 'Your registration will be reviewed and verified within 24-48 hours.',
    REQUIRED_FIELDS: '* indicates required fields',
    STEP_PROGRESS: 'Step {current} of {total}',
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  },
  
  HELP: {
    BAR_ID: 'Enter your state bar association membership number',
    BIO_TIPS: 'Include your specializations, approach to legal practice, and what makes you unique',
    PRACTICE_AREAS: 'Select up to 5 areas where you have expertise',
    HOURLY_RATE: 'Set a competitive rate based on your experience and market',
    PACKAGES: 'Offer fixed-price services to attract more clients',
  },
} as const