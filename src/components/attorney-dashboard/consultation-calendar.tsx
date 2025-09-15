"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface ConsultationCalendarProps {
  attorney: any;
}

interface CalendarEvent {
  id: string;
  type: "consultation" | "available" | "blocked" | "vacation";
  title: string;
  startTime: Date;
  endTime: Date;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  client?: {
    fullName: string;
    email: string;
  };
  consultationType?: "video" | "in-person";
  meetingUrl?: string;
  blockReason?: string;
  duration?: number;
  price?: number;
  notes?: string;
}

const DAYS_OF_WEEK = ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"];
const MONTHS = [
  "Януари", "Февруари", "Март", "Април", "Май", "Юни",
  "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
];

const TIME_SLOTS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
});

export function ConsultationCalendar({ attorney }: ConsultationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  
  // Mutations
  const updateConsultationStatus = useMutation(api.consultations.updateStatus);
  const cancelConsultation = useMutation(api.consultations.cancel);

  // Get consultations
  const consultations = useQuery(
    api.consultations.getByAttorneyId,
    attorney?._id ? { 
      attorneyId: attorney._id,
      status: undefined 
    } : "skip"
  ) || [];

  // Get availability profile
  const availabilityProfile = useQuery(
    api.availability.getAvailabilityProfile,
    attorney?._id ? { attorneyId: attorney._id } : "skip"
  );

  // Get blocked periods
  const blockedPeriods = useQuery(
    api.availability.getBlockedPeriods,
    attorney?._id ? { attorneyId: attorney._id } : "skip"
  ) || [];

  const calendarEvents = useMemo(() => {
    console.log("📅 Raw consultations data:", consultations);
    const events: CalendarEvent[] = [];

    // Add consultations
    consultations.forEach((consultation: any) => {
      console.log("🔍 Processing consultation:", {
        id: consultation._id,
        clientUserId: consultation.clientUserId,
        clientEmail: consultation.clientEmail,
        clientName: consultation.clientName,
        hasClientData: !!(consultation.clientEmail && consultation.clientName)
      });
      
      events.push({
        id: consultation._id,
        type: "consultation",
        title: consultation.status === "cancelled" ? "Отменена консултация" : "Консултация",
        startTime: new Date(consultation.scheduledAt),
        endTime: new Date(consultation.scheduledAt + consultation.duration * 60 * 1000),
        status: consultation.status,
        client: {
          fullName: consultation.clientName || "Непознат клиент",
          email: consultation.clientEmail || "Няма имейл"
        },
        consultationType: consultation.consultationType || "video",
        meetingUrl: consultation.meetingUrl,
        duration: consultation.duration,
        price: consultation.price,
        notes: consultation.notes
      });
    });

    // Add blocked periods
    blockedPeriods.forEach((period: any) => {
      const typeConfig = getBlockedPeriodConfig(period.type);
      events.push({
        id: period._id,
        type: period.type === "vacation" ? "vacation" : "blocked",
        title: period.title || typeConfig.label,
        startTime: new Date(period.startTime),
        endTime: new Date(period.endTime),
        blockReason: period.reason || typeConfig.label
      });
    });

    return events;
  }, [consultations, blockedPeriods]);

  const getBlockedPeriodConfig = (type: string) => {
    const configs = {
      vacation: { label: "Отпуска", color: "bg-blue-100 text-blue-700 border-blue-200" },
      holiday: { label: "Празник", color: "bg-green-100 text-green-700 border-green-200" },
      "court-appearance": { label: "Съдебно заседание", color: "bg-red-100 text-red-700 border-red-200" },
      personal: { label: "Личен ангажимент", color: "bg-purple-100 text-purple-700 border-purple-200" },
      conference: { label: "Конференция", color: "bg-orange-100 text-orange-700 border-orange-200" },
      unavailable: { label: "Недостъпен", color: "bg-gray-100 text-gray-700 border-gray-200" }
    };
    return configs[type as keyof typeof configs] || configs.unavailable;
  };

  const getEventColor = (event: CalendarEvent) => {
    switch (event.type) {
      case "consultation":
        switch (event.status) {
          case "confirmed": return "bg-green-100 text-green-800 border-green-200";
          case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
          case "cancelled": return "bg-red-100 text-red-800 border-red-200";
          default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
      case "vacation":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "blocked":
        return getBlockedPeriodConfig(event.blockReason || "").color;
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = event.startTime;
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bg-BG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleConfirmConsultation = async (consultationId: string) => {
    try {
      await updateConsultationStatus({ 
        id: consultationId as Id<"consultations">, 
        status: "confirmed" 
      });
    } catch (error) {
      console.error("Failed to confirm consultation:", error);
    }
  };

  const handleCancelConsultation = async (consultationId: string) => {
    try {
      await cancelConsultation({ 
        id: consultationId as Id<"consultations"> 
      });
    } catch (error) {
      console.error("Failed to cancel consultation:", error);
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200">
        {/* Month Header */}
        <div className="bg-primary-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-primary-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-primary-100 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-32 border-b border-r border-gray-200" />;
            }

            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`h-32 border-b border-r border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-primary-50" : ""
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? "text-primary-600 bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center" : "text-gray-900"
                }`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border ${getEventColor(event)} truncate`}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} повече
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEventDetails = (event: CalendarEvent) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${getEventColor(event)}`}>
              {event.type === "consultation" ? (
                event.consultationType === "video" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />
              ) : event.type === "vacation" ? (
                <CalendarIcon className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-600">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
            </div>
          </div>
          {event.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event)}`}>
              {event.status === "confirmed" && "Потвърдена"}
              {event.status === "pending" && "Чакаща"}
              {event.status === "completed" && "Завършена"}
              {event.status === "cancelled" && "Отменена"}
            </span>
          )}
        </div>

        {event.type === "consultation" && (
          <div className="space-y-3 text-sm">
            {/* Client Information */}
            {event.client && (
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Клиент:</span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-900 font-medium">{event.client.fullName}</div>
                  <div className="text-gray-700 text-sm">{event.client.email}</div>
                </div>
              </div>
            )}
            
            {/* Consultation Details */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                {event.consultationType === "video" ? (
                  <Video className="w-4 h-4 text-gray-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-gray-700 font-medium">
                  {event.consultationType === "video" ? "Видео консултация" : "Лична среща"}
                </span>
              </div>

              {event.duration && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">{event.duration} минути</span>
                </div>
              )}

              {event.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-600">€</span>
                  <span className="text-gray-700 font-medium">{event.price}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Бележки:</div>
                <div className="text-gray-800 text-sm">{event.notes}</div>
              </div>
            )}

            {/* Meeting URL placeholder */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">URL за среща:</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {event.meetingUrl || "URL ще бъде генериран преди консултацията"}
              </div>
            </div>

            {/* Action buttons for consultations */}
            {event.status !== "completed" && event.status !== "cancelled" && (
              <div className="flex space-x-2 mt-4">
                {event.status === "pending" && (
                  <button 
                    onClick={() => handleConfirmConsultation(event.id)}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Потвърди
                  </button>
                )}
                <button 
                  onClick={() => handleCancelConsultation(event.id)}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Откажи
                </button>
              </div>
            )}
          </div>
        )}

        {(event.type === "blocked" || event.type === "vacation") && event.blockReason && (
          <div className="text-sm text-gray-600">
            <p>{event.blockReason}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
          {["month", "week", "day"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {mode === "month" && "Месец"}
              {mode === "week" && "Седмица"}
              {mode === "day" && "Ден"}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600">
          Общо {consultations.length} консултации
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          {renderMonthView()}
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate ? `Събития за ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}` : "Изберете дата"}
          </h3>
          
          {selectedDate ? (
            <div className="max-h-96 overflow-y-auto">
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>Няма събития за тази дата</p>
                </div>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id}>
                    {renderEventDetails(event)}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Изберете дата, за да видите събитията</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}