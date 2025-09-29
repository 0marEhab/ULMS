/**
 * Validates if a string is not empty
 * @param value - String to validate
 * @returns True if string is not empty
 */
export const isNotEmpty = (
  value: string
): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if an array has items
 * @param array - Array to validate
 * @returns True if array has items
 */
export const hasItems = <T>(
  array: T[]
): boolean => {
  return array.length > 0;
};

/**
 * Validates if a number is within a range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if number is within range
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates if an index is valid for an array
 * @param index - Index to validate
 * @param array - Array to check against
 * @returns True if index is valid
 */
export const isValidIndex = <T>(
  index: number,
  array: T[]
): boolean => {
  return index >= 0 && index < array.length;
};

/**
 * Validates if all required fields in an object are present
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @returns True if all required fields are present and not empty
 */
export const hasRequiredFields = (
  obj: Record<string, any>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => {
    const value = obj[field];
    if (typeof value === "string") {
      return isNotEmpty(value);
    }
    return value !== null && value !== undefined;
  });
};

/**
 * Validates exam submission data
 * @param examId - Exam ID
 * @param answers - Map of answers
 * @param totalQuestions - Total number of questions
 * @returns Validation result with error message if invalid
 */
export const validateExamSubmission = (
  examId: number,
  answers: Map<number, number>,
  totalQuestions: number
): { isValid: boolean; error?: string } => {
  if (!examId || examId <= 0) {
    return {
      isValid: false,
      error: "Exam ID is required",
    };
  }

  if (answers.size === 0) {
    return {
      isValid: false,
      error: "No answers provided",
    };
  }

  if (answers.size !== totalQuestions) {
    return {
      isValid: false,
      error:
        "Not all questions have been answered",
    };
  }

  return { isValid: true };
};
