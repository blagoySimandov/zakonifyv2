import { z } from "zod";
import { PRACTICE_AREAS } from "@/constants";

export const AttorneyRegistrationSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  // Professional Information
  barAssociationId: z
    .string()
    .min(5, "Bar Association ID must be at least 5 characters")
    .max(20, "Bar Association ID must be less than 20 characters"),

  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(70, "Years of experience seems too high"),

  education: z
    .string()
    .min(10, "Education field must be at least 10 characters")
    .max(500, "Education field must be less than 500 characters")
    .optional(),

  bio: z
    .string()
    .min(
      50,
      "Bio must be at least 50 characters to help clients understand your expertise"
    )
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),

  // Practice Areas
  practiceAreas: z
    .array(z.enum(PRACTICE_AREAS as unknown as [string, ...string[]]))
    .min(1, "Please select at least one practice area")
    .max(5, "Please select no more than 5 practice areas"),

  // Location
  location: z.object({
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be less than 50 characters"),

    state: z
      .string()
      .min(2, "State must be at least 2 characters")
      .max(50, "State must be less than 50 characters"),

    country: z.string().default("Bulgaria"),
  }),

  // Pricing
  hourlyRate: z
    .number()
    .min(50, "Hourly rate must be at least $50")
    .max(2000, "Hourly rate must be less than $2000"),

  fixedFeePackages: z
    .array(
      z.object({
        name: z
          .string()
          .min(5, "Package name must be at least 5 characters")
          .max(100, "Package name must be less than 100 characters"),

        description: z
          .string()
          .min(20, "Package description must be at least 20 characters")
          .max(500, "Package description must be less than 500 characters"),

        price: z
          .number()
          .min(100, "Package price must be at least $100")
          .max(50000, "Package price must be less than $50,000"),
      })
    )
    .optional(),

  // Media
  profileImage: z.string().optional(),
});

export type AttorneyRegistrationFormData = z.infer<
  typeof AttorneyRegistrationSchema
>;

export const STEP_SCHEMAS = {
  personal: AttorneyRegistrationSchema.pick({
    fullName: true,
    email: true,
  }),

  professional: AttorneyRegistrationSchema.pick({
    barAssociationId: true,
    yearsOfExperience: true,
    education: true,
    bio: true,
  }),

  practiceAndLocation: AttorneyRegistrationSchema.pick({
    practiceAreas: true,
    location: true,
  }),

  pricing: AttorneyRegistrationSchema.pick({
    hourlyRate: true,
    fixedFeePackages: true,
  }),
};
