"use client";

import { useCallback } from "react";
import { PaymentInfo, ValidationErrors } from "@/types/availability";
import { BOOKING_MESSAGES } from "./messages";
import { formatCardNumber, formatExpiryDate } from "./utils";

interface CreditCardFormProps {
  paymentInfo: PaymentInfo;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  onFieldChange: <K extends keyof PaymentInfo>(
    field: K,
    value: PaymentInfo[K],
  ) => void;
  onFieldBlur: (field: string) => void;
}

export function CreditCardForm({
  paymentInfo,
  errors,
  touched,
  onFieldChange,
  onFieldBlur,
}: CreditCardFormProps) {
  const getFieldError = useCallback(
    (field: string) => {
      return touched[field] && errors[field] ? errors[field][0] : undefined;
    },
    [touched, errors],
  );

  const getFieldInputClasses = useCallback(
    (field: string) => {
      const hasError = touched[field] && errors[field];
      return `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        hasError
          ? "border-red-300 bg-red-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`;
    },
    [touched, errors],
  );

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("cardNumber", formatCardNumber(e.target.value));
    },
    [onFieldChange],
  );

  const handleExpiryDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("expiryDate", formatExpiryDate(e.target.value));
    },
    [onFieldChange],
  );

  const handleCvcChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("cvc", e.target.value.replace(/\D/g, ""));
    },
    [onFieldChange],
  );

  const handleCardholderNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("cardholderName", e.target.value);
    },
    [onFieldChange],
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Card Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.CARD_NUMBER} *
          </label>
          <input
            type="text"
            value={paymentInfo.cardNumber || ""}
            onChange={handleCardNumberChange}
            onBlur={() => onFieldBlur("cardNumber")}
            className={getFieldInputClasses("cardNumber")}
            placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.CARD_NUMBER}
            maxLength={19}
          />
          {getFieldError("cardNumber") && (
            <p className="text-red-600 text-sm mt-1">
              {getFieldError("cardNumber")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.EXPIRY_DATE} *
            </label>
            <input
              type="text"
              value={paymentInfo.expiryDate || ""}
              onChange={handleExpiryDateChange}
              onBlur={() => onFieldBlur("expiryDate")}
              className={getFieldInputClasses("expiryDate")}
              placeholder={
                BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.EXPIRY_DATE
              }
              maxLength={5}
            />
            {getFieldError("expiryDate") && (
              <p className="text-red-600 text-sm mt-1">
                {getFieldError("expiryDate")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.CVC} *
            </label>
            <input
              type="text"
              value={paymentInfo.cvc || ""}
              onChange={handleCvcChange}
              onBlur={() => onFieldBlur("cvc")}
              className={getFieldInputClasses("cvc")}
              placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.CVC}
              maxLength={4}
            />
            {getFieldError("cvc") && (
              <p className="text-red-600 text-sm mt-1">
                {getFieldError("cvc")}
              </p>
            )}
          </div>

          <div className="col-span-1"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.CARDHOLDER_NAME} *
          </label>
          <input
            type="text"
            value={paymentInfo.cardholderName || ""}
            onChange={handleCardholderNameChange}
            onBlur={() => onFieldBlur("cardholderName")}
            className={getFieldInputClasses("cardholderName")}
            placeholder={
              BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.CARDHOLDER_NAME
            }
          />
          {getFieldError("cardholderName") && (
            <p className="text-red-600 text-sm mt-1">
              {getFieldError("cardholderName")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
