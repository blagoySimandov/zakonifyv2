"use client";

import { CheckCircle, Calendar } from "lucide-react";

interface BookingSuccessModalProps {
  consultationId: string;
  onClose: () => void;
}

export function BookingSuccessModal({
  consultationId,
  onClose,
}: BookingSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your consultation has been successfully booked
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Confirmation Number
            </p>
            <p className="text-lg font-mono font-bold text-blue-600">
              {consultationId.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3 mb-6 text-sm text-gray-600 text-left">
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>
                  You will receive a confirmation email with consultation
                  details
                </span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Join your consultation at the scheduled time using the
                  provided link
                </span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Prepare any relevant documents or questions for your
                  consultation
                </span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
