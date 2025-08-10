"use client";

import { useCallback } from "react";
import { MapPin } from "lucide-react";
import { PaymentInfo, ValidationErrors } from "@/types/availability";
import { BOOKING_MESSAGES } from "./messages";

interface BillingAddressFormProps {
  paymentInfo: PaymentInfo;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  onBillingAddressChange: (field: string, value: string) => void;
  onFieldBlur: (field: string) => void;
}

export function BillingAddressForm({
  paymentInfo,
  errors,
  touched,
  onBillingAddressChange,
  onFieldBlur,
}: BillingAddressFormProps) {
  const getFieldInputClasses = useCallback((field: string) => {
    const hasError = touched[field] && errors[field];
    return `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`;
  }, [touched, errors]);

  const handleStreetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBillingAddressChange('street', e.target.value);
  }, [onBillingAddressChange]);

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBillingAddressChange('city', e.target.value);
  }, [onBillingAddressChange]);

  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBillingAddressChange('state', e.target.value);
  }, [onBillingAddressChange]);

  const handleZipCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBillingAddressChange('zipCode', e.target.value);
  }, [onBillingAddressChange]);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onBillingAddressChange('country', e.target.value);
  }, [onBillingAddressChange]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        {BOOKING_MESSAGES.PAYMENT_STEP.BILLING_ADDRESS}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.BILLING_ADDRESS}
          </label>
          <input
            type="text"
            value={paymentInfo.billingAddress?.street || ''}
            onChange={handleStreetChange}
            onBlur={() => onFieldBlur('billingStreet')}
            className={getFieldInputClasses('billingStreet')}
            placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.STREET_ADDRESS}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.CITY}
            </label>
            <input
              type="text"
              value={paymentInfo.billingAddress?.city || ''}
              onChange={handleCityChange}
              onBlur={() => onFieldBlur('billingCity')}
              className={getFieldInputClasses('billingCity')}
              placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.CITY}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.STATE}
            </label>
            <input
              type="text"
              value={paymentInfo.billingAddress?.state || ''}
              onChange={handleStateChange}
              onBlur={() => onFieldBlur('billingState')}
              className={getFieldInputClasses('billingState')}
              placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.STATE}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.ZIP_CODE}
            </label>
            <input
              type="text"
              value={paymentInfo.billingAddress?.zipCode || ''}
              onChange={handleZipCodeChange}
              onBlur={() => onFieldBlur('billingZipCode')}
              className={getFieldInputClasses('billingZipCode')}
              placeholder={BOOKING_MESSAGES.PAYMENT_STEP.PLACEHOLDERS.ZIP_CODE}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {BOOKING_MESSAGES.PAYMENT_STEP.FIELDS.COUNTRY}
            </label>
            <select
              value={paymentInfo.billingAddress?.country || 'US'}
              onChange={handleCountryChange}
              onBlur={() => onFieldBlur('billingCountry')}
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
  );
}
