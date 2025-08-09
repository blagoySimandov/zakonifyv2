export type { ApiResponse, PaginationParams, PaginatedResponse } from './common'
export type { 
  Attorney, 
  AttorneyId, 
  AttorneyLocation, 
  FixedFeePackage, 
  AttorneySearchFilters, 
  AttorneyCreateData 
} from './attorney'
export type { 
  Client, 
  ClientId, 
  ClientCreateData 
} from './client'
export type { 
  Consultation, 
  ConsultationId, 
  ConsultationStatus, 
  ConsultationCreateData 
} from './consultation'
export type { 
  Review, 
  ReviewCreateData, 
  AttorneyReviewStats 
} from './review'
export type {
  AttorneyAvailability,
  AttorneyTimeOff,
  AvailabilitySlots,
  SlotReservation,
  AttorneyAvailabilityId,
  AttorneyTimeOffId,
  AvailabilitySlotsId,
  SlotReservationId,
  DayOfWeek,
  ConsultationType,
  TimeOffType,
  RecurringFrequency,
  TimeSlot,
  BreakPeriod,
  DaySchedule,
  WeeklySchedule,
  ConsultationTypeConfig,
  ConsultationSettings,
  RecurringPattern,
  AvailableSlot,
  TimeOffPeriod,
  AttorneyAvailabilityProfile,
  AvailabilityData,
  BookingRequest,
  SlotReservationRequest,
  AvailabilityQuery,
  AvailabilityResult,
  WorkingHoursUpdateData,
  ConsultationSettingsUpdateData,
  TimeOffCreateData,
  TimeOffUpdateData,
  DateRange,
  TimeRange,
  CalendarDay,
  CalendarWeek,
  ConflictCheckResult,
  AvailabilityStats,
  AvailabilityError,
  AvailabilityDefaults,
  PartialAvailabilityProfile
} from './availability'