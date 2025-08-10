"use client";

import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  MoreVertical,
  DollarSign,
} from "lucide-react";
import { DASHBOARD_LABELS } from "./messages";

interface ConsultationData {
  id: string;
  startTime: number;
  endTime: number;
  type: string;
  clientName: string;
  topic?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  duration: number;
}

interface UpcomingConsultationsProps {
  consultations: ConsultationData[];
  onReschedule: (consultationId: string) => void;
  onCancel: (consultationId: string) => void;
}

export function UpcomingConsultations({
  consultations,
  onReschedule,
  onCancel,
}: UpcomingConsultationsProps) {
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `Today, ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${timeString}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "in-person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-700 bg-green-50";
      case "pending":
        return "text-yellow-700 bg-yellow-50";
      case "completed":
        return "text-blue-700 bg-blue-50";
      case "cancelled":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const upcomingConsultations = consultations
    .filter((consultation) => consultation.startTime > Date.now())
    .sort((a, b) => a.startTime - b.startTime)
    .slice(0, 5); // Show only next 5 consultations

  const renderConsultation = (consultation: ConsultationData) => (
    <div
      key={consultation.id}
      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {consultation.clientName || "Unknown Client"}
            </h4>
            <p className="text-sm text-gray-500">
              {consultation.topic || "No topic specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}
          >
            {DASHBOARD_LABELS.CONSULTATION_STATUS[
              consultation.status as keyof typeof DASHBOARD_LABELS.CONSULTATION_STATUS
            ] || consultation.status}
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDateTime(consultation.startTime)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{consultation.duration} minutes</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          {getConsultationTypeIcon(
            consultation.type as "video" | "phone" | "in-person",
          )}
          <span>
            {DASHBOARD_LABELS.CONSULTATION_TYPE[
              consultation.type as keyof typeof DASHBOARD_LABELS.CONSULTATION_TYPE
            ] || consultation.type}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>${consultation.price}</span>
        </div>
      </div>

      {consultation.topic && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
          <strong>Topic:</strong> {consultation.topic}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onReschedule(consultation.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.RESCHEDULE}
        </button>
        <button
          onClick={() => onCancel(consultation.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.CANCEL}
        </button>
        {consultation.status === "confirmed" && (
          <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.JOIN_CALL}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.TITLE}
          </h3>
          <p className="text-sm text-gray-600">
            {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.SUBTITLE}
          </p>
        </div>
        {upcomingConsultations.length > 0 && (
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.VIEW_ALL}
          </button>
        )}
      </div>

      {upcomingConsultations.length > 0 ? (
        <div className="space-y-4">
          {upcomingConsultations.map(renderConsultation)}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {DASHBOARD_LABELS.UPCOMING_CONSULTATIONS.NO_CONSULTATIONS}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Clients can book consultations with you when your availability is
            set up.
          </p>
        </div>
      )}
    </div>
  );
}
