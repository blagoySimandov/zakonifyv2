"use client";

import { useState } from "react";
import { useAttorneyRegistration } from "./hooks";
import { REGISTRATION_CONSTANTS } from "./constants";
import { REGISTRATION_MESSAGES } from "./messages";
import { PersonalInfoStep } from "./personal-info-step";
import { ProfessionalInfoStep } from "./professional-info-step";
import { PracticeLocationStep } from "./practice-location-step";
import { PricingStep } from "./pricing-step";
import { CheckCircle, AlertCircle, Scale } from "lucide-react";

export function AttorneyRegistration() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isFirstStep,
    isLastStep,
    steps,
    getStepProgress,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    submitRegistration,
    addFixedFeePackage,
    removeFixedFeePackage,
    updateFixedFeePackage,
  } = useAttorneyRegistration();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const progress = getStepProgress();

  const handleSubmit = async () => {
    const success = await submitRegistration();
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {REGISTRATION_MESSAGES.SUCCESS.SUBMITTED}
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {REGISTRATION_MESSAGES.INFO.VERIFICATION_PENDING}
            </p>
            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-blue-700 font-medium">
                Ще ви изпратим имейл потвърждение и актуализации относно статуса на верификацията.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Присъединете се към Zakonify
          </h1>
          <p className="text-gray-600 text-lg">
            Създайте вашия адвокатски профил за няколко лесни стъпки
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>
              {REGISTRATION_MESSAGES.INFO.STEP_PROGRESS.replace(
                "{current}",
                progress.current.toString()
              ).replace("{total}", progress.total.toString())}
            </span>
            <span className="font-medium">{Math.round(progress.percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    index < progress.current - 1
                      ? "bg-green-500 text-white"
                      : index === progress.current - 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 text-center max-w-20 ${
                  index === progress.current - 1 ? "text-blue-600 font-medium" : "text-gray-400"
                }`}>
                  {REGISTRATION_CONSTANTS.STEP_TITLES[step]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* General Error Display */}
        {errors._general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{errors._general[0]}</p>
            </div>
          </div>
        )}

        {/* Form Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          {currentStep === "personal" && (
            <PersonalInfoStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === "professional" && (
            <ProfessionalInfoStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === "practiceAndLocation" && (
            <PracticeLocationStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === "pricing" && (
            <PricingStep
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              addFixedFeePackage={addFixedFeePackage}
              removeFixedFeePackage={removeFixedFeePackage}
              updateFixedFeePackage={updateFixedFeePackage}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {!isFirstStep ? (
            <button
              onClick={goToPreviousStep}
              className="inline-flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {REGISTRATION_CONSTANTS.BUTTONS.PREVIOUS}
            </button>
          ) : (
            <div></div>
          )}

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`inline-flex items-center px-8 py-3 rounded-xl font-medium transition-all ${
                isSubmitting
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Изпраща се..." : REGISTRATION_CONSTANTS.BUTTONS.SUBMIT}
            </button>
          ) : (
            <button
              onClick={goToNextStep}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              {REGISTRATION_CONSTANTS.BUTTONS.NEXT}
            </button>
          )}
        </div>

        {/* Required Fields Notice */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {REGISTRATION_MESSAGES.INFO.REQUIRED_FIELDS}
        </p>
      </div>
    </div>
  );
}
