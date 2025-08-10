"use client";

import { useState } from "react";
import { useConsultationBooking } from "./hooks";
import { BOOKING_CONSTANTS } from "./constants";
import { BOOKING_MESSAGES } from "./messages";
import { Attorney } from "@/types";
import { Calendar, X, CheckCircle, Loader } from "lucide-react";

interface ConsultationBookingProps {
  attorney: Attorney;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export function ConsultationBooking({
  attorney,
  onClose,
  onBookingSuccess,
}: ConsultationBookingProps) {
  const {
    formData,
    errors,
    availableSlots,
    isLoadingSlots,
    isSubmitting,
    isSubmitted,
    selectedDate,
    consultationType,
    updateFormData,
    setSelectedDate,
    setConsultationType,
    loadAvailableSlots,
    submitBooking,
  } = useConsultationBooking(attorney._id);

  const [currentStep, setCurrentStep] = useState<
    "datetime" | "details" | "package"
  >("datetime");

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    loadAvailableSlots(date);
  };

  const handleNext = () => {
    if (
      currentStep === "datetime" &&
      consultationType === "fixed" &&
      attorney.fixedFeePackages?.length
    ) {
      setCurrentStep("package");
    } else if (currentStep === "datetime" || currentStep === "package") {
      setCurrentStep("details");
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      if (consultationType === "fixed" && attorney.fixedFeePackages?.length) {
        setCurrentStep("package");
      } else {
        setCurrentStep("datetime");
      }
    } else if (currentStep === "package") {
      setCurrentStep("datetime");
    }
  };

  const handleSubmit = async () => {
    const success = await submitBooking();
    if (success && onBookingSuccess) {
      onBookingSuccess();
    }
  };

  const renderSuccessState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-2">
        {BOOKING_MESSAGES.SUCCESS.BOOKED}
      </h3>
      <p className="text-green-700 mb-6">
        {BOOKING_MESSAGES.SUCCESS.CONFIRMATION}
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        {BOOKING_CONSTANTS.BUTTONS.CLOSE}
      </button>
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Date & Time
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultation Type *
          </label>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="consultationType"
                value="hourly"
                checked={consultationType === "hourly"}
                onChange={(e) =>
                  setConsultationType(e.target.value as "hourly" | "fixed")
                }
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">Hourly Consultation</div>
                <div className="text-sm text-gray-600">
                  ${attorney.hourlyRate}/hour
                </div>
              </div>
            </label>

            {attorney.fixedFeePackages &&
              attorney.fixedFeePackages.length > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="consultationType"
                    value="fixed"
                    checked={consultationType === "fixed"}
                    onChange={(e) =>
                      setConsultationType(e.target.value as "hourly" | "fixed")
                    }
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Fixed Fee Package</div>
                    <div className="text-sm text-gray-600">
                      Choose from available packages
                    </div>
                  </div>
                </label>
              )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.scheduledAt && (
            <p className="text-red-600 text-sm mt-1">{errors.scheduledAt[0]}</p>
          )}
        </div>

        {selectedDate && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots *
            </label>
            {isLoadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 text-blue-500 animate-spin mr-2" />
                <span className="text-gray-600">
                  Loading available slots...
                </span>
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No available slots for this date
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.timestamp}
                    onClick={() =>
                      updateFormData("scheduledAt", slot.timestamp)
                    }
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      formData.scheduledAt === slot.timestamp
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderPackageStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Package
        </h3>
        <div className="space-y-3">
          {attorney.fixedFeePackages?.map((pkg, index) => (
            <label
              key={index}
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="packageId"
                value={pkg.name}
                checked={formData.packageId === pkg.name}
                onChange={(e) => updateFormData("packageId", e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{pkg.name}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {pkg.description}
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${pkg.price}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.packageId && (
          <p className="text-red-600 text-sm mt-2">{errors.packageId[0]}</p>
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => updateFormData("clientName", e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.clientName && (
          <p className="text-red-600 text-sm mt-1">{errors.clientName[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.clientEmail}
          onChange={(e) => updateFormData("clientEmail", e.target.value)}
          placeholder="Enter your email address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.clientEmail && (
          <p className="text-red-600 text-sm mt-1">{errors.clientEmail[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={formData.clientPhone || ""}
          onChange={(e) => updateFormData("clientPhone", e.target.value)}
          placeholder="Enter your phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes || ""}
          onChange={(e) => updateFormData("notes", e.target.value)}
          placeholder="Brief description of your legal matter..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-gray-500 text-sm mt-1">
          {(formData.notes || "").length}/500 characters
        </p>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full mx-4">
          <div className="p-6">{renderSuccessState()}</div>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    if (currentStep === "datetime") {
      return selectedDate && formData.scheduledAt;
    }
    if (currentStep === "package") {
      return formData.packageId;
    }
    return false;
  };

  const canSubmit = () => {
    return (
      formData.clientName &&
      formData.clientEmail &&
      formData.scheduledAt &&
      (consultationType === "fixed" ? formData.packageId : true)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Book Consultation
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Book a consultation with{" "}
              <span className="font-medium">{attorney.fullName}</span>
            </p>
          </div>

          {errors._general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors._general[0]}</p>
            </div>
          )}

          <div className="mb-6">
            {currentStep === "datetime" && renderDateTimeStep()}
            {currentStep === "package" && renderPackageStep()}
            {currentStep === "details" && renderDetailsStep()}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div>
              {currentStep !== "datetime" && (
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              {currentStep === "details" ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Book Consultation
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-400"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
