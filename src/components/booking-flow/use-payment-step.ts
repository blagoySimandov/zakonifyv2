"use client";

import { useState, useMemo, useCallback } from "react";
import { PaymentInfo, ValidationErrors } from "@/types/availability";
import { validatePaymentInfo } from "./utils";

interface UsePaymentStepProps {
  paymentInfo: PaymentInfo;
  onChange: (paymentInfo: PaymentInfo) => void;
  errors?: ValidationErrors;
}

export function usePaymentStep({ paymentInfo, onChange, errors: externalErrors }: UsePaymentStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const errors = useMemo(() => {
    return externalErrors || validatePaymentInfo(paymentInfo);
  }, [paymentInfo, externalErrors]);

  const updateField = useCallback(<K extends keyof PaymentInfo>(field: K, value: PaymentInfo[K]) => {
    onChange({
      ...paymentInfo,
      [field]: value,
    });
    setTouched(prev => ({ ...prev, [field]: true }));
  }, [paymentInfo, onChange]);

  const updateBillingAddress = useCallback((field: string, value: string) => {
    onChange({
      ...paymentInfo,
      billingAddress: {
        ...paymentInfo.billingAddress,
        [field]: value,
      },
    });
    setTouched(prev => ({ 
      ...prev, 
      [`billing${field.charAt(0).toUpperCase() + field.slice(1)}`]: true 
    }));
  }, [paymentInfo, onChange]);

  const handleFieldBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const getFieldError = useCallback((field: string) => {
    return touched[field] && errors[field] ? errors[field][0] : undefined;
  }, [touched, errors]);

  const getFieldInputClasses = useCallback((field: string) => {
    const hasError = touched[field] && errors[field];
    return `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`;
  }, [touched, errors]);

  return {
    errors,
    touched,
    updateField,
    updateBillingAddress,
    handleFieldBlur,
    getFieldError,
    getFieldInputClasses,
  };
}
