"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { ConsultationType } from "@/types/availability";
import { BOOKING_CONSTANTS } from "./constants";
import { Video, Phone, MapPin, Clock } from "lucide-react";

interface ConsultationTypeStepProps {
  attorneyId: Id<"attorneys">;
  consultationType: ConsultationType | null;
  duration: number | null;
  onConsultationTypeChange: (type: ConsultationType) => void;
  onDurationChange: (duration: number) => void;
}

export function ConsultationTypeStep({
  consultationType,
  duration,
  onConsultationTypeChange,
  onDurationChange,
}: ConsultationTypeStepProps) {
  const getTypeIcon = (type: ConsultationType) => {
    switch (type) {
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'phone':
        return <Phone className="w-6 h-6" />;
      case 'in-person':
        return <MapPin className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.SUBTITLE}
        </p>
      </div>

      {/* Consultation Type Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.TYPE_LABEL}
        </h3>
        
        <div className="grid gap-4">
          {(Object.keys(BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.TYPES) as ConsultationType[]).map((type) => {
            const typeData = BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.TYPES[type];
            const isSelected = consultationType === type;
            
            return (
              <button
                key={type}
                onClick={() => onConsultationTypeChange(type)}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getTypeIcon(type)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {typeData.title}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {typeData.description}
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {typeData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.DURATION_LABEL}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {BOOKING_CONSTANTS.DURATION_OPTIONS.map((option) => {
            const isSelected = duration === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onDurationChange(option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          {BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.PRICING_NOTE}
        </p>
      </div>
    </div>
  );
}