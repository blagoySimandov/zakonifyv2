"use client";

import { useState } from "react";
import { AttorneyRegistrationFormData } from "./validation";
import { REGISTRATION_CONSTANTS } from "./constants";
import { trpc } from "@/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

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

  const checkEmailQuery = trpc.attorneys.checkEmailExists.useQuery(
    { email: formData.email || "" },
    { enabled: false },
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
      setIsCheckingEmail(true);
      const timeout = setTimeout(() => {
        checkEmailQuery
          .refetch()
          .then((res) => {
            if (!res.error) {
              setEmailTaken(Boolean(res.data));
            } else {
              console.error("Email check failed:", res.error);
              setEmailTaken(false);
            }
          })
          .finally(() => setIsCheckingEmail(false));
      }, 500); // Check after 500ms of no typing

      setEmailCheckTimeout(timeout);
    }
  };

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
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.FULL_NAME} *
          </label>
          <input
            type="text"
            autoComplete="name"
            name="fullName"
            id="fullName"
            aria-label="Full legal name"
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            value={formData.fullName || ""}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.FULL_NAME}
            className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.fullName
                ? "border-red-300 bg-red-50 focus:ring-red-500"
                : "border-gray-200 hover:border-gray-300 focus:bg-white"
            }`}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-red-500 text-sm mt-2 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.fullName[0]}
            </p>
          )}
        </div>

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
              className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email || emailTaken
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 hover:border-gray-300 focus:bg-white"
              }`}
            />
            {isCheckingEmail && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!isCheckingEmail &&
              !emailTaken &&
              formData.email &&
              formData.email.includes("@") &&
              !errors.email && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
          </div>

          {errors.email && (
            <p
              id="email-error"
              className="text-red-500 text-sm mt-2 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email[0]}
            </p>
          )}

          {emailTaken && !errors.email && (
            <p
              id="email-error"
              className="text-red-500 text-sm mt-2 flex items-center"
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
              <p className="text-green-500 text-sm mt-2 flex items-center">
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
