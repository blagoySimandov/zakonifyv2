"use client";

import { useAttorneyRegistration } from "./hooks";
import { useRegistrationUI } from "./use-registration-ui";
import { REGISTRATION_MESSAGES } from "./messages";
import { PersonalInfoStep } from "./personal-info-step";
import { ProfessionalInfoStep } from "./professional-info-step";
import { PracticeLocationStep } from "./practice-location-step";
import { PricingStep } from "./pricing-step";
import { SuccessScreen } from "./success-screen";
import { RegistrationHeader } from "./registration-header";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { StepIndicator } from "./step-indicator";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Navigation } from "./navigation";

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

  const { isSubmitted, handleSubmissionSuccess } = useRegistrationUI();
  const progress = getStepProgress();

  const handleSubmit = async () => {
    const success = await submitRegistration();
    if (success) {
      handleSubmissionSuccess();
    }
  };

  if (isSubmitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <RegistrationHeader />
        
        <ProgressIndicator
          current={progress.current}
          total={progress.total}
          percentage={progress.percentage}
        />
        
        <StepIndicator steps={steps} currentStep={progress.current} />

        {errors._general && (
          <ErrorAlert message={errors._general[0]} className="mb-6" />
        )}

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

        <Navigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          onSubmit={handleSubmit}
        />

        <p className="text-center text-gray-500 text-sm mt-6">
          {REGISTRATION_MESSAGES.INFO.REQUIRED_FIELDS}
        </p>
      </div>
    </div>
  );
}
