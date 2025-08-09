"use client";

import { X, Clock, User, FileText, Calendar as CalendarIcon, Video, DollarSign, AlertCircle } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";

type ConsultationWithMatter = Doc<"consultations"> & {
  matter?: Doc<"matters"> | null;
};

interface ConsultationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: ConsultationWithMatter | null;
}

export function ConsultationDetailsModal({ 
  isOpen, 
  onClose, 
  consultation 
}: ConsultationDetailsModalProps) {
  if (!isOpen || !consultation) return null;

  const consultationDate = new Date(consultation.scheduledAt);
  const endTime = new Date(consultation.scheduledAt + (consultation.duration * 60 * 1000));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleJoinVideoCall = () => {
    const videoCallUrl = `https://meet.google.com/consultation-${String(consultation._id).slice(-8)}`;
    window.open(videoCallUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Consultation Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {consultationDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Status</div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consultation.status)}`}>
                    {consultation.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Time</div>
                  <div className="text-sm text-gray-600">
                    {consultationDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })} - {endTime.toLocaleTimeString([], {
                      hour: "2-digit", 
                      minute: "2-digit"
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    Duration: {consultation.duration} minutes
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Fee</div>
                  <div className="text-sm text-gray-600">
                    ${consultation.price?.toFixed(2) || "0.00"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Location</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    Video Call
                    <button
                      onClick={handleJoinVideoCall}
                      className="text-blue-600 hover:text-blue-800 underline text-xs"
                    >
                      (Join Now)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information Placeholder */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">Name</div>
                  <div className="text-sm text-gray-600">Client name will appear here</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">client@email.com</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Phone</div>
                  <div className="text-sm text-gray-600">+1 (555) 000-0000</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Matter ID</div>
                  <div className="text-sm text-gray-600">
                    {consultation.matterId ? String(consultation.matterId).slice(-8) : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {consultation.notes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {consultation.notes}
                </p>
              </div>
            </div>
          )}

          {/* Consultation History Placeholder */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Related Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Created</div>
                  <div className="text-gray-600">
                    {new Date(consultation.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Last Updated</div>
                  <div className="text-gray-600">
                    {new Date(consultation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Consultation ID</div>
                  <div className="text-gray-600 font-mono text-xs">
                    {String(consultation._id).slice(-12)}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Type</div>
                  <div className="text-gray-600">Video Consultation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleJoinVideoCall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Video className="h-4 w-4" />
            Join Video Call
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}