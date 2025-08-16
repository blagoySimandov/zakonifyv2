"use client";

import { useState, useEffect } from "react";
import { AttorneyRegistrationFormData } from "./validation";
import { REGISTRATION_CONSTANTS } from "./constants";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui";

interface PersonalInfoStepProps {
  formData: Partial<AttorneyRegistrationFormData>;
  errors: Record<string, string[]>;
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void;
}

export function PersonalInfoStep({
  formData,
  errors,
  updateFormData,
}: PersonalInfoStepProps) {
  const [emailCheckTimeout, setEmailCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const emailExists = useQuery(
    api.attorneys.checkEmailExists,
    formData.email && formData.email.includes("@") && isCheckingEmail
      ? { email: formData.email }
      : "skip"
  );

  const handleEmailChange = (email: string) => {
    updateFormData({ email });
    setEmailTaken(false);
    setIsCheckingEmail(false);

    // Clear existing timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    // Set new timeout to check email after user stops typing
    if (email.length > 0 && email.includes("@")) {
      const timeout = setTimeout(() => {
        setIsCheckingEmail(true);
      }, 500); // Check after 500ms of no typing

      setEmailCheckTimeout(timeout);
    }
  };

  // Handle email check result
  useEffect(() => {
    if (emailExists !== undefined && isCheckingEmail) {
      setEmailTaken(Boolean(emailExists));
      setIsCheckingEmail(false);
    }
  }, [emailExists, isCheckingEmail]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.personal}
        </h2>
        <p className="text-gray-600">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.personal}
        </p>
      </div>

      <div className="space-y-6">
        <Input
          type="text"
          autoComplete="name"
          name="fullName"
          id="fullName"
          label={REGISTRATION_CONSTANTS.LABELS.FULL_NAME}
          required
          value={formData.fullName || ""}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.FULL_NAME}
          error={errors.fullName?.[0]}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.EMAIL} *
          </label>
          <div className="relative">
            <input
              type="email"
              autoComplete="email"
              name="email"
              id="email"
              aria-label="Email address"
              aria-describedby={errors.email ? "email-error" : "email-help"}
              value={formData.email || ""}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.EMAIL}
              className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.email || emailTaken
                  ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                  : "border-gray-200 hover:border-gray-300 focus:bg-white"
              }`}
            />
            {isCheckingEmail && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!isCheckingEmail &&
              !emailTaken &&
              formData.email &&
              formData.email.includes("@") &&
              !errors.email && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                </div>
              )}
          </div>

          {errors.email && (
            <p
              id="email-error"
              className="text-danger-500 text-sm mt-2 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email[0]}
            </p>
          )}

          {emailTaken && !errors.email && (
            <p
              id="email-error"
              className="text-danger-500 text-sm mt-2 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Този имейл вече е регистриран
            </p>
          )}

          {!emailTaken &&
            formData.email &&
            formData.email.includes("@") &&
            !isCheckingEmail &&
            !errors.email && (
              <p className="text-success-500 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Имейлът е свободен
              </p>
            )}

          <p id="email-help" className="text-gray-500 text-sm mt-2">
            Това ще бъде вашият имейл за вход и как клиентите ще се свързват с
            вас
          </p>
        </div>
      </div>
    </div>
  );
}
