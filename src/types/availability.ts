import { Doc, Id } from '../../convex/_generated/dataModel'

// Database document types
export type AttorneyAvailability = Doc<'attorneyAvailability'>
export type AttorneyTimeOff = Doc<'attorneyTimeOff'>
export type AvailabilitySlots = Doc<'availabilitySlots'>
export type SlotReservation = Doc<'slotReservations'>

// IDs
export type AttorneyAvailabilityId = Id<'attorneyAvailability'>
export type AttorneyTimeOffId = Id<'attorneyTimeOff'>
export type AvailabilitySlotsId = Id<'availabilitySlots'>
export type SlotReservationId = Id<'slotReservations'>

// Enums and Union Types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type ConsultationType = 'phone' | 'video' | 'in-person'
export type TimeOffType = 'vacation' | 'holiday' | 'sick' | 'unavailable' | 'court' | 'continuing-education'
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly'

// Time-related interfaces
export interface TimeSlot {
  start: string // HH:MM format (24-hour)
  end: string   // HH:MM format (24-hour)
}

export interface BreakPeriod extends TimeSlot {
  title?: string
}

export interface DaySchedule {
  start: string
  end: string
  breaks?: BreakPeriod[]
}

export interface WeeklySchedule {
  monday?: DaySchedule
  tuesday?: DaySchedule
  wednesday?: DaySchedule
  thursday?: DaySchedule
  friday?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
}

// Consultation configuration
export interface ConsultationTypeConfig {
  type: ConsultationType
  duration: number // minutes
  price: number
  isEnabled: boolean
}

export interface ConsultationSettings {
  defaultDuration: number // minutes
  bufferTime: number // minutes between consultations
  maxConsultationsPerDay: number
  allowBackToBack: boolean
  minAdvanceBooking: number // hours
  maxAdvanceBooking: number // days
  consultationTypes: ConsultationTypeConfig[]
}

// Recurring patterns
export interface RecurringPattern {
  frequency: RecurringFrequency
  interval: number // Every N weeks/months/years
  endDate?: number // timestamp
  daysOfWeek?: number[] // 0=Sunday, 1=Monday, etc. (for weekly patterns)
}

// Available time slot for clients
export interface AvailableSlot {
  startTime: number // timestamp
  endTime: number   // timestamp
  consultationType: ConsultationType
  price: number
  isEmergencySlot: boolean
}

// Time off period
export interface TimeOffPeriod {
  id?: AttorneyTimeOffId
  attorneyId: Id<'attorneys'>
  startTime: number
  endTime: number
  type: TimeOffType
  isRecurring: boolean
  recurringPattern?: RecurringPattern
  title?: string
  reason?: string
  createdAt?: number
  updatedAt?: number
}

// Complete availability profile
export interface AttorneyAvailabilityProfile {
  id?: AttorneyAvailabilityId
  attorneyId: Id<'attorneys'>
  timeZone: string
  workingHours: WeeklySchedule
  consultationSettings: ConsultationSettings
  isActive: boolean
  createdAt?: number
  updatedAt?: number
}

// Client-facing availability data
export interface AvailabilityData {
  attorneyId: Id<'attorneys'>
  timeZone: string
  availableSlots: AvailableSlot[]
  nextAvailableSlot?: AvailableSlot
  totalSlotsAvailable: number
}

// Booking-related types
export interface BookingRequest {
  attorneyId: Id<'attorneys'>
  clientId: Id<'clients'>
  startTime: number
  endTime: number
  consultationType: ConsultationType
  duration: number
  price: number
  notes?: string
}

export interface SlotReservationRequest {
  attorneyId: Id<'attorneys'>
  clientId?: Id<'clients'>
  startTime: number
  endTime: number
  consultationType: ConsultationType
  reservedBy: string // session ID or user identifier
  durationMinutes?: number // how long to hold the reservation
}

// Availability calculation parameters
export interface AvailabilityQuery {
  attorneyId: Id<'attorneys'>
  startDate: Date
  endDate: Date
  consultationType?: ConsultationType
  duration?: number // minutes
  clientTimeZone?: string
}

// Availability calculation result
export interface AvailabilityResult {
  slots: AvailableSlot[]
  totalCount: number
  nextAvailable?: AvailableSlot
  calculatedAt: number
  expiresAt: number
}

// Working hours update data
export interface WorkingHoursUpdateData {
  attorneyId: Id<'attorneys'>
  workingHours: WeeklySchedule
  timeZone?: string
}

export interface ConsultationSettingsUpdateData {
  attorneyId: Id<'attorneys'>
  consultationSettings: Partial<ConsultationSettings>
}

// Time off creation/update data
export interface TimeOffCreateData {
  attorneyId: Id<'attorneys'>
  startTime: number
  endTime: number
  type: TimeOffType
  isRecurring?: boolean
  recurringPattern?: RecurringPattern
  title?: string
  reason?: string
}

export interface TimeOffUpdateData extends Partial<TimeOffCreateData> {
  id: AttorneyTimeOffId
}

// Utility types for time calculations
export interface DateRange {
  start: Date
  end: Date
}

export interface TimeRange {
  start: number // timestamp
  end: number   // timestamp
}

// Calendar display helpers
export interface CalendarDay {
  date: Date
  dateString: string // YYYY-MM-DD
  isToday: boolean
  isWeekend: boolean
  hasAvailability: boolean
  slotsCount: number
  dayOfWeek: DayOfWeek
}

export interface CalendarWeek {
  weekStart: Date
  weekEnd: Date
  days: CalendarDay[]
}

// Conflict detection
export interface ConflictCheckResult {
  hasConflict: boolean
  conflictingConsultations: Id<'consultations'>[]
  conflictingTimeOff: AttorneyTimeOffId[]
  conflictingReservations: SlotReservationId[]
}

// Statistics and analytics
export interface AvailabilityStats {
  totalHoursPerWeek: number
  averageSlotsPerDay: number
  utilizationRate: number // percentage
  peakHours: TimeSlot[]
  leastBookedDays: DayOfWeek[]
  consultationsToday: number
  availableHoursToday: number
  bookingsThisWeek: number
}

// Error types
export interface AvailabilityError {
  code: string
  message: string
  details?: Record<string, unknown> | string | null
}

// Default values and constants interface
export interface AvailabilityDefaults {
  timeZone: string
  workingHours: WeeklySchedule
  consultationSettings: ConsultationSettings
}

// Client information for booking
export interface ClientInfo {
  fullName: string
  email: string
  phone: string
  company?: string
  consultationTopic: string
  additionalNotes?: string
  privacyConsent: boolean
  marketingConsent: boolean
}

// Payment information for booking
export interface PaymentInfo {
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer'
  cardNumber?: string
  expiryDate?: string
  cvc?: string
  cardholderName?: string
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

// Form validation errors
export interface ValidationErrors {
  [key: string]: string[]
}

// Export utility type for partial updates
export type PartialAvailabilityProfile = Partial<Omit<AttorneyAvailabilityProfile, 'id' | 'attorneyId' | 'createdAt' | 'updatedAt'>>