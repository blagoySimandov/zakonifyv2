"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AvailableSlot, ConsultationType } from "@/types/availability";
import { BookingStep } from "./index";
import { isValidEmail } from "@/lib/utils";

interface ClientInfo {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  consultationTopic: string;
  additionalNotes?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

interface PaymentInfo {
  paymentMethod: "credit-card" | "paypal" | "bank-transfer";
  paymentMethodId?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface UseBookingFlowReturn {
  // State
  consultationType: ConsultationType | null;
  duration: number | null;
  selectedSlot: AvailableSlot | null;
  clientInfo: ClientInfo | null;
  paymentInfo: PaymentInfo | null;
  isSubmitting: boolean;
  error: string | null;
  createdConsultationId: string | null;

  // Actions
  updateConsultationType: (type: ConsultationType) => void;
  updateDuration: (duration: number) => void;
  updateSelectedSlot: (slot: AvailableSlot) => void;
  updateClientInfo: (info: ClientInfo) => void;
  updatePaymentInfo: (info: PaymentInfo) => void;
  submitBooking: () => Promise<void>;
  validateStep: (step: BookingStep) => Promise<boolean>;
  resetBooking: () => void;
}

export function useBookingFlow(
  attorneyId: Id<"attorneys">,
): UseBookingFlowReturn {
  const [consultationType, setConsultationType] =
    useState<ConsultationType | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdConsultationId, setCreatedConsultationId] = useState<
    string | null
  >(null);

  const createConsultation = useMutation(api.consultations.create);
  const reserveSlot = useMutation(api.availability.reserveSlot);

  const updateConsultationType = useCallback((type: ConsultationType) => {
    setConsultationType(type);
    setError(null);
  }, []);

  const updateDuration = useCallback(
    (newDuration: number) => {
      setDuration(newDuration);
      setError(null);
      // Reset selected slot if duration changes
      if (selectedSlot) {
        setSelectedSlot(null);
      }
    },
    [selectedSlot],
  );

  const updateSelectedSlot = useCallback((slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setError(null);
  }, []);

  const updateClientInfo = useCallback((info: ClientInfo) => {
    setClientInfo(info);
    setError(null);
  }, []);

  const updatePaymentInfo = useCallback((info: PaymentInfo) => {
    setPaymentInfo(info);
    setError(null);
  }, []);

  const validateStep = useCallback(
    async (step: BookingStep): Promise<boolean> => {
      setError(null);

      switch (step) {
        case "consultation-type":
          if (!consultationType || !duration) {
            setError("Please select consultation type and duration");
            return false;
          }
          break;

        case "availability":
          if (!selectedSlot) {
            setError("Please select an available time slot");
            return false;
          }
          break;

        case "client-info":
          if (!clientInfo) {
            setError("Please provide your information");
            return false;
          }

          if (!clientInfo.fullName.trim()) {
            setError("Full name is required");
            return false;
          }

          if (!clientInfo.email.trim()) {
            setError("Email address is required");
            return false;
          }

          if (!isValidEmail(clientInfo.email)) {
            setError("Please enter a valid email address");
            return false;
          }

          if (!clientInfo.consultationTopic.trim()) {
            setError("Please describe what you'd like to discuss");
            return false;
          }

          if (!clientInfo.privacyConsent) {
            setError("Privacy consent is required to proceed");
            return false;
          }
          break;

        case "payment":
          if (!paymentInfo || !paymentInfo.paymentMethod) {
            setError("Please provide payment information");
            return false;
          }
          break;

        case "confirmation":
          // All validation should be done in previous steps
          break;
      }

      return true;
    },
    [consultationType, duration, selectedSlot, clientInfo, paymentInfo],
  );

  const submitBooking = useCallback(async () => {
    if (
      !consultationType ||
      !duration ||
      !selectedSlot ||
      !clientInfo ||
      !paymentInfo
    ) {
      setError("Missing required information");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await reserveSlot({
        attorneyId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        consultationType: selectedSlot.consultationType,
        reservedBy: `booking_${Date.now()}`,
        durationMinutes: 10, // Extended reservation during booking
      });

      await simulatePayment(paymentInfo);

      const consultationData = {
        attorneyId,
        clientName: clientInfo.fullName,
        clientEmail: clientInfo.email,
        clientPhone: clientInfo.phone,
        scheduledAt: selectedSlot.startTime,
        duration,
        consultationType: "hourly" as const,
        notes: `${clientInfo.consultationTopic}\n\nAdditional notes: ${clientInfo.additionalNotes || "None"}`,
      };

      const createResult = await createConsultation(consultationData);
      setCreatedConsultationId(createResult.id);

      await sendConfirmationEmail(clientInfo, selectedSlot, createResult.id);
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Failed to create booking. Please try again.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    consultationType,
    duration,
    selectedSlot,
    clientInfo,
    paymentInfo,
    attorneyId,
    createConsultation,
    reserveSlot,
  ]);

  const resetBooking = useCallback(() => {
    setConsultationType(null);
    setDuration(null);
    setSelectedSlot(null);
    setClientInfo(null);
    setPaymentInfo(null);
    setIsSubmitting(false);
    setError(null);
    setCreatedConsultationId(null);
  }, []);

  return {
    // State
    consultationType,
    duration,
    selectedSlot,
    clientInfo,
    paymentInfo,
    isSubmitting,
    error,
    createdConsultationId,

    // Actions
    updateConsultationType,
    updateDuration,
    updateSelectedSlot,
    updateClientInfo,
    updatePaymentInfo,
    submitBooking,
    validateStep,
    resetBooking,
  };
}

async function simulatePayment(paymentInfo: PaymentInfo): Promise<void> {
  //TODO: Do payment
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!paymentInfo.paymentMethod) {
    throw new Error("Payment failed: Invalid payment method");
  }
}

async function sendConfirmationEmail(
  clientInfo: ClientInfo,
  selectedSlot: AvailableSlot,
  consultationId: string,
): Promise<void> {
  //TODO: Actually send email
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Confirmation email sent to:", clientInfo.email);
  console.log("Consultation ID:", consultationId);
  console.log("Scheduled for:", new Date(selectedSlot.startTime));
}
