"use client";

import { useCallback } from "react";
import { CreditCard, Building2, CheckCircle } from "lucide-react";
import { PaymentInfo } from "@/types/availability";
import { BOOKING_MESSAGES } from "./messages";

interface PaymentMethodSelectorProps {
  paymentInfo: PaymentInfo;
  onPaymentMethodChange: (method: PaymentInfo['paymentMethod']) => void;
}

export function PaymentMethodSelector({
  paymentInfo,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) {
  const handleMethodSelect = useCallback((method: PaymentInfo['paymentMethod']) => {
    onPaymentMethodChange(method);
  }, [onPaymentMethodChange]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        {BOOKING_MESSAGES.PAYMENT_STEP.PAYMENT_METHOD}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleMethodSelect('credit-card')}
          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
            paymentInfo.paymentMethod === 'credit-card'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-sm font-medium">
            {BOOKING_MESSAGES.PAYMENT_STEP.PAYMENT_METHODS.CREDIT_CARD}
          </span>
          {paymentInfo.paymentMethod === 'credit-card' && (
            <CheckCircle className="w-4 h-4 text-blue-600" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => handleMethodSelect('paypal')}
          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
            paymentInfo.paymentMethod === 'paypal'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            PP
          </div>
          <span className="text-sm font-medium">
            {BOOKING_MESSAGES.PAYMENT_STEP.PAYMENT_METHODS.PAYPAL}
          </span>
          {paymentInfo.paymentMethod === 'paypal' && (
            <CheckCircle className="w-4 h-4 text-blue-600" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => handleMethodSelect('bank-transfer')}
          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
            paymentInfo.paymentMethod === 'bank-transfer'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Building2 className="w-6 h-6" />
          <span className="text-sm font-medium">
            {BOOKING_MESSAGES.PAYMENT_STEP.PAYMENT_METHODS.BANK_TRANSFER}
          </span>
          {paymentInfo.paymentMethod === 'bank-transfer' && (
            <CheckCircle className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>
    </div>
  );
}
