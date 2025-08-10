"use client";

import {
  Calendar,
  Clock,
  User,
  CreditCard,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  ClientInfo,
  PaymentInfo,
  AvailableSlot,
  ConsultationType,
} from "@/types/availability";
import { Id } from "../../../convex/_generated/dataModel";
import { BOOKING_CONSTANTS } from "./constants";

interface ConfirmationStepProps {
  attorneyId: Id<"attorneys">;
  consultationType: ConsultationType;
  duration: number;
  selectedSlot: AvailableSlot;
  clientInfo: ClientInfo;
  paymentInfo: PaymentInfo;
}

export function ConfirmationStep({
  consultationType,
  duration,
  selectedSlot,
  clientInfo,
  paymentInfo,
}: ConfirmationStepProps) {
  const processingFee = Math.round(selectedSlot.price * 0.029 * 100) / 100;
  const tax = Math.round(selectedSlot.price * 0.08 * 100) / 100;
  const totalAmount = selectedSlot.price + processingFee + tax;

  function getPaymentMethodDisplay(method: string) {
    switch (method) {
      case "credit-card":
        return BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.CREDIT_CARD;
      case "paypal":
        return BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.PAYPAL;
      case "bank-transfer":
        return BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.BANK_TRANSFER;
      default:
        return method;
    }
  }

  function getConsultationTypeDisplay(type: ConsultationType) {
    const typeConfig = BOOKING_CONSTANTS.CONSULTATION_TYPE_STEP.TYPES[type];
    return typeConfig?.title || type;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_CONSTANTS.CONFIRMATION_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_CONSTANTS.CONFIRMATION_STEP.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Consultation Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {BOOKING_CONSTANTS.CONFIRMATION_STEP.CONSULTATION_DETAILS}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSlot.startTime).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedSlot.startTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {duration} minutes
                  </p>
                  <p className="text-sm text-gray-600">
                    {getConsultationTypeDisplay(consultationType)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {BOOKING_CONSTANTS.CONFIRMATION_STEP.CLIENT_INFORMATION}
            </h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {clientInfo.fullName}
                </p>
                {clientInfo.company && (
                  <p className="text-sm text-gray-600">{clientInfo.company}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">{clientInfo.email}</p>
                <p className="text-sm text-gray-600">{clientInfo.phone}</p>
              </div>
              {clientInfo.consultationTopic && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Topic: {clientInfo.consultationTopic}
                  </p>
                  {clientInfo.additionalNotes && (
                    <p className="text-sm text-gray-600">
                      {clientInfo.additionalNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              {BOOKING_CONSTANTS.CONFIRMATION_STEP.PAYMENT_INFORMATION}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">
                  {getPaymentMethodDisplay(paymentInfo.paymentMethod)}
                </p>
                {paymentInfo.paymentMethod === "credit-card" &&
                  paymentInfo.cardNumber && (
                    <p className="text-sm text-gray-600">
                      **** **** **** {paymentInfo.cardNumber.slice(-4)}
                    </p>
                  )}
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.CONSULTATION_FEE}
                    </span>
                    <span className="font-medium">${selectedSlot.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.PROCESSING_FEE}
                    </span>
                    <span className="font-medium">${processingFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.TAX}
                    </span>
                    <span className="font-medium">${tax}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span>
                        {BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.TOTAL}
                      </span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Policies */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {BOOKING_CONSTANTS.CONFIRMATION_STEP.TERMS_AND_CONDITIONS}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    {BOOKING_CONSTANTS.CONFIRMATION_STEP.TERMS_TEXT}{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {BOOKING_CONSTANTS.CONFIRMATION_STEP.TERMS_LINK}
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {BOOKING_CONSTANTS.CONFIRMATION_STEP.PRIVACY_LINK}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Cancellation Policy
                  </p>
                  <p className="text-sm text-gray-700">
                    {BOOKING_CONSTANTS.CONFIRMATION_STEP.CANCELLATION_POLICY}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Before your consultation
                </p>
                <p className="text-sm text-blue-700">
                  Please prepare any relevant documents and questions.
                  You&apos;ll receive a confirmation email with joining
                  instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
