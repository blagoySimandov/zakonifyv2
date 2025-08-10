"use client";

import { DollarSign, Shield } from "lucide-react";
import { BOOKING_MESSAGES } from "./messages";
import { calculatePricing } from "./utils";

interface ConsultationSummaryProps {
  price: number;
  duration: number;
}

export function ConsultationSummary({ price, duration }: ConsultationSummaryProps) {
  const { processingFee, tax, totalAmount } = calculatePricing(price);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        {BOOKING_MESSAGES.PAYMENT_STEP.CONSULTATION_SUMMARY}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Consultation ({duration} min)</span>
          <span className="font-medium">${price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{BOOKING_MESSAGES.PAYMENT_STEP.PRICING.PROCESSING_FEE}</span>
          <span className="font-medium">${processingFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{BOOKING_MESSAGES.PAYMENT_STEP.PRICING.TAX}</span>
          <span className="font-medium">${tax}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-base font-bold">
            <span>{BOOKING_MESSAGES.PAYMENT_STEP.PRICING.TOTAL}</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {BOOKING_MESSAGES.PAYMENT_STEP.PAYMENT_SECURITY}
        </p>
      </div>
    </div>
  );
}
