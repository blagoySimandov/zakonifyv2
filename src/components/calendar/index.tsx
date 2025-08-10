"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  FileText,
  Video,
  ExternalLink,
} from "lucide-react";
import { ConsultationDetailsModal } from "../consultation-details-modal";
import type { Doc } from "../../../convex/_generated/dataModel";

type ConsultationWithMatter = Doc<"consultations"> & {
  matter?: Doc<"matters"> | null;
};

interface CalendarProps {
  consultations: ConsultationWithMatter[];
  onConsultationClick?: (consultation: ConsultationWithMatter) => void;
}

declare global {
  interface Window {
    addeventatc?: {
      refresh: () => void;
    };
  }
}

export function Calendar({
  consultations,
  onConsultationClick,
}: CalendarProps) {
  const scriptLoaded = useRef(false);
  const [expandedConsultations, setExpandedConsultations] = useState<
    Set<string>
  >(new Set());
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationWithMatter | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const toggleExpanded = (consultationId: string) => {
    setExpandedConsultations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(consultationId)) {
        newSet.delete(consultationId);
      } else {
        newSet.add(consultationId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (
    consultation: ConsultationWithMatter,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setSelectedConsultation(consultation);
    setIsDetailsModalOpen(true);
    onConsultationClick?.(consultation);
    console.log("View consultation details:", consultation);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedConsultation(null);
  };

  const handleJoinVideoCall = (
    consultation: ConsultationWithMatter,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    // Generate a video call URL (in a real app, this would come from the consultation data)
    const videoCallUrl = `https://meet.google.com/consultation-${String(consultation._id).slice(-8)}`;
    window.open(videoCallUrl, "_blank");
    console.log("Joining video call for consultation:", consultation);
  };

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://addevent.com/libs/atc/1.6.1/atc.min.js";

    script.onload = () => {
      scriptLoaded.current = true;
      // Refresh AddEvent after script loads
      if (window.addeventatc) {
        window.addeventatc.refresh();
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Refresh AddEvent when consultations change
    if (scriptLoaded.current && window.addeventatc) {
      setTimeout(() => {
        window.addeventatc?.refresh();
      }, 100);
    }
  }, [consultations]);

  const formatDateForAddEvent = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const formatEndTime = (startTimestamp: number, durationMinutes: number) => {
    const endDate = new Date(startTimestamp + durationMinutes * 60 * 1000);
    const hours = String(endDate.getHours()).padStart(2, "0");
    const minutes = String(endDate.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 flex-shrink-0">
        <CalendarIcon className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Calendar & Consultations
        </h2>
      </div>

      {/* Calendar and Consultations Side by Side - Full height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* AddEvent Calendar Widget - Takes up 2/3 of the space */}
        <div className="lg:col-span-2 h-full overflow-hidden">
          <div className="w-full h-full border rounded-lg bg-gray-50 overflow-hidden">
            <iframe
              src="https://addevent.com/calendar/embed/K9I3C8M0G3?v=2"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Calendar"
              className="rounded border-0"
            />
          </div>
        </div>

        {/* Consultations List - Takes up 1/3 of the space */}
        <div className="lg:col-span-1 h-full overflow-hidden">
          <div className="border rounded-lg p-4 bg-white h-full overflow-hidden flex flex-col">
            <h3 className="text-md font-semibold text-slate-800 mb-4 flex-shrink-0">
              Upcoming Consultations
            </h3>

            {consultations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <CalendarIcon className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">
                  No consultations scheduled yet.
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  New consultations will appear here and in your calendar.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3">
                {consultations.map((consultation) => {
                  const startDateTime = formatDateForAddEvent(
                    consultation.scheduledAt,
                  );
                  const endTime = formatEndTime(
                    consultation.scheduledAt,
                    consultation.duration,
                  );

                  const isExpanded = expandedConsultations.has(
                    String(consultation._id),
                  );
                  const consultationDate = new Date(consultation.scheduledAt);

                  return (
                    <div
                      key={String(consultation._id)}
                      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br transition-all duration-300 hover:shadow-lg ${
                        consultation.status === "confirmed"
                          ? "from-emerald-50 via-white to-emerald-50/30 hover:from-emerald-100 hover:to-emerald-50"
                          : consultation.status === "pending"
                            ? "from-indigo-50 via-white to-indigo-50/30 hover:from-indigo-100 hover:to-indigo-50"
                            : consultation.status === "completed"
                              ? "from-blue-50 via-white to-blue-50/30 hover:from-blue-100 hover:to-blue-50"
                              : "from-slate-50 via-white to-slate-50/30 hover:from-slate-100 hover:to-slate-50"
                      } ${isExpanded ? "ring-2 ring-blue-200 shadow-md" : ""}`}
                    >
                      {/* Status indicator line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${
                          consultation.status === "confirmed"
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                            : consultation.status === "pending"
                              ? "bg-gradient-to-r from-indigo-400 to-indigo-500"
                              : consultation.status === "completed"
                                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                : "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                      />

                      {/* Main content */}
                      <div className="p-4 sm:p-3">
                        {/* Header - Always visible */}
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            toggleExpanded(String(consultation._id))
                          }
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900 text-sm truncate">
                                {consultationDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {consultationDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span>{consultation.duration}m</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  consultation.status === "confirmed"
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : consultation.status === "pending"
                                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                      : consultation.status === "completed"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {consultation.status}
                              </span>
                            </div>
                          </div>

                          <button className="ml-2 p-1 hover:bg-white/50 rounded-full transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            )}
                          </button>
                        </div>

                        {/* Expanded content */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isExpanded
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pt-3 border-t border-slate-200/50 mt-3 space-y-3">
                            {/* Client info placeholder */}
                            <div className="flex items-start gap-2 text-xs">
                              <User className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-slate-600 font-medium">
                                  Client Information
                                </div>
                                <div className="text-slate-500">
                                  Contact details will be available here
                                </div>
                              </div>
                            </div>

                            {/* Consultation type */}
                            <div className="flex items-start gap-2 text-xs">
                              <Video className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-slate-600 font-medium">
                                  Location
                                </div>
                                <div className="text-slate-500 flex items-center gap-1">
                                  Video Call
                                  <ExternalLink className="h-2 w-2" />
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {consultation.notes && (
                              <div className="flex items-start gap-2 text-xs">
                                <FileText className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-slate-600 font-medium">
                                    Notes
                                  </div>
                                  <div className="text-slate-500">
                                    {consultation.notes}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                              {/* Top row - View Details and Join Video Call */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={(e) =>
                                    handleViewDetails(consultation, e)
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View Details
                                </button>

                                {/* Show Join Video Call button for video consultations */}
                                <button
                                  onClick={(e) =>
                                    handleJoinVideoCall(consultation, e)
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <Video className="h-3 w-3" />
                                  Join Video Call
                                </button>
                              </div>

                              {/* Bottom row - Add to Calendar */}
                              <div>
                                <div
                                  className="addeventatc inline-block w-full px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer"
                                  data-id="add-to-calendar"
                                  data-styling="none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Add to Calendar
                                  <span className="start">{startDateTime}</span>
                                  <span className="end">{endTime}</span>
                                  <span className="timezone">
                                    America/New_York
                                  </span>
                                  <span className="title">
                                    Legal Consultation
                                  </span>
                                  <span className="description">
                                    Legal consultation - Duration:{" "}
                                    {consultation.duration} minutes. Status:{" "}
                                    {consultation.status}.
                                    {consultation.notes
                                      ? ` Notes: ${consultation.notes}`
                                      : ""}
                                  </span>
                                  <span className="location">Video Call</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Consultation Details Modal */}
      <ConsultationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        consultation={selectedConsultation}
      />
    </div>
  );
}
