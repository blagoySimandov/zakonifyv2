import { PaymentInfo, ValidationErrors } from "@/types/availability";
import { BOOKING_MESSAGES } from "./messages";

export function validatePaymentInfo(
  paymentInfo: PaymentInfo,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (paymentInfo.paymentMethod === "credit-card") {
    if (!paymentInfo.cardNumber?.trim()) {
      errors.cardNumber = [
        BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.CARD_NUMBER_REQUIRED,
      ];
    } else if (
      !/^[\d\s]{13,19}$/.test(paymentInfo.cardNumber.replace(/\s/g, ""))
    ) {
      errors.cardNumber = [
        BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.CARD_NUMBER_INVALID,
      ];
    }

    if (!paymentInfo.expiryDate?.trim()) {
      errors.expiryDate = [
        BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.EXPIRY_REQUIRED,
      ];
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.expiryDate = [
        BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.EXPIRY_INVALID,
      ];
    }

    if (!paymentInfo.cvc?.trim()) {
      errors.cvc = [BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.CVC_REQUIRED];
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvc)) {
      errors.cvc = [BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.CVC_INVALID];
    }

    if (!paymentInfo.cardholderName?.trim()) {
      errors.cardholderName = [
        BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.CARDHOLDER_NAME_REQUIRED,
      ];
    }

    if (paymentInfo.billingAddress) {
      if (!paymentInfo.billingAddress.street?.trim()) {
        errors.billingStreet = [
          BOOKING_MESSAGES.PAYMENT_STEP.VALIDATION.BILLING_ADDRESS_REQUIRED,
        ];
      }
    }
  }

  return errors;
}

export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  } else {
    return v;
  }
}

export function formatExpiryDate(value: string): string {
  const v = value.replace(/\D/g, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
  }
  return v;
}

export function calculatePricing(price: number) {
  const processingFee = Math.round(price * 0.029 * 100) / 100; // 2.9% processing fee
  const tax = Math.round(price * 0.08 * 100) / 100; // 8% tax example
  const totalAmount = price + processingFee + tax;

  return {
    processingFee,
    tax,
    totalAmount,
  };
}
