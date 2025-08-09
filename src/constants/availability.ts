import { WeeklySchedule, ConsultationSettings, AvailabilityDefaults, DayOfWeek, ConsultationType, TimeOffType } from '@/types/availability'

// Default working hours (9 AM - 5 PM weekdays)
export const DEFAULT_WORKING_HOURS: WeeklySchedule = {
  monday: {
    start: '09:00',
    end: '17:00',
    breaks: [
      { start: '12:00', end: '13:00', title: 'Lunch Break' }
    ]
  },
  tuesday: {
    start: '09:00',
    end: '17:00',
    breaks: [
      { start: '12:00', end: '13:00', title: 'Lunch Break' }
    ]
  },
  wednesday: {
    start: '09:00',
    end: '17:00',
    breaks: [
      { start: '12:00', end: '13:00', title: 'Lunch Break' }
    ]
  },
  thursday: {
    start: '09:00',
    end: '17:00',
    breaks: [
      { start: '12:00', end: '13:00', title: 'Lunch Break' }
    ]
  },
  friday: {
    start: '09:00',
    end: '17:00',
    breaks: [
      { start: '12:00', end: '13:00', title: 'Lunch Break' }
    ]
  }
  // Saturday and Sunday are undefined (not working)
}

// Default consultation settings
export const DEFAULT_CONSULTATION_SETTINGS: ConsultationSettings = {
  defaultDuration: 60, // 1 hour
  bufferTime: 15, // 15 minutes between consultations
  maxConsultationsPerDay: 8,
  allowBackToBack: false,
  minAdvanceBooking: 24, // 24 hours minimum
  maxAdvanceBooking: 90, // 90 days maximum
  consultationTypes: [
    {
      type: 'video',
      duration: 60,
      price: 200,
      isEnabled: true
    },
    {
      type: 'phone',
      duration: 30,
      price: 150,
      isEnabled: true
    },
    {
      type: 'in-person',
      duration: 90,
      price: 300,
      isEnabled: false // Disabled by default
    }
  ]
}

// Default availability profile
export const DEFAULT_AVAILABILITY: AvailabilityDefaults = {
  timeZone: 'America/New_York',
  workingHours: DEFAULT_WORKING_HOURS,
  consultationSettings: DEFAULT_CONSULTATION_SETTINGS
}

// Days of the week mapping
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

export const DAY_NAMES: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

export const DAY_SHORT_NAMES: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
}

// Consultation types
export const CONSULTATION_TYPES: Record<ConsultationType, string> = {
  video: 'Video Call',
  phone: 'Phone Call',
  'in-person': 'In-Person Meeting'
}

// Time off types
export const TIME_OFF_TYPES: Record<TimeOffType, { label: string; color: string }> = {
  vacation: {
    label: 'Vacation',
    color: 'blue'
  },
  holiday: {
    label: 'Holiday',
    color: 'green'
  },
  sick: {
    label: 'Sick Leave',
    color: 'red'
  },
  unavailable: {
    label: 'Unavailable',
    color: 'gray'
  },
  court: {
    label: 'Court Appearance',
    color: 'purple'
  },
  'continuing-education': {
    label: 'Continuing Education',
    color: 'orange'
  }
}

// Common US time zones
export const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
]

// Reservation expiration time (5 minutes)
export const SLOT_RESERVATION_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Availability cache duration (1 hour)
export const AVAILABILITY_CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Maximum days to calculate availability in advance
export const MAX_AVAILABILITY_DAYS = 90

// Minimum consultation duration in minutes
export const MIN_CONSULTATION_DURATION = 15

// Maximum consultation duration in minutes
export const MAX_CONSULTATION_DURATION = 240 // 4 hours

// Common consultation durations
export const COMMON_DURATIONS = [15, 30, 45, 60, 90, 120, 180] // in minutes

// Business rules constants
export const BUSINESS_RULES = {
  MIN_BUFFER_TIME: 5, // minimum 5 minutes between consultations
  MAX_BUFFER_TIME: 60, // maximum 1 hour between consultations
  MIN_ADVANCE_BOOKING: 1, // minimum 1 hour advance booking
  MAX_ADVANCE_BOOKING: 365, // maximum 1 year advance booking
  MAX_CONSULTATIONS_PER_DAY: 20,
  MAX_WORKING_HOURS_PER_DAY: 16 // 16 hours maximum per day
}

// Time formatting
export const TIME_FORMAT = 'HH:mm'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'

// Error messages
export const AVAILABILITY_ERRORS = {
  INVALID_TIME_RANGE: 'Invalid time range specified',
  ATTORNEY_NOT_FOUND: 'Attorney availability profile not found',
  CONFLICTING_CONSULTATION: 'Time slot conflicts with existing consultation',
  OUTSIDE_WORKING_HOURS: 'Time slot is outside attorney working hours',
  INSUFFICIENT_BUFFER_TIME: 'Not enough buffer time between consultations',
  SLOT_NOT_AVAILABLE: 'Selected time slot is no longer available',
  RESERVATION_EXPIRED: 'Slot reservation has expired',
  INVALID_CONSULTATION_TYPE: 'Invalid consultation type specified',
  MAXIMUM_ADVANCE_BOOKING_EXCEEDED: 'Booking too far in advance',
  MINIMUM_ADVANCE_BOOKING_NOT_MET: 'Booking requires more advance notice'
}

// UI Constants
export const CALENDAR_CONSTANTS = {
  WEEK_STARTS_ON: 1, // Monday = 1, Sunday = 0
  HOURS_TO_SHOW_START: 7, // Start showing calendar at 7 AM
  HOURS_TO_SHOW_END: 19, // End showing calendar at 7 PM
  SLOT_HEIGHT: 60, // Height in pixels for each hour slot
  MIN_SLOT_DURATION: 15 // Minimum slot duration for display
}

// Working hours templates
export const WORKING_HOURS_TEMPLATES = {
  'Standard Business': DEFAULT_WORKING_HOURS,
  'Extended Hours': {
    monday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
    tuesday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
    wednesday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
    thursday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
    friday: { start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] }
  },
  'Flexible Hours': {
    monday: { start: '10:00', end: '18:00' },
    tuesday: { start: '10:00', end: '18:00' },
    wednesday: { start: '10:00', end: '18:00' },
    thursday: { start: '10:00', end: '18:00' },
    friday: { start: '10:00', end: '16:00' }
  },
  'Weekend Included': {
    ...DEFAULT_WORKING_HOURS,
    saturday: { start: '10:00', end: '14:00' }
  }
}

export const AVAILABILITY_UI_CONSTANTS = {
  NEXT_AVAILABLE_LABEL: 'Next available:',
  NO_AVAILABILITY_MESSAGE: 'No availability in the selected time range',
  LOADING_MESSAGE: 'Loading availability...',
  ERROR_MESSAGE: 'Error loading availability',
  SELECT_TIME_SLOT: 'Select a time slot',
  BOOK_CONSULTATION: 'Book Consultation',
  SLOT_DURATION_LABEL: 'Duration:',
  CONSULTATION_TYPE_LABEL: 'Type:',
  PRICE_LABEL: 'Price:',
  ATTORNEY_TIMEZONE_LABEL: 'Attorney timezone:',
  YOUR_TIMEZONE_LABEL: 'Your timezone:'
}