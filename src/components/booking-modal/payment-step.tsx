"use client";

import { useState } from "react";
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
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "paypal" | "bank-transfer">("stripe");

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const handlePaymentMethodChange = (method: "stripe" | "paypal" | "bank-transfer") => {
    setSelectedMethod(method);
    
    // Create payment data based on method
    const newPaymentData: PaymentData = {
      method,
      // For now, we'll create a mock payment data
      // In real implementation, this would integrate with Stripe Elements
      cardLast4: method === "stripe" ? "4242" : undefined,
      billingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "Sofia",
        postalCode: "1000",
        country: "Bulgaria",
      },
    };

    onUpdate(newPaymentData);
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

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              {ATTORNEY_PROFILE_MESSAGES.BOOKING.PAYMENT.PAYMENT_METHOD}
            </h4>

            <div className="space-y-3">
              <button
                onClick={() => handlePaymentMethodChange("stripe")}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedMethod === "stripe"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === "stripe"
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === "stripe" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Кредитна/дебитна карта (Stripe)</span>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodChange("paypal")}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedMethod === "paypal"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === "paypal"
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === "paypal" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">PayPal (скоро)</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Неактивно
                  </span>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodChange("bank-transfer")}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedMethod === "bank-transfer"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === "bank-transfer"
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === "bank-transfer" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">Банков превод (скоро)</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Неактивно
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod === "stripe" && <StripeElementsPlaceholder />}

          {selectedMethod === "paypal" && (
            <div className="bg-gray-100 rounded-2xl p-6 text-center">
              <p className="text-gray-600">PayPal интеграцията ще бъде добавена скоро</p>
            </div>
          )}

          {selectedMethod === "bank-transfer" && (
            <div className="bg-gray-100 rounded-2xl p-6 text-center">
              <p className="text-gray-600">Банковият превод ще бъде добавен скоро</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}