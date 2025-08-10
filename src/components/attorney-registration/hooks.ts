import { useState } from "react";
import { AttorneyRegistrationFormData, STEP_SCHEMAS } from "./validation";
import { RegistrationStep } from "./constants";
import { trpc } from "@/utils";

interface UseAttorneyRegistrationProps {
  initialData?: Partial<AttorneyRegistrationFormData>;
}

export function useAttorneyRegistration({
  initialData = {},
}: UseAttorneyRegistrationProps = {}) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("personal");
  const [formData, setFormData] = useState<
    Partial<AttorneyRegistrationFormData>
  >({
    location: {
      city: "",
      state: "",
      country: "Bulgaria",
      address: "",
      zipCode: "",
    },
    practiceAreas: [],
    fixedFeePackages: [],
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAttorneyMutation = trpc.attorneys.register.useMutation();

  const steps: RegistrationStep[] = [
    "personal",
    "professional",
    "practiceAndLocation",
    "pricing",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const updateFormData = (updates: Partial<AttorneyRegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateCurrentStep = () => {
    try {
      const schema = STEP_SCHEMAS[currentStep];
      const result = schema.safeParse(formData);

      if (!result.success) {
        const stepErrors: Record<string, string[]> = {};

        // Safely handle the error structure (ZodError.issues)
        const issues = (
          result as typeof result & {
            error: {
              issues?: Array<{ path?: (string | number)[]; message?: string }>;
            };
          }
        ).error.issues;
        if (Array.isArray(issues)) {
          issues.forEach((issue) => {
            const field = issue.path ? issue.path.join(".") : "unknown";
            if (!stepErrors[field]) {
              stepErrors[field] = [];
            }
            stepErrors[field].push(issue.message || "Validation error");
          });
        } else {
          console.warn("Unexpected validation error structure:", result.error);
          // Fallback error handling
          stepErrors._general = ["Validation failed. Please check your input."];
        }

        setErrors(stepErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      setErrors({
        _general: ["An unexpected error occurred during validation."],
      });
      return false;
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep() && !isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1]);
      setErrors({}); // Clear errors when going back
    }
  };

  const goToStep = (step: RegistrationStep) => {
    setCurrentStep(step);
    setErrors({});
  };

  const addFixedFeePackage = () => {
    const currentPackages = formData.fixedFeePackages || [];
    updateFormData({
      fixedFeePackages: [
        ...currentPackages,
        { name: "", description: "", price: 0 },
      ],
    });
  };

  const removeFixedFeePackage = (index: number) => {
    const currentPackages = formData.fixedFeePackages || [];
    updateFormData({
      fixedFeePackages: currentPackages.filter((_, i) => i !== index),
    });
  };

  type FixedFeePackage = NonNullable<
    AttorneyRegistrationFormData["fixedFeePackages"]
  >[number];

  const updateFixedFeePackage = (
    index: number,
    updates: Partial<FixedFeePackage>,
  ) => {
    const currentPackages = formData.fixedFeePackages || [];
    const updatedPackages = [...currentPackages];
    updatedPackages[index] = { ...updatedPackages[index], ...updates };
    updateFormData({ fixedFeePackages: updatedPackages });
  };

  const submitRegistration = async () => {
    if (!validateCurrentStep()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      // Final validation of all data
      const fullSchema = STEP_SCHEMAS.personal
        .merge(STEP_SCHEMAS.professional)
        .merge(STEP_SCHEMAS.practiceAndLocation)
        .merge(STEP_SCHEMAS.pricing);

      const result = fullSchema.safeParse(formData);

      if (!result.success) {
        const allErrors: Record<string, string[]> = {};

        // Safely handle the error structure (ZodError.issues)
        const issues = (
          result as typeof result & {
            error: {
              issues?: Array<{ path?: (string | number)[]; message?: string }>;
            };
          }
        ).error.issues;
        if (Array.isArray(issues)) {
          issues.forEach((issue) => {
            const field = issue.path ? issue.path.join(".") : "unknown";
            if (!allErrors[field]) {
              allErrors[field] = [];
            }
            allErrors[field].push(issue.message || "Validation error");
          });
        } else {
          console.warn(
            "Unexpected final validation error structure:",
            result.error,
          );
          // Fallback error handling
          allErrors._general = ["Validation failed. Please check your input."];
        }

        setErrors(allErrors);
        return false;
      }

      await createAttorneyMutation.mutateAsync(result.data);
      return true;
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      // Handle tRPC/Convex error format
      let errorMessage = "Registration failed. Please try again.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Set appropriate field errors based on the error message
      if (
        errorMessage.includes("email already exists") ||
        errorMessage.includes("email")
      ) {
        setErrors({ email: [errorMessage] });
        // Go back to the personal step where email is edited
        setCurrentStep("personal");
      } else if (
        errorMessage.includes("bar association ID") ||
        errorMessage.includes("bar association") ||
        errorMessage.includes("barAssociationId")
      ) {
        setErrors({ barAssociationId: [errorMessage] });
        // Go back to the professional step where bar ID is edited
        setCurrentStep("professional");
      } else if (
        errorMessage.includes("City") ||
        errorMessage.includes("city")
      ) {
        setErrors({ "location.city": [errorMessage] });
        setCurrentStep("practiceAndLocation");
      } else if (
        errorMessage.includes("State") ||
        errorMessage.includes("state")
      ) {
        setErrors({ "location.state": [errorMessage] });
        setCurrentStep("practiceAndLocation");
      } else if (
        errorMessage.includes("Address") ||
        errorMessage.includes("address")
      ) {
        setErrors({ "location.address": [errorMessage] });
        setCurrentStep("practiceAndLocation");
      } else if (
        errorMessage.includes("practice area") ||
        errorMessage.includes("practiceAreas")
      ) {
        setErrors({ practiceAreas: [errorMessage] });
        setCurrentStep("practiceAndLocation");
      } else if (
        errorMessage.includes("hourly") ||
        errorMessage.includes("rate") ||
        errorMessage.includes("hourlyRate")
      ) {
        setErrors({ hourlyRate: [errorMessage] });
        setCurrentStep("pricing");
      } else if (
        errorMessage.includes("package") ||
        errorMessage.includes("fixedFeePackages")
      ) {
        setErrors({ fixedFeePackages: [errorMessage] });
        setCurrentStep("pricing");
      } else {
        // Generic error - show at top level
        setErrors({ _general: [errorMessage] });
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => ({
    current: currentStepIndex + 1,
    total: steps.length,
    percentage: ((currentStepIndex + 1) / steps.length) * 100,
  });

  return {
    // State
    currentStep,
    formData,
    errors,
    isSubmitting,

    // Step info
    isFirstStep,
    isLastStep,
    steps,
    getStepProgress,

    // Actions
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateCurrentStep,
    submitRegistration,

    // Fixed fee packages
    addFixedFeePackage,
    removeFixedFeePackage,
    updateFixedFeePackage,
  };
}
