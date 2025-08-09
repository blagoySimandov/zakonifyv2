"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { AvailableSlot } from "@/types/availability";
import { CALENDAR_CONSTANTS } from "./constants";
import { X, Calendar, Clock, Video, DollarSign, Save, Loader } from "lucide-react";

interface BookingModalProps {
  slot: AvailableSlot;
  attorneyId: Id<"attorneys">;
  clientId?: Id<"clients">;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BookingModal({ 
  slot, 
  clientId, 
  onConfirm, 
  onCancel 
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = () => {
    return Math.round((slot.endTime - slot.startTime) / (1000 * 60)); // minutes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement booking logic
      // This would call a mutation to create the consultation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onConfirm();
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {CALENDAR_CONSTANTS.BOOKING_MODAL.TITLE}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consultation Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            {CALENDAR_CONSTANTS.BOOKING_MODAL.CONSULTATION_DETAILS}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.DATE_TIME_LABEL}
                </span>
                <p className="text-gray-900">{formatDateTime(slot.startTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.DURATION_LABEL}
                </span>
                <p className="text-gray-900">{calculateDuration()} minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-purple-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.TYPE_LABEL}
                </span>
                <p className="text-gray-900">
                  {CALENDAR_CONSTANTS.CONSULTATION_TYPES[slot.consultationType]?.label || slot.consultationType}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.PRICE_LABEL}
                </span>
                <p className="text-gray-900 font-semibold">${slot.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Client Information (if not logged in) */}
          {!clientId && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {CALENDAR_CONSTANTS.BOOKING_MODAL.CONTACT_INFO}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {CALENDAR_CONSTANTS.BOOKING_MODAL.NAME_LABEL}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {CALENDAR_CONSTANTS.BOOKING_MODAL.EMAIL_LABEL}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {CALENDAR_CONSTANTS.BOOKING_MODAL.PHONE_LABEL}
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {CALENDAR_CONSTANTS.BOOKING_MODAL.NOTES_LABEL}
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={CALENDAR_CONSTANTS.BOOKING_MODAL.NOTES_PLACEHOLDER}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms */}
          <div className="mb-6">
            <p className="text-xs text-gray-500">
              {CALENDAR_CONSTANTS.BOOKING_MODAL.TERMS_TEXT}{' '}
              <a href="#" className="text-blue-600 hover:underline">
                {CALENDAR_CONSTANTS.BOOKING_MODAL.TERMS_LINK}
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                {CALENDAR_CONSTANTS.BOOKING_MODAL.PRIVACY_LINK}
              </a>
              .
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {CALENDAR_CONSTANTS.BOOKING_MODAL.CANCEL}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.BOOKING}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {CALENDAR_CONSTANTS.BOOKING_MODAL.CONFIRM_BOOKING}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}