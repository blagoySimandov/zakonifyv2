"use client";

import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { CheckCircle, Calendar, Mail, Clock, MapPin, Video } from "lucide-react";
import { ConsultationType, TimeSlot } from "./hooks";

interface BookingSuccessProps {
  bookingId: string;
  attorneyName: string;
  selectedSlot: TimeSlot;
  consultationType: ConsultationType;
  onClose: () => void;
}

export function BookingSuccess({
  bookingId,
  attorneyName,
  selectedSlot,
  consultationType,
  onClose,
}: BookingSuccessProps) {
  const formatDateTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const getConsultationIcon = () => {
    switch (selectedSlot.consultationType) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "in-person":
        return <MapPin className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getConsultationTypeLabel = () => {
    switch (selectedSlot.consultationType) {
      case "video":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.VIDEO;
      case "in-person":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.IN_PERSON;
      default:
        return "";
    }
  };

  const addToCalendar = () => {
    const startDate = new Date(selectedSlot.startTime);
    const endDate = new Date(selectedSlot.endTime);
    
    const startDateString = startDate.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDateString = endDate.toISOString().replace(/[-:]/g, '').split('.')[0];
    
    const title = encodeURIComponent(`Консултация с ${attorneyName}`);
    const details = encodeURIComponent(
      `${getConsultationTypeLabel()} с ${attorneyName}\n\n` +
      `Тип: ${getConsultationTypeLabel()}\n` +
      `Продължителност: ${consultationType.duration} минути\n` +
      `Номер на запазване: ${bookingId}`
    );
    
    const googleCalendarUrl = 
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${title}` +
      `&dates=${startDateString}/${endDateString}` +
      `&details=${details}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Success Message */}
      <h3 className="text-3xl font-bold text-gray-900 mb-3">
        {ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.TITLE}
      </h3>
      
      <p className="text-gray-600 mb-2 text-lg">
        {ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.BOOKING_CONFIRMED}
      </p>
      
      <p className="text-gray-500 mb-8">
        Номер на запазване: <span className="font-mono text-primary-600 font-semibold">#{bookingId.slice(-8).toUpperCase()}</span>
      </p>

      {/* Booking Details Card */}
      <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.BOOKING_DETAILS}
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {attorneyName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{attorneyName}</p>
              <p className="text-sm text-gray-600">Адвокат</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{formatDateTime(selectedSlot.startTime)}</p>
              <p className="text-sm text-gray-600">{consultationType.duration} минути</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
              {getConsultationIcon()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{getConsultationTypeLabel()}</p>
              <p className="text-sm text-gray-600">€{selectedSlot.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-3xl p-6 mb-8 text-left">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.NEXT_STEPS}
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Имейл потвърждение</p>
              <p className="text-sm text-gray-600">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.CONFIRMATION_EMAIL}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Календарно напомняне</p>
              <p className="text-sm text-gray-600">
                Добавете консултацията в своя календар
              </p>
            </div>
          </div>

          {selectedSlot.consultationType === "video" && (
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Видео линк</p>
                <p className="text-sm text-gray-600">
                  Ще получите линк за видео разговора в имейла
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={addToCalendar}
          className="px-6 py-3 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition-all duration-200 font-semibold flex items-center gap-2 flex-1 justify-center"
        >
          <Calendar className="w-5 h-5" />
          {ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.CALENDAR_REMINDER}
        </button>
        
        <button
          onClick={onClose}
          className="px-8 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 flex-1"
        >
          Затвори
        </button>
      </div>
    </div>
  );
}