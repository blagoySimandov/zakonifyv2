"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";

export interface ConsultationType {
  type: "video" | "in-person";
  duration: number;
  price: number;
  isEnabled: boolean;
}

export interface TimeSlot {
  startTime: number;
  endTime: number;
  consultationType: "video" | "in-person";
  price: number;
}

export interface PaymentData {
  method: "stripe" | "paypal" | "bank-transfer";
  // Stripe integration will be added here
  stripePaymentIntentId?: string;
  // Placeholder for payment form data
  cardLast4?: string;
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export function useBookingModal(attorneyId: Id<"attorneys">) {
  const { user } = useUser();
  const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Get attorney data for pricing
  const attorney = useQuery(api.attorneys.getById, { id: attorneyId });
  
  // Get attorney availability profile
  const availabilityProfile = useQuery(api.availability.getAvailabilityProfile, {
    attorneyId,
  });

  // Create consultation mutation
  const createBooking = useMutation(api.consultations.createBooking);
  
  // Reserve slot mutation
  const reserveSlot = useMutation(api.availability.reserveSlot);

  // Get available consultation types based on attorney hourly rate
  const getAvailableConsultationTypes = (): ConsultationType[] => {
    if (!attorney?.hourlyRate) {
      return [];
    }
    
    const hourlyRate = attorney.hourlyRate;
    
    return [
      {
        type: "video",
        duration: 60, // 1 hour
        price: hourlyRate,
        isEnabled: true,
      },
      {
        type: "in-person",
        duration: 60, // 1 hour
        price: hourlyRate,
        isEnabled: true,
      },
    ];
  };

  const validateBookingData = (): boolean => {
    if (!selectedConsultationType) {
      setError(ATTORNEY_PROFILE_MESSAGES.BOOKING.VALIDATION.CONSULTATION_TYPE_REQUIRED);
      return false;
    }

    if (!selectedSlot) {
      setError(ATTORNEY_PROFILE_MESSAGES.BOOKING.VALIDATION.SLOT_REQUIRED);
      return false;
    }

    if (!paymentData) {
      setError(ATTORNEY_PROFILE_MESSAGES.BOOKING.VALIDATION.PAYMENT_INFO_REQUIRED);
      return false;
    }

    return true;
  };

  const processBooking = async (): Promise<boolean> => {
    if (!validateBookingData() || !user) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Reserve the slot first to prevent double booking
      const reservationId = await reserveSlot({
        attorneyId,
        startTime: selectedSlot!.startTime,
        endTime: selectedSlot!.endTime,
        consultationType: selectedSlot!.consultationType,
        reservedBy: user.id,
        durationMinutes: 10, // 10-minute reservation
      });

      // 2. Process payment (placeholder for Stripe integration)
      const paymentResult = await processPayment(paymentData!);
      if (!paymentResult.success) {
        throw new Error(ATTORNEY_PROFILE_MESSAGES.BOOKING.ERRORS.PAYMENT_FAILED);
      }

      // 3. Create the consultation
      const consultation = await createBooking({
        attorneyId,
        scheduledAt: selectedSlot!.startTime,
        duration: selectedConsultationType!.duration,
        price: selectedSlot!.price,
        consultationType: selectedConsultationType!.type,
        paymentData: {
          method: paymentData!.method,
          transactionId: paymentResult.transactionId,
          amount: selectedSlot!.price,
          currency: "EUR",
        },
      });

      setBookingId(consultation.id);
      return true;

    } catch (err) {
      console.error("Booking failed:", err);
      setError(err instanceof Error ? err.message : ATTORNEY_PROFILE_MESSAGES.BOOKING.ERRORS.BOOKING_FAILED);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Stripe payment processing
  const processPayment = async (paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> => {
    // TODO: Integrate with Stripe
    // This is where Stripe payment processing would happen
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, always return success with a mock transaction ID
    return {
      success: true,
      transactionId: `mock_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  };

  const resetBooking = () => {
    setSelectedConsultationType(null);
    setSelectedSlot(null);
    setPaymentData(null);
    setError(null);
    setBookingId(null);
    setIsLoading(false);
  };

  return {
    selectedConsultationType,
    selectedSlot,
    paymentData,
    isLoading,
    error,
    bookingId,
    availabilityProfile,
    availableConsultationTypes: getAvailableConsultationTypes(),
    setSelectedConsultationType,
    setSelectedSlot,
    setPaymentData,
    processBooking,
    resetBooking,
  };
}