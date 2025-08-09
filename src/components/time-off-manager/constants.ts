export const TIME_OFF_CONSTANTS = {
  TITLE: 'Time Off Manager',
  SUBTITLE: 'Schedule vacation, holidays, and other unavailable periods',
  LOADING_MESSAGE: 'Loading time off schedule...',

  ACTIONS: {
    ADD_TIME_OFF: 'Add Time Off',
    EDIT_TIME_OFF: 'Edit Time Off',
    DELETE_TIME_OFF: 'Delete',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    SAVING: 'Saving...',
  },

  FORM: {
    TITLE_ADD: 'Schedule Time Off',
    TITLE_EDIT: 'Edit Time Off',
    TYPE_LABEL: 'Type',
    TITLE_LABEL: 'Title',
    TITLE_PLACEHOLDER: 'e.g., Summer Vacation, Court Appearance',
    START_DATE_LABEL: 'Start Date',
    END_DATE_LABEL: 'End Date',
    START_TIME_LABEL: 'Start Time',
    END_TIME_LABEL: 'End Time',
    ALL_DAY_LABEL: 'All Day',
    RECURRING_LABEL: 'Recurring',
    REASON_LABEL: 'Reason (Optional)',
    REASON_PLACEHOLDER: 'Additional notes or reason for time off...',
    
    RECURRING_OPTIONS: {
      FREQUENCY_LABEL: 'Repeat',
      INTERVAL_LABEL: 'Every',
      END_DATE_LABEL: 'Until',
      NEVER_ENDS: 'Never ends',
    },
  },

  TYPE_OPTIONS: [
    { value: 'vacation', label: 'Vacation', color: 'bg-blue-100 text-blue-800' },
    { value: 'holiday', label: 'Holiday', color: 'bg-green-100 text-green-800' },
    { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
    { value: 'court', label: 'Court Appearance', color: 'bg-purple-100 text-purple-800' },
    { value: 'continuing-education', label: 'Continuing Education', color: 'bg-orange-100 text-orange-800' },
    { value: 'unavailable', label: 'Unavailable', color: 'bg-gray-100 text-gray-800' },
  ],

  RECURRING_FREQUENCIES: [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ],

  CALENDAR: {
    PREVIOUS_MONTH: 'Previous Month',
    NEXT_MONTH: 'Next Month',
    TODAY: 'Today',
    NO_TIME_OFF: 'No time off scheduled',
    CLICK_DATE_TO_ADD: 'Click on a date to add time off',
  },

  LIST: {
    TITLE: 'Scheduled Time Off',
    NO_PERIODS: 'No time off scheduled',
    UPCOMING: 'Upcoming',
    PAST: 'Past',
    ACTIVE: 'Active Now',
    DURATION: 'Duration',
    STATUS: 'Status',
  },

  CONFIRMATIONS: {
    DELETE: 'Are you sure you want to delete this time off period? This action cannot be undone.',
    DELETE_RECURRING: 'This is a recurring time off. Do you want to delete all future occurrences?',
  },

  VALIDATION: {
    TITLE_REQUIRED: 'Title is required',
    TYPE_REQUIRED: 'Type is required',
    START_DATE_REQUIRED: 'Start date is required',
    END_DATE_REQUIRED: 'End date is required',
    END_BEFORE_START: 'End date must be after start date',
    INVALID_TIME_RANGE: 'End time must be after start time',
    PAST_DATE: 'Cannot schedule time off in the past',
    MAX_DURATION: 'Time off period cannot exceed 1 year',
  },

  SUCCESS_MESSAGES: {
    ADDED: 'Time off scheduled successfully!',
    UPDATED: 'Time off updated successfully!',
    DELETED: 'Time off deleted successfully!',
  },

  ERROR_MESSAGES: {
    SAVE_FAILED: 'Failed to save time off. Please try again.',
    DELETE_FAILED: 'Failed to delete time off. Please try again.',
    LOAD_FAILED: 'Failed to load time off schedule.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },

  STATUS: {
    UPCOMING: 'Upcoming',
    ACTIVE: 'Active',
    PAST: 'Past',
    CANCELLED: 'Cancelled',
  },

  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
    INPUT: 'YYYY-MM-DD',
    TIME_INPUT: 'HH:mm',
  },

  TOOLTIPS: {
    ALL_DAY: 'Block the entire day(s)',
    RECURRING: 'Repeat this time off period',
    DELETE: 'Delete this time off period',
    EDIT: 'Edit this time off period',
    PAST_PERIOD: 'This time off period has passed',
    ACTIVE_PERIOD: 'You are currently on time off',
  },
} as const;