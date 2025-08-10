export const DASHBOARD_LABELS = {
  TITLE: "Availability Dashboard",
  SUBTITLE: "Manage your schedule, consultations, and availability settings",
  LOADING_MESSAGE: "Loading dashboard...",

  STATUS: {
    ONLINE: "Online",
    OFFLINE: "Offline",
    AWAY: "Away",
  },

  ACTIONS: {
    GO_ONLINE: "Go Online",
    GO_OFFLINE: "Go Offline",
    EDIT_SCHEDULE: "Edit Schedule",
    ADD_TIME_OFF: "Add Time Off",
    VIEW_SETTINGS: "Settings",
    VIEW_ANALYTICS: "View Analytics",
    REFRESH: "Refresh",
  },

  STATS: {
    TODAYS_CONSULTATIONS: "Today's Consultations",
    AVAILABLE_HOURS_TODAY: "Available Hours Today",
    THIS_WEEK_BOOKINGS: "This Week Bookings",
    UTILIZATION_RATE: "Utilization Rate",
    TOTAL_REVENUE: "Total Revenue",
    AVERAGE_RATING: "Average Rating",
  },

  WORKING_HOURS: {
    TITLE: "Working Hours",
    SUBTITLE: "Your current weekly schedule",
    NO_SCHEDULE: "No working hours configured",
    EDIT_BUTTON: "Edit Hours",
    TIME_ZONE_LABEL: "Time Zone:",
    BREAK_LABEL: "Break:",
    NOT_WORKING: "Not working",
  },

  UPCOMING_CONSULTATIONS: {
    TITLE: "Upcoming Consultations",
    SUBTITLE: "Your next scheduled appointments",
    NO_CONSULTATIONS: "No upcoming consultations",
    VIEW_ALL: "View All",
    RESCHEDULE: "Reschedule",
    CANCEL: "Cancel",
    JOIN_CALL: "Join Call",
    CLIENT_INFO: "Client Info",
    DURATION_LABEL: "Duration:",
    TYPE_LABEL: "Type:",
    PRICE_LABEL: "Price:",
  },

  QUICK_ACTIONS: {
    TITLE: "Quick Actions",
    SCHEDULE_TIME_OFF: {
      TITLE: "Schedule Time Off",
      DESCRIPTION: "Block time for vacation, holidays, or other unavailability",
    },
    UPDATE_SETTINGS: {
      TITLE: "Consultation Settings",
      DESCRIPTION: "Update duration, pricing, and buffer times",
    },
    VIEW_ANALYTICS: {
      TITLE: "View Analytics",
      DESCRIPTION: "See detailed reports on your availability and bookings",
    },
    EMERGENCY_SLOTS: {
      TITLE: "Emergency Slots",
      DESCRIPTION: "Configure slots for urgent consultations",
    },
  },

  AVAILABILITY_STATS: {
    TITLE: "Availability Insights",
    SUBTITLE: "Your scheduling patterns and efficiency",
    PEAK_HOURS: "Peak Booking Hours",
    LEAST_BOOKED_DAYS: "Least Booked Days",
    UTILIZATION_TREND: "Utilization Trend",
    NO_DATA: "No data available yet",
  },

  TIME_FORMATS: {
    TIME_12H: "h:mm A",
    TIME_24H: "HH:mm",
    DATE_SHORT: "MMM DD",
    DATE_LONG: "MMMM DD, YYYY",
    DATETIME: "MMM DD, h:mm A",
  },

  ERROR: {
    TITLE: "Unable to Load Dashboard",
    GENERIC_MESSAGE:
      "There was an error loading your availability dashboard. Please try again.",
    NETWORK_ERROR:
      "Network connection error. Please check your internet connection.",
    RETRY_BUTTON: "Try Again",
  },

  WELCOME: {
    TITLE: "Welcome to Your Availability Dashboard!",
    MESSAGE:
      "Start by setting up your working hours and consultation preferences to allow clients to book appointments with you.",
    CTA_BUTTON: "Set Up Availability",
  },

  NOTIFICATIONS: {
    ONLINE_STATUS_UPDATED: "Your online status has been updated",
    SCHEDULE_UPDATED: "Your schedule has been updated",
    TIME_OFF_ADDED: "Time off has been scheduled",
    SETTINGS_SAVED: "Settings have been saved",
    ERROR_UPDATING_STATUS: "Failed to update online status",
    ERROR_SAVING_SETTINGS: "Failed to save settings",
  },

  CONFIRMATION: {
    GO_OFFLINE_TITLE: "Go Offline?",
    GO_OFFLINE_MESSAGE:
      "Clients will not be able to book new consultations while you are offline.",
    CANCEL_CONSULTATION_TITLE: "Cancel Consultation?",
    CANCEL_CONSULTATION_MESSAGE:
      "This action cannot be undone. The client will be notified.",
    CONFIRM: "Confirm",
    CANCEL: "Cancel",
  },

  CONSULTATION_STATUS: {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    IN_PROGRESS: "In Progress",
  },

  CONSULTATION_TYPE: {
    video: "Video Call",
    phone: "Phone Call",
    "in-person": "In-Person",
  },

  DAY_NAMES: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },

  DAY_SHORT_NAMES: {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  },
} as const;
