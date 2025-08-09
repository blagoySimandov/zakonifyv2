"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useBookingFlow } from "./hooks";
import { BOOKING_CONSTANTS } from "./constants";
import { StepIndicator } from "./step-indicator";
import { ConsultationTypeStep } from "./consultation-type-step";
import { AvailabilityStep } from "./availability-step";
import { ClientInfoStep } from "./client-info-step";
import { PaymentStep } from "./payment-step";
import { ConfirmationStep } from "./confirmation-step";
import { BookingSuccessModal } from "./booking-success-modal";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar,
  Loader
} from "lucide-react";

export type BookingStep = 'consultation-type' | 'availability' | 'client-info' | 'payment' | 'confirmation';

interface BookingFlowProps {
  attorneyId: Id<"attorneys">;
  initialStep?: BookingStep;
  onComplete?: (consultationId: string) => void;
  onCancel?: () => void;
}

export function BookingFlow({ 
  attorneyId, 
  initialStep = 'consultation-type',
  onComplete,
  onCancel 
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    consultationType,
    duration,
    selectedSlot,
    clientInfo,
    paymentInfo,
    isSubmitting,
    error,
    createdConsultationId,
    updateConsultationType,
    updateDuration,
    updateSelectedSlot,
    updateClientInfo,
    updatePaymentInfo,
    submitBooking,
    validateStep,
  } = useBookingFlow(attorneyId);

  const steps: { step: BookingStep; label: string; isCompleted: boolean }[] = [
    {
      step: 'consultation-type',
      label: BOOKING_CONSTANTS.STEPS.CONSULTATION_TYPE,
      isCompleted: !!consultationType && !!duration,
    },
    {
      step: 'availability',
      label: BOOKING_CONSTANTS.STEPS.AVAILABILITY,
      isCompleted: !!selectedSlot,
    },
    {
      step: 'client-info',
      label: BOOKING_CONSTANTS.STEPS.CLIENT_INFO,
      isCompleted: !!clientInfo?.fullName && !!clientInfo?.email,
    },
    {
      step: 'payment',
      label: BOOKING_CONSTANTS.STEPS.PAYMENT,
      isCompleted: !!paymentInfo?.paymentMethodId,
    },
    {
      step: 'confirmation',
      label: BOOKING_CONSTANTS.STEPS.CONFIRMATION,
      isCompleted: false,
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.step === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = async () => {
    // Validate current step
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    if (isLastStep) {
      // Submit booking
      try {
        await submitBooking();
        setShowSuccessModal(true);
      } catch {
        // Error handled by hook
      }
    } else {
      // Move to next step
      const nextStep = steps[currentStepIndex + 1].step;
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1].step;
      setCurrentStep(prevStep);
    }
  };

  const handleStepClick = (step: BookingStep) => {
    const stepIndex = steps.findIndex(s => s.step === step);
    const currentIndex = currentStepIndex;
    
    // Only allow going to previous steps or the next immediate step if current is completed
    if (stepIndex < currentIndex || (stepIndex === currentIndex + 1 && steps[currentIndex].isCompleted)) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'consultation-type':
        return (
          <ConsultationTypeStep
            attorneyId={attorneyId}
            consultationType={consultationType}
            duration={duration}
            onConsultationTypeChange={updateConsultationType}
            onDurationChange={updateDuration}
          />
        );
        
      case 'availability':
        return (
          <AvailabilityStep
            attorneyId={attorneyId}
            consultationType={consultationType}
            duration={duration}
            selectedSlot={selectedSlot}
            onSlotSelect={updateSelectedSlot}
          />
        );
        
      case 'client-info':
        return (
          <ClientInfoStep
            clientInfo={clientInfo}
            onChange={updateClientInfo}
          />
        );
        
      case 'payment':
        return (
          <PaymentStep
            selectedSlot={selectedSlot}
            paymentInfo={paymentInfo}
            onChange={updatePaymentInfo}
          />
        );
        
      case 'confirmation':
        return (
          <ConfirmationStep
            attorneyId={attorneyId}
            consultationType={consultationType}
            duration={duration}
            selectedSlot={selectedSlot}
            clientInfo={clientInfo}
            paymentInfo={paymentInfo}
          />
        );
        
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case 'confirmation':
        return BOOKING_CONSTANTS.ACTIONS.CONFIRM_BOOKING;
      case 'payment':
        return BOOKING_CONSTANTS.ACTIONS.PROCEED_TO_CONFIRMATION;
      default:
        return BOOKING_CONSTANTS.ACTIONS.CONTINUE;
    }
  };

  const canProceed = () => {
    const currentStepData = steps[currentStepIndex];
    return currentStepData.isCompleted;
  };

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            {BOOKING_CONSTANTS.TITLE}
          </h1>
          <p className="text-gray-600 mt-1">
            {BOOKING_CONSTANTS.SUBTITLE}
          </p>
        </div>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {BOOKING_CONSTANTS.ACTIONS.BACK}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              {BOOKING_CONSTANTS.ACTIONS.PROCESSING}
            </>
          ) : (
            <>
              {getNextButtonText()}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {renderFooter()}

      {/* Success Modal */}
      {showSuccessModal && createdConsultationId && (
        <BookingSuccessModal
          consultationId={createdConsultationId}
          onClose={() => {
            setShowSuccessModal(false);
            onComplete?.(createdConsultationId);
          }}
        />
      )}
    </div>
  );
}