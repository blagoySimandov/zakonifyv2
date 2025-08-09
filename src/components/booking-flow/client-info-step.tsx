"use client";

import { useState, useMemo } from "react";
import { User, Mail, MessageSquare, Shield } from "lucide-react";
import { ClientInfo, ValidationErrors } from "@/types/availability";
import { BOOKING_CONSTANTS } from "./constants";

interface ClientInfoStepProps {
  clientInfo: ClientInfo;
  onChange: (clientInfo: ClientInfo) => void;
  errors?: ValidationErrors;
}

function validateClientInfo(clientInfo: ClientInfo): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!clientInfo.fullName.trim()) {
    errors.fullName = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.FULL_NAME_REQUIRED];
  }
  
  if (!clientInfo.email.trim()) {
    errors.email = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.EMAIL_REQUIRED];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
    errors.email = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.EMAIL_INVALID];
  }
  
  if (clientInfo.phone && !/^[\+]?[1-9]?[\d\s\-\(\)]{10,}$/.test(clientInfo.phone.replace(/\s/g, ''))) {
    errors.phone = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.PHONE_INVALID];
  }
  
  if (!clientInfo.consultationTopic.trim()) {
    errors.consultationTopic = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.CONSULTATION_TOPIC_REQUIRED];
  }
  
  if (!clientInfo.privacyConsent) {
    errors.privacyConsent = [BOOKING_CONSTANTS.CLIENT_INFO_STEP.VALIDATION.PRIVACY_CONSENT_REQUIRED];
  }
  
  return errors;
}

export function ClientInfoStep({ clientInfo, onChange, errors: externalErrors }: ClientInfoStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const errors = useMemo(() => {
    return externalErrors || validateClientInfo(clientInfo);
  }, [clientInfo, externalErrors]);

  function updateField<K extends keyof ClientInfo>(field: K, value: ClientInfo[K]) {
    onChange({
      ...clientInfo,
      [field]: value,
    });
    setTouched({ ...touched, [field]: true });
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {BOOKING_CONSTANTS.CLIENT_INFO_STEP.TITLE}
        </h2>
        <p className="text-gray-600">
          {BOOKING_CONSTANTS.CLIENT_INFO_STEP.SUBTITLE}
        </p>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            {BOOKING_CONSTANTS.CLIENT_INFO_STEP.PERSONAL_INFO}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.FULL_NAME} *
              </label>
              <input
                type="text"
                value={clientInfo.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                onBlur={() => setTouched({ ...touched, fullName: true })}
                className={getFieldInputClasses('fullName')}
                placeholder="John Doe"
              />
              {getFieldError('fullName') && (
                <p className="text-red-600 text-sm mt-1">{getFieldError('fullName')}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.COMPANY}
              </label>
              <input
                type="text"
                value={clientInfo.company || ''}
                onChange={(e) => updateField('company', e.target.value)}
                className={getFieldInputClasses('company')}
                placeholder="Company Name Inc."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            {BOOKING_CONSTANTS.CLIENT_INFO_STEP.CONTACT_INFO}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.EMAIL} *
              </label>
              <input
                type="email"
                value={clientInfo.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={getFieldInputClasses('email')}
                placeholder="john@example.com"
              />
              {getFieldError('email') && (
                <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.PHONE}
              </label>
              <input
                type="tel"
                value={clientInfo.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                onBlur={() => setTouched({ ...touched, phone: true })}
                className={getFieldInputClasses('phone')}
                placeholder="+1 (555) 123-4567"
              />
              {getFieldError('phone') && (
                <p className="text-red-600 text-sm mt-1">{getFieldError('phone')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Consultation Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            {BOOKING_CONSTANTS.CLIENT_INFO_STEP.CONSULTATION_DETAILS}
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.CONSULTATION_TOPIC} *
              </label>
              <div className="relative">
                <select
                  value={clientInfo.consultationTopic}
                  onChange={(e) => updateField('consultationTopic', e.target.value)}
                  onBlur={() => setTouched({ ...touched, consultationTopic: true })}
                  className={getFieldInputClasses('consultationTopic')}
                >
                  <option value="">{BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.CONSULTATION_TOPIC_PLACEHOLDER}</option>
                  {BOOKING_CONSTANTS.CONSULTATION_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              {getFieldError('consultationTopic') && (
                <p className="text-red-600 text-sm mt-1">{getFieldError('consultationTopic')}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.ADDITIONAL_NOTES}
              </label>
              <textarea
                value={clientInfo.additionalNotes || ''}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                rows={4}
                className={getFieldInputClasses('additionalNotes')}
                placeholder={BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.ADDITIONAL_NOTES_PLACEHOLDER}
              />
            </div>
          </div>
        </div>

        {/* Consent and Privacy */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Privacy & Consent
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={clientInfo.privacyConsent}
                  onChange={(e) => updateField('privacyConsent', e.target.checked)}
                  onBlur={() => setTouched({ ...touched, privacyConsent: true })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <div className="text-sm">
                <label className="text-gray-700 font-medium">
                  {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.PRIVACY_CONSENT} *
                </label>
                {getFieldError('privacyConsent') && (
                  <p className="text-red-600 mt-1">{getFieldError('privacyConsent')}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={clientInfo.marketingConsent}
                  onChange={(e) => updateField('marketingConsent', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <div className="text-sm">
                <label className="text-gray-700">
                  {BOOKING_CONSTANTS.CLIENT_INFO_STEP.FIELDS.MARKETING_CONSENT}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}