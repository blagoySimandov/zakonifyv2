"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { Video, MapPin, Clock, Euro } from "lucide-react";
import { ConsultationType } from "./hooks";
import { useBookingModal } from "./hooks";

interface ConsultationTypeSelectionProps {
  attorneyId: Id<"attorneys">;
  selectedType: ConsultationType | null;
  onSelect: (type: ConsultationType) => void;
}

export function ConsultationTypeSelection({ 
  attorneyId, 
  selectedType, 
  onSelect 
}: ConsultationTypeSelectionProps) {
  // Use the booking modal hook to get consultation types based on attorney hourly rate
  const { availableConsultationTypes } = useBookingModal(attorneyId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-8 h-8" />;
      case "in-person":
        return <MapPin className="w-8 h-8" />;
      default:
        return <Video className="w-8 h-8" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.VIDEO;
      case "in-person":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.IN_PERSON;
      default:
        return "";
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} ${ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.MINUTES}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.HOUR : ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.HOURS}`;
      }
      return `${hours}${ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.HOUR} ${remainingMinutes}${ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.MINUTES}`;
    }
  };

  if (availableConsultationTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Зареждане на налични типове консултации...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Изберете тип консултация
        </h3>
        <p className="text-gray-600">
          Моля, изберете предпочитания от вас тип консултация
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {availableConsultationTypes.map((type: ConsultationType) => (
          <button
            key={type.type}
            onClick={() => onSelect(type)}
            className={`p-6 rounded-3xl border-2 transition-all duration-200 text-left hover:shadow-lg transform hover:-translate-y-1 ${
              selectedType?.type === type.type
                ? "border-primary-600 bg-primary-50 shadow-lg shadow-primary-600/25"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-2xl ${
                selectedType?.type === type.type
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {getTypeIcon(type.type)}
              </div>
            </div>

            <h4 className={`text-lg font-semibold mb-2 ${
              selectedType?.type === type.type ? "text-primary-900" : "text-gray-900"
            }`}>
              {getTypeLabel(type.type)}
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(type.duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-primary-600" />
                <span className={`font-bold ${
                  selectedType?.type === type.type ? "text-primary-700" : "text-gray-900"
                }`}>
                  €{type.price}
                </span>
              </div>
            </div>

            {selectedType?.type === type.type && (
              <div className="mt-4 px-3 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium text-center">
                Избрано
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}