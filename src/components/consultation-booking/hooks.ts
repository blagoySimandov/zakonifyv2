"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  scheduledAt: number;
  duration: number;
  consultationType: "hourly" | "fixed";
  packageId?: string;
  notes?: string;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
  _general?: string[];
}

interface AvailableSlot {
  time: string;
  timestamp: number;
}

export function useConsultationBooking(attorneyId: string) {
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    scheduledAt: 0,
    duration: 60,
    consultationType: "hourly",
    packageId: "",
    notes: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [consultationType, setConsultationType] = useState<"hourly" | "fixed">(
    "hourly",
  );
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const createBookingMutation = useMutation(api.consultations.create);

  const slotsData = useQuery(
    api.consultations.getAvailableSlots,
    !!attorneyId && !!selectedDate ? { 
      attorneyId: attorneyId as Id<"attorneys">, 
      date: selectedDate 
    } : "skip"
  );

  const isFetchingSlots = slotsData === undefined;
  const slotsError = null;

  // Update available slots when query data changes
  useEffect(() => {
    console.log("Slots data updated:", {
      slotsData,
      isFetchingSlots,
      selectedDate,
      slotsError,
    });
    if (slotsError) {
      console.error("Slots query error:", slotsError);
    }
    if (slotsData) {
      console.log("Setting available slots:", slotsData);
      setAvailableSlots(slotsData);
    } else if (!isFetchingSlots && selectedDate) {
      console.log("No slots data received, setting empty array");
      setAvailableSlots([]);
    }
    setIsLoadingSlots(isFetchingSlots);
  }, [slotsData, isFetchingSlots, selectedDate, slotsError]);

  const loadAvailableSlots = async (date: string) => {
    console.log("loadAvailableSlots called with date:", date);
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      console.log(
        "Triggering refetch for date:",
        date,
        "attorneyId:",
        attorneyId,
      );
      // Convex queries will refetch automatically when dependencies change
      console.log("Refetch completed");
    } catch (error) {
      console.error("Failed to load available slots:", error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = ["Full name is required"];
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = ["Name must be at least 2 characters"];
    } else if (formData.clientName.trim().length > 100) {
      newErrors.clientName = ["Name must be less than 100 characters"];
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = ["Email address is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = ["Please enter a valid email address"];
    }

    if (!formData.scheduledAt) {
      newErrors.scheduledAt = ["Please select a date and time"];
    } else if (formData.scheduledAt < Date.now()) {
      newErrors.scheduledAt = ["Cannot book consultation in the past"];
    }

    if (consultationType === "fixed") {
      if (!formData.packageId) {
        newErrors.packageId = ["Please select a package"];
      }
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = ["Notes must be less than 500 characters"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (
    field: keyof BookingFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors._general) {
      setErrors((prev) => ({ ...prev, _general: undefined }));
    }
  };

  const submitBooking = async (): Promise<boolean> => {
    const updatedFormData = {
      ...formData,
      consultationType,
      duration: consultationType === "hourly" ? 60 : formData.duration,
    };
    setFormData(updatedFormData);

    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await createBookingMutation({
        attorneyId: attorneyId as Id<"attorneys">,
        clientName: updatedFormData.clientName.trim(),
        clientEmail: updatedFormData.clientEmail.trim(),
        clientPhone: updatedFormData.clientPhone?.trim(),
        scheduledAt: updatedFormData.scheduledAt,
        duration: updatedFormData.duration,
        consultationType: updatedFormData.consultationType,
        packageId: updatedFormData.packageId?.trim(),
        notes: updatedFormData.notes?.trim(),
      });

      // Convex will automatically refetch queries when data changes
      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error("Failed to book consultation:", error);
      setErrors({
        _general: [
          error instanceof Error
            ? error.message
            : "Failed to book consultation. Please try again.",
        ],
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      scheduledAt: 0,
      duration: 60,
      consultationType: "hourly",
      packageId: "",
      notes: "",
    });
    setErrors({});
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSelectedDate("");
    setConsultationType("hourly");
    setAvailableSlots([]);
  };

  return {
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
    resetForm,
  };
}
