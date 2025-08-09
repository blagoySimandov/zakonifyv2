"use client";

import { useState, useMemo } from "react";
import { CreditCard, DollarSign, Shield, Building2, MapPin, CheckCircle } from "lucide-react";
import { PaymentInfo, ValidationErrors, AvailableSlot, ConsultationType } from "@/types/availability";
import { BOOKING_CONSTANTS } from "./constants";

interface PaymentStepProps {
  selectedSlot: AvailableSlot;
  consultationType: ConsultationType;
  duration: number;
  paymentInfo: PaymentInfo;
  onChange: (paymentInfo: PaymentInfo) => void;
  errors?: ValidationErrors;
}

function validatePaymentInfo(paymentInfo: PaymentInfo): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (paymentInfo.paymentMethod === 'credit-card') {
    if (!paymentInfo.cardNumber?.trim()) {
      errors.cardNumber = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.CARD_NUMBER_REQUIRED];
    } else if (!/^[\d\s]{13,19}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.CARD_NUMBER_INVALID];
    }
    
    if (!paymentInfo.expiryDate?.trim()) {
      errors.expiryDate = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.EXPIRY_REQUIRED];
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.expiryDate = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.EXPIRY_INVALID];
    }
    
    if (!paymentInfo.cvc?.trim()) {
      errors.cvc = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.CVC_REQUIRED];
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvc)) {
      errors.cvc = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.CVC_INVALID];
    }
    
    if (!paymentInfo.cardholderName?.trim()) {
      errors.cardholderName = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.CARDHOLDER_NAME_REQUIRED];
    }
    
    if (paymentInfo.billingAddress) {
      if (!paymentInfo.billingAddress.street?.trim()) {
        errors.billingStreet = [BOOKING_CONSTANTS.PAYMENT_STEP.VALIDATION.BILLING_ADDRESS_REQUIRED];
      }
    }
  }
  
  return errors;
}

export function PaymentStep({ selectedSlot, duration, paymentInfo, onChange, errors: externalErrors }: PaymentStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const errors = useMemo(() => {
    return externalErrors || validatePaymentInfo(paymentInfo);
  }, [paymentInfo, externalErrors]);

  function updateField<K extends keyof PaymentInfo>(field: K, value: PaymentInfo[K]) {
    onChange({
      ...paymentInfo,
      [field]: value,
    });
    setTouched({ ...touched, [field]: true });
  }

  function updateBillingAddress(field: string, value: string) {
    onChange({
      ...paymentInfo,
      billingAddress: {
        ...paymentInfo.billingAddress,
        [field]: value,
      },
    });
    setTouched({ ...touched, [`billing${field.charAt(0).toUpperCase() + field.slice(1)}`]: true });
  }

  function getFieldError(field: string) {
    return touched[field] && errors[field] ? errors[field][0] : undefined;
  }

  function getFieldInputClasses(field: string) {
    const hasError = touched[field] && errors[field];
    return `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`;
  }

  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  }

  function formatExpiryDate(value: string) {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  }

  const processingFee = Math.round(selectedSlot.price * 0.029 * 100) / 100; // 2.9% processing fee
  const tax = Math.round(selectedSlot.price * 0.08 * 100) / 100; // 8% tax example
  const totalAmount = selectedSlot.price + processingFee + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_CONSTANTS.PAYMENT_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_CONSTANTS.PAYMENT_STEP.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultation Summary */}
        <div className="lg:order-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {BOOKING_CONSTANTS.PAYMENT_STEP.CONSULTATION_SUMMARY}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Consultation ({duration} min)</span>
                <span className="font-medium">${selectedSlot.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.PROCESSING_FEE}</span>
                <span className="font-medium">${processingFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.TAX}</span>
                <span className="font-medium">${tax}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>{BOOKING_CONSTANTS.PAYMENT_STEP.PRICING.TOTAL}</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_SECURITY}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="space-y-8">
            {/* Payment Method Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                {BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHOD}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('paymentMethod', 'credit-card')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentInfo.paymentMethod === 'credit-card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.CREDIT_CARD}
                  </span>
                  {paymentInfo.paymentMethod === 'credit-card' && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => updateField('paymentMethod', 'paypal')}
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
                    {BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.PAYPAL}
                  </span>
                  {paymentInfo.paymentMethod === 'paypal' && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => updateField('paymentMethod', 'bank-transfer')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentInfo.paymentMethod === 'bank-transfer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {BOOKING_CONSTANTS.PAYMENT_STEP.PAYMENT_METHODS.BANK_TRANSFER}
                  </span>
                  {paymentInfo.paymentMethod === 'bank-transfer' && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentInfo.paymentMethod === 'credit-card' && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Card Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.CARD_NUMBER} *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber || ''}
                        onChange={(e) => updateField('cardNumber', formatCardNumber(e.target.value))}
                        onBlur={() => setTouched({ ...touched, cardNumber: true })}
                        className={getFieldInputClasses('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {getFieldError('cardNumber') && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('cardNumber')}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.EXPIRY_DATE} *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate || ''}
                          onChange={(e) => updateField('expiryDate', formatExpiryDate(e.target.value))}
                          onBlur={() => setTouched({ ...touched, expiryDate: true })}
                          className={getFieldInputClasses('expiryDate')}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {getFieldError('expiryDate') && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('expiryDate')}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.CVC} *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvc || ''}
                          onChange={(e) => updateField('cvc', e.target.value.replace(/\D/g, ''))}
                          onBlur={() => setTouched({ ...touched, cvc: true })}
                          className={getFieldInputClasses('cvc')}
                          placeholder="123"
                          maxLength={4}
                        />
                        {getFieldError('cvc') && (
                          <p className="text-red-600 text-sm mt-1">{getFieldError('cvc')}</p>
                        )}
                      </div>
                      
                      <div className="col-span-1"></div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.CARDHOLDER_NAME} *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardholderName || ''}
                        onChange={(e) => updateField('cardholderName', e.target.value)}
                        onBlur={() => setTouched({ ...touched, cardholderName: true })}
                        className={getFieldInputClasses('cardholderName')}
                        placeholder="John Doe"
                      />
                      {getFieldError('cardholderName') && (
                        <p className="text-red-600 text-sm mt-1">{getFieldError('cardholderName')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {BOOKING_CONSTANTS.PAYMENT_STEP.BILLING_ADDRESS}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.BILLING_ADDRESS}
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.billingAddress?.street || ''}
                        onChange={(e) => updateBillingAddress('street', e.target.value)}
                        className={getFieldInputClasses('billingStreet')}
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.CITY}
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.billingAddress?.city || ''}
                          onChange={(e) => updateBillingAddress('city', e.target.value)}
                          className={getFieldInputClasses('billingCity')}
                          placeholder="New York"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.STATE}
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.billingAddress?.state || ''}
                          onChange={(e) => updateBillingAddress('state', e.target.value)}
                          className={getFieldInputClasses('billingState')}
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.ZIP_CODE}
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.billingAddress?.zipCode || ''}
                          onChange={(e) => updateBillingAddress('zipCode', e.target.value)}
                          className={getFieldInputClasses('billingZipCode')}
                          placeholder="10001"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {BOOKING_CONSTANTS.PAYMENT_STEP.FIELDS.COUNTRY}
                        </label>
                        <select
                          value={paymentInfo.billingAddress?.country || 'US'}
                          onChange={(e) => updateBillingAddress('country', e.target.value)}
                          className={getFieldInputClasses('billingCountry')}
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* PayPal */}
            {paymentInfo.paymentMethod === 'paypal' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                      PP
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal Payment</h3>
                  <p className="text-gray-600">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentInfo.paymentMethod === 'bank-transfer' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Transfer Payment</h3>
                  <p className="text-gray-600 mb-4">
                    You will receive bank transfer instructions after booking confirmation.
                  </p>
                  <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                    Note: Your consultation will be confirmed once payment is received (usually 1-2 business days).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}