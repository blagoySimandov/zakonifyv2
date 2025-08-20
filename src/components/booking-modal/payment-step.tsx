"use client";

import React from "react";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { CreditCard, Shield, Lock, AlertCircle } from "lucide-react";
import { ConsultationType, TimeSlot, PaymentData } from "./hooks";

interface PaymentStepProps {
  selectedSlot: TimeSlot;
  consultationType: ConsultationType;
  attorneyName: string;
  paymentData: PaymentData | null;
  onUpdate: (data: PaymentData) => void;
  isProcessing: boolean;
}

export function PaymentStep({
  selectedSlot,
  consultationType,
  attorneyName,
  paymentData,
  onUpdate,
  isProcessing,
}: PaymentStepProps) {
  // Automatically set up Stripe payment data when component loads
  React.useEffect(() => {
    if (!paymentData) {
      const stripePaymentData: PaymentData = {
        method: "stripe",
        cardLast4: "4242", // Mock data for now
        billingAddress: {
          name: "",
          street: "",
          city: "",
          postalCode: "",
          country: "BG",
        },
      };
      onUpdate(stripePaymentData);
    }
  }, [paymentData, onUpdate]);

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };


  // Stripe Elements placeholder
  const StripeElementsPlaceholder = () => (
    <div className="space-y-6">
      {/* Stripe Elements would be integrated here */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">Stripe Integration Placeholder</h4>
            <p className="text-amber-700 text-sm mt-1">
              В реалната версия тук ще бъде интегриран Stripe Elements за сигурно плащане с карта.
            </p>
          </div>
        </div>
      </div>

      {/* Mock card form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.CARD_NUMBER}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-12"
              readOnly
            />
            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.EXPIRY_DATE}
            </label>
            <input
              type="text"
              placeholder="12/25"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.SECURITY_CODE}
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.CARDHOLDER_NAME}
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            readOnly
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.TITLE}
        </h3>
        <p className="text-gray-600">
          Довършете запазването с безопасно плащане
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.BOOKING_DETAILS}
          </h4>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-600">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.ATTORNEY}
              </span>
              <span className="font-medium text-gray-900">{attorneyName}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.DATE_TIME}
              </span>
              <span className="font-medium text-gray-900 text-right">
                {formatTime(selectedSlot.startTime)}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.TYPE}
              </span>
              <span className="font-medium text-gray-900">
                {selectedSlot.consultationType === "video" && ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.VIDEO}
                {selectedSlot.consultationType === "in-person" && ATTORNEY_PROFILE_MESSAGES.BOOKING.CONSULTATION_TYPES.IN_PERSON}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.CONFIRMATION.DURATION}
              </span>
              <span className="font-medium text-gray-900">
                {consultationType.duration} {ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.MINUTES}
              </span>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-start">
              <span className="text-lg font-semibold text-gray-900">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.TOTAL}
              </span>
              <span className="text-2xl font-bold text-primary-600">
                €{selectedSlot.price}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.SECURE_PAYMENT}
            </span>
            <Lock className="w-4 h-4 text-green-600" />
          </div>

          {/* Stripe Payment Method Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl border-2 border-primary-200">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-800">Кредитна/дебитна карта</span>
              <span className="text-xs bg-primary-200 text-primary-700 px-2 py-1 rounded-full font-medium">
                Powered by Stripe
              </span>
            </div>
          </div>

          {/* Stripe Payment Form */}
          <StripeElementsPlaceholder />
        </div>
      </div>
    </div>
  );
}