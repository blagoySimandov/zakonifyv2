import { ZodError, ZodSchema } from "zod";

/**
 * Validates data using a Zod schema and throws a formatted error if validation fails
 * This is designed to be used in Convex functions where we need to throw ConvexError
 */
export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Get the first error for simplicity, as Convex typically shows one error at a time
      const firstError = error.issues[0];
      const errorMessage = firstError ? firstError.message : "Validation failed";
      
      // Create a simple Error that can be caught and converted to ConvexError
      // by the calling function
      throw new Error(errorMessage);
    }
    throw error;
  }
}

/**
 * Safely validates data and returns either the parsed result or an error
 * Useful for non-throwing validation scenarios
 */
export function safeValidateWithZod<T>(schema: ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      const errorMessage = firstError ? firstError.message : "Validation failed";
      return { success: false, error: errorMessage };
    }
    return { success: false, error: "Unknown validation error" };
  }
}

/**
 * Validates individual fields and returns field-specific errors
 * Useful for partial validation or form field validation
 */
export function getValidationErrors<T>(schema: ZodSchema<T>, data: unknown): Record<string, string> {
  try {
    schema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      for (const err of error.issues) {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = err.message;
        }
      }
      return errors;
    }
    return { general: "Validation failed" };
  }
}