"use client";

import {
  AvailableSlot,
  ConsultationType,
  PaymentInfo,
  ValidationErrors,
} from "@/types/availability";
import { BOOKING_MESSAGES } from "./messages";
import { ConsultationSummary } from "./consultation-summary";
import { PaymentMethodSelector } from "./payment-method-selector";
import { CreditCardForm } from "./credit-card-form";
import { BillingAddressForm } from "./billing-address-form";
import {
  PayPalPayment,
  BankTransferPayment,
} from "./alternative-payment-methods";
import { usePaymentStep } from "./use-payment-step";

interface PaymentStepProps {
  selectedSlot: AvailableSlot;
  consultationType: ConsultationType;
  duration: number;
  paymentInfo: PaymentInfo;
  onChange: (paymentInfo: PaymentInfo) => void;
  errors?: ValidationErrors;
}

export function PaymentStep({
  selectedSlot,
  duration,
  paymentInfo,
  onChange,
  errors: externalErrors,
}: PaymentStepProps) {
  const {
    errors,
    touched,
    updateField,
    updateBillingAddress,
    handleFieldBlur,
  } = usePaymentStep({ paymentInfo, onChange, errors: externalErrors });

  const handlePaymentMethodChange = (method: PaymentInfo["paymentMethod"]) => {
    updateField("paymentMethod", method);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_MESSAGES.PAYMENT_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_MESSAGES.PAYMENT_STEP.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:order-2">
          <ConsultationSummary price={selectedSlot.price} duration={duration} />
        </div>

        <div className="lg:col-span-2 lg:order-1">
          <div className="space-y-8">
            <PaymentMethodSelector
              paymentInfo={paymentInfo}
              onPaymentMethodChange={handlePaymentMethodChange}
            />

            {paymentInfo.paymentMethod === "credit-card" && (
              <>
                <CreditCardForm
                  paymentInfo={paymentInfo}
                  errors={errors}
                  touched={touched}
                  onFieldChange={updateField}
                  onFieldBlur={handleFieldBlur}
                />

                <BillingAddressForm
                  paymentInfo={paymentInfo}
                  errors={errors}
                  touched={touched}
                  onBillingAddressChange={updateBillingAddress}
                  onFieldBlur={handleFieldBlur}
                />
              </>
            )}

            {paymentInfo.paymentMethod === "paypal" && <PayPalPayment />}

            {paymentInfo.paymentMethod === "bank-transfer" && (
              <BankTransferPayment />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
