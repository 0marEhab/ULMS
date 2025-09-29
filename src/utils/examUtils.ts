import type {
  LocalExamResult,
  Question,
} from "../types";

/**
 * Calculates exam results based on user answers
 * @param questions - Array of exam questions
 * @param answers - Map of question IDs to selected choice indices
 * @param passingScore - Minimum passing score percentage (default: 60)
 * @returns Calculated exam result
 */
export const calculateExamResult = (
  questions: Question[],
  answers: Map<number, number>,
  passingScore: number = 60
): LocalExamResult => {
  const result: LocalExamResult = {
    score: 0,
    totalQuestions: questions.length,
    passed: false,
    answers: [],
  };

  questions.forEach((question) => {
    const selectedChoice = answers.get(
      question.id
    );
    const correct =
      selectedChoice === question.answer;

    if (correct) {
      result.score++;
    }

    result.answers.push({
      questionId: question.id,
      selectedChoice: selectedChoice ?? -1,
      correct,
    });
  });

  const percentage =
    (result.score / result.totalQuestions) * 100;
  result.passed = percentage >= passingScore;

  return result;
};

/**
 * Calculates the percentage score
 * @param score - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage score (0-100)
 */
export const calculatePercentage = (
  score: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Gets the letter grade based on percentage
 * @param percentage - Score percentage (0-100)
 * @returns Letter grade (A, B, C, D, F)
 */
export const getLetterGrade = (
  percentage: number
): string => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

/**
 * Determines if a score is passing
 * @param score - Number of correct answers
 * @param total - Total number of questions
 * @param passingScore - Minimum passing percentage (default: 60)
 * @returns True if the score is passing
 */
export const isPassing = (
  score: number,
  total: number,
  passingScore: number = 60
): boolean => {
  const percentage = calculatePercentage(
    score,
    total
  );
  return percentage >= passingScore;
};

/**
 * Gets feedback message based on exam performance
 * @param percentage - Score percentage
 * @param passed - Whether the exam was passed
 * @returns Feedback message
 */
export const getExamFeedback = (
  percentage: number,
  passed: boolean
): string => {
  if (passed) {
    if (percentage >= 95)
      return "Outstanding! Perfect score!";
    if (percentage >= 90)
      return "Excellent work!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 70)
      return "Good performance!";
    return "You passed! Well done!";
  } else {
    if (percentage >= 50)
      return "Close! Review the material and try again.";
    if (percentage >= 30)
      return "Keep studying. You can do better!";
    return "More practice needed. Review the course content.";
  }
};
