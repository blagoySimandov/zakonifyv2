export const REGISTRATION_CONSTANTS = {
  STEPS: {
    PERSONAL: 'personal',
    PROFESSIONAL: 'professional', 
    PRACTICE_AND_LOCATION: 'practiceAndLocation',
    PRICING: 'pricing',
  },
  
  STEP_TITLES: {
    personal: 'Personal Information',
    professional: 'Professional Background',
    practiceAndLocation: 'Practice Areas & Location',
    pricing: 'Pricing & Packages',
  },
  
  STEP_DESCRIPTIONS: {
    personal: 'Let us know who you are',
    professional: 'Tell us about your legal background',
    practiceAndLocation: 'What areas do you practice and where?',
    pricing: 'Set your consultation rates',
  },
  
  BUTTONS: {
    NEXT: 'Next Step',
    PREVIOUS: 'Previous Step',
    SUBMIT: 'Complete Registration',
    ADD_PACKAGE: 'Add Package',
    REMOVE_PACKAGE: 'Remove',
  },
  
  PLACEHOLDERS: {
    FULL_NAME: 'Enter your full legal name',
    EMAIL: 'Enter your email address',
    BAR_ID: 'Enter your bar association ID',
    YEARS_EXPERIENCE: 'Years of experience',
    EDUCATION: 'e.g., Harvard Law School, J.D. 2015',
    BIO: 'Tell potential clients about your experience, specializations, and approach to legal practice...',
    CITY: 'City',
    STATE: 'State/Province',
    COUNTRY: 'Country',
    HOURLY_RATE: 'Enter hourly rate in USD',
    PACKAGE_NAME: 'e.g., Contract Review',
    PACKAGE_DESCRIPTION: 'Describe what this package includes...',
    PACKAGE_PRICE: 'Package price in USD',
  },
  
  LABELS: {
    FULL_NAME: 'Full Legal Name',
    EMAIL: 'Email Address',
    BAR_ID: 'Bar Association ID',
    YEARS_EXPERIENCE: 'Years of Experience',
    EDUCATION: 'Education Background',
    BIO: 'Professional Bio',
    PRACTICE_AREAS: 'Practice Areas',
    LOCATION: 'Location',
    LANGUAGES: 'Languages Spoken',
    HOURLY_RATE: 'Hourly Rate ($)',
    FIXED_PACKAGES: 'Fixed-Fee Packages (Optional)',
  },
  
  COMMON_LANGUAGES: [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Mandarin',
    'Cantonese',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian',
    'Hindi',
    'Dutch',
    'Swedish',
  ],
} as const

export type RegistrationStep = keyof typeof REGISTRATION_CONSTANTS.STEP_TITLES