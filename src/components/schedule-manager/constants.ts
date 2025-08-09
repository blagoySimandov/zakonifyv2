export const SCHEDULE_CONSTANTS = {
  TITLE: 'Schedule Manager',
  SUBTITLE: 'Configure your working hours and consultation settings',
  LOADING_MESSAGE: 'Loading schedule configuration...',
  UNSAVED_CHANGES: 'You have unsaved changes',

  TABS: {
    SCHEDULE: 'Weekly Schedule',
    BREAKS: 'Breaks & Buffers',
    CONSULTATION_SETTINGS: 'Consultation Settings',
    TEMPLATES: 'Schedule Templates',
  },

  ACTIONS: {
    SAVE_CHANGES: 'Save Changes',
    SAVING: 'Saving...',
    RESET: 'Reset',
    CANCEL: 'Cancel',
    APPLY_TEMPLATE: 'Apply Template',
    COPY_TO_ALL: 'Copy to All Days',
    CLEAR_DAY: 'Clear Day',
  },

  SCHEDULE_EDITOR: {
    TITLE: 'Weekly Working Hours',
    SUBTITLE: 'Set your availability for each day of the week',
    WORKING_TOGGLE: 'Working',
    START_TIME_LABEL: 'Start Time',
    END_TIME_LABEL: 'End Time',
    COPY_TO_ALL_TOOLTIP: 'Copy this day\'s schedule to all other days',
    CLEAR_DAY_TOOLTIP: 'Clear this day\'s schedule',
    TIME_VALIDATION_ERROR: 'End time must be after start time',
    OVERLAP_ERROR: 'Schedule overlaps with break times',
  },

  BREAK_MANAGER: {
    TITLE: 'Breaks & Buffer Times',
    SUBTITLE: 'Configure lunch breaks and time between consultations',
    ADD_BREAK: 'Add Break',
    REMOVE_BREAK: 'Remove Break',
    BREAK_NAME_PLACEHOLDER: 'e.g., Lunch Break',
    BUFFER_TIME_LABEL: 'Buffer Time Between Consultations',
    BUFFER_TIME_HELP: 'Time added between each consultation for preparation',
    ALLOW_BACK_TO_BACK: 'Allow back-to-back consultations',
    BREAK_VALIDATION_ERROR: 'Break times must be within working hours',
  },

  CONSULTATION_SETTINGS: {
    TITLE: 'Consultation Settings',
    SUBTITLE: 'Configure consultation types, durations, and pricing',
    DEFAULT_DURATION_LABEL: 'Default Consultation Duration',
    MIN_ADVANCE_BOOKING_LABEL: 'Minimum Advance Booking',
    MAX_ADVANCE_BOOKING_LABEL: 'Maximum Advance Booking',
    MAX_CONSULTATIONS_PER_DAY_LABEL: 'Maximum Consultations per Day',
    CONSULTATION_TYPES_TITLE: 'Consultation Types',
    ADD_CONSULTATION_TYPE: 'Add Consultation Type',
    ENABLE_TYPE: 'Enable',
    TYPE_LABEL: 'Type',
    DURATION_LABEL: 'Duration (minutes)',
    PRICE_LABEL: 'Price ($)',
    VALIDATION: {
      DURATION_REQUIRED: 'Duration is required',
      PRICE_REQUIRED: 'Price is required',
      MIN_DURATION: 'Minimum duration is 15 minutes',
      MAX_DURATION: 'Maximum duration is 4 hours',
    },
  },

  TEMPLATES: {
    TITLE: 'Schedule Templates',
    SUBTITLE: 'Quick start with predefined schedules',
    APPLY_TEMPLATE_CONFIRM: 'This will replace your current schedule. Continue?',
    CUSTOM_TEMPLATE: 'Save as Custom Template',
    TEMPLATE_NAMES: {
      STANDARD_BUSINESS: 'Standard Business Hours',
      EXTENDED_HOURS: 'Extended Hours',
      FLEXIBLE_HOURS: 'Flexible Hours',
      WEEKEND_INCLUDED: 'Weekend Included',
      PART_TIME: 'Part-time Schedule',
    },
    TEMPLATE_DESCRIPTIONS: {
      STANDARD_BUSINESS: '9 AM - 5 PM, Monday to Friday with 1-hour lunch break',
      EXTENDED_HOURS: '8 AM - 8 PM, Monday to Friday with extended availability',
      FLEXIBLE_HOURS: '10 AM - 6 PM, Monday to Friday for flexible working',
      WEEKEND_INCLUDED: 'Standard weekdays plus Saturday morning availability',
      PART_TIME: 'Reduced hours for part-time practice',
    },
  },

  TIME_ZONE: {
    LABEL: 'Time Zone',
    SEARCH_PLACEHOLDER: 'Search time zones...',
    CURRENT_LABEL: 'Current:',
    CHANGE_WARNING: 'Changing time zone will affect all your scheduled appointments',
  },

  DAYS: {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday', 
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
  },

  DAY_ABBREVIATIONS: {
    MONDAY: 'Mon',
    TUESDAY: 'Tue',
    WEDNESDAY: 'Wed', 
    THURSDAY: 'Thu',
    FRIDAY: 'Fri',
    SATURDAY: 'Sat',
    SUNDAY: 'Sun',
  },

  CONSULTATION_TYPE_OPTIONS: [
    { value: 'video', label: 'Video Call' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'in-person', label: 'In-Person Meeting' },
  ],

  TIME_OPTIONS: {
    STEP: 15, // 15-minute intervals
    START_HOUR: 6, // 6 AM
    END_HOUR: 22, // 10 PM
  },

  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_TIME_RANGE: 'End time must be after start time',
    MINIMUM_DURATION: 'Minimum consultation duration is 15 minutes',
    MAXIMUM_DURATION: 'Maximum consultation duration is 4 hours',
    MINIMUM_ADVANCE: 'Minimum advance booking must be at least 1 hour',
    MAXIMUM_ADVANCE: 'Maximum advance booking cannot exceed 1 year',
    INVALID_BUFFER_TIME: 'Buffer time must be between 0 and 60 minutes',
    MAX_CONSULTATIONS_RANGE: 'Maximum consultations per day must be between 1 and 20',
  },

  SUCCESS_MESSAGES: {
    SCHEDULE_SAVED: 'Schedule saved successfully!',
    TEMPLATE_APPLIED: 'Template applied successfully!',
    SETTINGS_UPDATED: 'Consultation settings updated!',
  },

  ERROR_MESSAGES: {
    SAVE_FAILED: 'Failed to save schedule. Please try again.',
    LOAD_FAILED: 'Failed to load schedule configuration.',
    TEMPLATE_APPLY_FAILED: 'Failed to apply template.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },

  TOOLTIPS: {
    BUFFER_TIME: 'Time automatically added between consultations for preparation and transition',
    MIN_ADVANCE_BOOKING: 'How far in advance clients must book (in hours)',
    MAX_ADVANCE_BOOKING: 'How far in advance clients can book (in days)',
    MAX_CONSULTATIONS: 'Maximum number of consultations you want to handle per day',
    BACK_TO_BACK: 'Allow consultations with no buffer time between them',
    TIME_ZONE: 'Your local time zone - affects how clients see your availability',
  },

  PLACEHOLDERS: {
    BREAK_NAME: 'Break name (e.g., Lunch)',
    CONSULTATION_TYPE: 'Select consultation type',
    DURATION: '60',
    PRICE: '200',
    BUFFER_MINUTES: '15',
    MIN_ADVANCE_HOURS: '24',
    MAX_ADVANCE_DAYS: '90',
    MAX_CONSULTATIONS: '8',
  },
} as const;