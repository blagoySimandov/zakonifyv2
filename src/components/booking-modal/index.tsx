"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { X, LogIn, Calendar, Clock, CreditCard, CheckCircle } from "lucide-react";
import { ConsultationTypeSelection } from "./consultation-type-selection";
import { SlotSelection } from "./slot-selection";
import { PaymentStep } from "./payment-step";
import { BookingSuccess } from "./booking-success";
import { useBookingModal } from "./hooks";

export type BookingStep = "consultation-type" | "slot-selection" | "payment" | "success";

interface BookingModalProps {
  attorneyId: Id<"attorneys">;
  attorneyName: string;
  onClose: () => void;
}

export function BookingModal({ attorneyId, attorneyName, onClose }: BookingModalProps) {
  const { user, isSignedIn } = useUser();
  const [currentStep, setCurrentStep] = useState<BookingStep>("consultation-type");
  
  const {
    selectedConsultationType,
    selectedSlot,
    paymentData,
    isLoading,
    error,
    bookingId,
    setSelectedConsultationType,
    setSelectedSlot,
    setPaymentData,
    processBooking,
  } = useBookingModal(attorneyId);

  const handleNext = async () => {
    switch (currentStep) {
      case "consultation-type":
        if (selectedConsultationType) {
          setCurrentStep("slot-selection");
        }
        break;
      case "slot-selection":
        if (selectedSlot) {
          setCurrentStep("payment");
        }
        break;
      case "payment":
        if (paymentData) {
          const success = await processBooking();
          if (success) {
            setCurrentStep("success");
          }
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "slot-selection":
        setCurrentStep("consultation-type");
        break;
      case "payment":
        setCurrentStep("slot-selection");
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "consultation-type":
        return !!selectedConsultationType;
      case "slot-selection":
        return !!selectedSlot;
      case "payment":
        return !!paymentData;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "consultation-type":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.STEPS.CONSULTATION_TYPE;
      case "slot-selection":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.STEPS.DATE_TIME;
      case "payment":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.STEPS.PAYMENT;
      case "success":
        return ATTORNEY_PROFILE_MESSAGES.BOOKING.SUCCESS.TITLE;
      default:
        return "";
    }
  };

  const renderLoginPrompt = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <LogIn className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Влезте в профила си
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        {ATTORNEY_PROFILE_MESSAGES.BOOKING.ERRORS.LOGIN_REQUIRED}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold flex-1"
        >
          Отказ
        </button>
        <button
          onClick={() => {
            // Redirect to sign in
            window.location.href = "/sign-in?redirectUrl=" + encodeURIComponent(window.location.href);
          }}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 flex items-center gap-3 flex-1 justify-center"
        >
          <LogIn className="w-5 h-5" />
          Вход
        </button>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {["consultation-type", "slot-selection", "payment"].map((step, index) => {
          const stepIndex = ["consultation-type", "slot-selection", "payment"].indexOf(currentStep);
          const isCompleted = index < stepIndex;
          const isCurrent = index === stepIndex;
          
          return (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                isCompleted 
                  ? "bg-primary-600 text-white" 
                  : isCurrent 
                    ? "bg-primary-100 text-primary-600 border-2 border-primary-600" 
                    : "bg-gray-100 text-gray-400"
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                  isCompleted ? "bg-primary-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "consultation-type":
        return (
          <ConsultationTypeSelection
            attorneyId={attorneyId}
            selectedType={selectedConsultationType}
            onSelect={setSelectedConsultationType}
          />
        );
      case "slot-selection":
        return (
          <SlotSelection
            attorneyId={attorneyId}
            consultationType={selectedConsultationType!}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        );
      case "payment":
        return (
          <PaymentStep
            selectedSlot={selectedSlot!}
            consultationType={selectedConsultationType!}
            attorneyName={attorneyName}
            paymentData={paymentData}
            onUpdate={setPaymentData}
            isProcessing={isLoading}
          />
        );
      case "success":
        return (
          <BookingSuccess
            bookingId={bookingId!}
            attorneyName={attorneyName}
            selectedSlot={selectedSlot!}
            consultationType={selectedConsultationType!}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full">
          <div className="p-8">{renderLoginPrompt()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={currentStep !== "success" ? onClose : undefined} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.TITLE}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">{getStepTitle()}</p>
            </div>
            
            {currentStep !== "success" && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Step Indicator */}
          {currentStep !== "success" && renderStepIndicator()}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep !== "success" && (
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === "consultation-type"}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {ATTORNEY_PROFILE_MESSAGES.BOOKING.ACTIONS.BACK}
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 disabled:bg-primary-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {currentStep === "payment" 
                  ? ATTORNEY_PROFILE_MESSAGES.BOOKING.ACTIONS.CONFIRM_BOOKING
                  : ATTORNEY_PROFILE_MESSAGES.BOOKING.ACTIONS.CONTINUE
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}