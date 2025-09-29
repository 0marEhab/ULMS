// Central type definitions for the ULMS application

export interface Course {
  id: number;
  name: string;
  description?: string;
  content: Content[];
  exams: Exam[];
  examId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Content {
  id: number;
  title: string;
  text: string;
  courseId: number;
  order?: number;
  type?: "text" | "video" | "document";
}

export interface Question {
  id: number;
  context: string; // Changed from 'question' to 'context'
  choices: string[];
  answeredChoice?: number;
  answer: number; // Changed from 'correctAnswer' to 'answer'
  explanation?: string;
  examId: number; // Added examId field
}

export interface Exam {
  id: number;
  courseId: number;
  courseName: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage (0-100)
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamSubmission {
  examId: number;
  answers: {
    questionId: number;
    selectedChoice: number;
  }[];
  timeSpent?: number; // in seconds
}

export interface ExamResult {
  id: number;
  examId: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: {
    questionId: number;
    selectedChoice: number;
    correct: boolean;
  }[];
  timeSpent?: number;
  submittedAt: string;
}

// Local interface for exam results (simpler version for client-side use)
export interface LocalExamResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: {
    questionId: number;
    selectedChoice: number;
    correct: boolean;
  }[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User-related types (for future implementation)
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "instructor" | "admin";
  enrolledCourses?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: number;
  courseId: number;
  completedContent: number[];
  examResults: ExamResult[];
  overallProgress: number; // percentage
  lastAccessed: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// AI Chatbot types
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatbotSource {
  id: string;
  url: string;
}

export interface ChatbotResponse {
  answer: string;
  sources: ChatbotSource[] | null;
  confidence: number;
}

export interface ChatbotSummaryResponse {
  summary: string;
}

export interface ChatbotRequest {
  message: string;
  courseId?: number;
  contentId?: number;
  chatId?: string;
}
