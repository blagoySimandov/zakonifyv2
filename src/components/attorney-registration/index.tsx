"use client";

import { useState } from "react";
import { useAttorneyRegistration } from "./hooks";
import { REGISTRATION_CONSTANTS } from "./constants";
import { REGISTRATION_MESSAGES } from "./messages";
import { PersonalInfoStep } from "./personal-info-step";
import { ProfessionalInfoStep } from "./professional-info-step";
import { PracticeLocationStep } from "./practice-location-step";
import { PricingStep } from "./pricing-step";
import { CheckCircle, AlertCircle } from "lucide-react";

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
    goToStep,
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
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {REGISTRATION_MESSAGES.SUCCESS.SUBMITTED}
          </h2>
          <p className="text-green-700 mb-4">
            {REGISTRATION_MESSAGES.INFO.VERIFICATION_PENDING}
          </p>
          <p className="text-green-600 text-sm">
            We’ll send you an email confirmation and updates about your
            verification status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Join as an Attorney
        </h1>
        <p className="text-gray-500">
          Complete your registration to start connecting with clients
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {REGISTRATION_MESSAGES.INFO.STEP_PROGRESS.replace(
              "{current}",
              progress.current.toString()
            ).replace("{total}", progress.total.toString())}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress.percentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => goToStep(step)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === currentStep
                  ? "bg-blue-500 text-white"
                  : index < steps.indexOf(currentStep)
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {index + 1}. {REGISTRATION_CONSTANTS.STEP_TITLES[step]}
            </button>
          ))}
        </div>
      </div>

      {/* General Error Display */}
      {errors._general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">{errors._general[0]}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white border rounded-lg p-6 mb-6">
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstStep
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          {REGISTRATION_CONSTANTS.BUTTONS.PREVIOUS}
        </button>

        {isLastStep ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {isSubmitting
              ? "Submitting..."
              : REGISTRATION_CONSTANTS.BUTTONS.SUBMIT}
          </button>
        ) : (
          <button
            onClick={goToNextStep}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            {REGISTRATION_CONSTANTS.BUTTONS.NEXT}
          </button>
        )}
      </div>

      {/* Required Fields Notice */}
      <p className="text-center text-gray-400 text-sm mt-4">
        {REGISTRATION_MESSAGES.INFO.REQUIRED_FIELDS}
      </p>
    </div>
  );
}
