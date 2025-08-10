"use client";

import { Building2 } from "lucide-react";
import { BOOKING_MESSAGES } from "./messages";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PayPalPaymentProps {}

export function PayPalPayment({}: PayPalPaymentProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
            PP
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {BOOKING_MESSAGES.PAYMENT_STEP.PAYPAL.TITLE}
        </h3>
        <p className="text-gray-600">
          {BOOKING_MESSAGES.PAYMENT_STEP.PAYPAL.DESCRIPTION}
        </p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BankTransferPaymentProps {}

export function BankTransferPayment({}: BankTransferPaymentProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {BOOKING_MESSAGES.PAYMENT_STEP.BANK_TRANSFER.TITLE}
        </h3>
        <p className="text-gray-600 mb-4">
          {BOOKING_MESSAGES.PAYMENT_STEP.BANK_TRANSFER.DESCRIPTION}
        </p>
        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
          {BOOKING_MESSAGES.PAYMENT_STEP.BANK_TRANSFER.NOTE}
        </div>
      </div>
    </div>
  );
}
