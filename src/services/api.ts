// API service for course-related operations

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

// API Response interface (what we get from the server)
export interface ApiCourse {
  id: number;
  name: string;
  content: Content[];
  exams: ApiCourseExam[]; // Changed to use simplified exam structure
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

// API Question interface (what we get from the server)
export interface ApiQuestion {
  id: number;
  context: string;
  choices: string[];
  answer: number;
  explanation: string;
  examId: number;
}

// API Exam interface for courses endpoint (simplified)
export interface ApiCourseExam {
  id: number;
  title: string;
  courseId: number;
}

// API Exam interface for exams endpoint (full details)
export interface ApiExam {
  id: number;
  title: string;
  courseId: number;
  questions: ApiQuestion[];
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

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      console.error(
        `API request failed: ${url}`,
        {
          status: response.status,
          statusText: response.statusText,
        }
      );
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      `API response from ${endpoint}:`,
      data
    );
    return data;
  } catch (error) {
    console.error(
      `API request failed: ${endpoint}`,
      error
    );
    throw error;
  }
}

// Helper function to transform API question to internal Question interface
function transformApiQuestion(
  apiQuestion: ApiQuestion
): Question {
  return {
    id: apiQuestion.id,
    context: apiQuestion.context,
    choices: apiQuestion.choices,
    answer: apiQuestion.answer,
    explanation: apiQuestion.explanation,
    examId: apiQuestion.examId,
  };
}

// Helper function to transform API exam to internal Exam interface
function transformApiExam(
  apiExam: ApiExam,
  courseName?: string
): Exam {
  return {
    id: apiExam.id,
    courseId: apiExam.courseId,
    courseName: courseName || "Unknown Course",
    title: apiExam.title,
    description: undefined,
    questions: apiExam.questions.map(
      transformApiQuestion
    ),
    timeLimit: 30, // Default time limit
    passingScore: 60, // Default passing score
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Helper function to transform API course exam to internal Exam interface (simplified)
function transformApiCourseExam(
  apiCourseExam: ApiCourseExam,
  courseName: string
): Exam {
  return {
    id: apiCourseExam.id,
    courseId: apiCourseExam.courseId,
    courseName: courseName,
    title: apiCourseExam.title,
    description: undefined,
    questions: [], // Questions will be loaded separately
    timeLimit: 30,
    passingScore: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Helper function to transform API course to internal Course interface
function transformApiCourse(
  apiCourse: ApiCourse
): Course {
  return {
    ...apiCourse,
    description: undefined, // API doesn't provide description
    exams: apiCourse.exams.map((exam) =>
      transformApiCourseExam(exam, apiCourse.name)
    ),
    examId:
      apiCourse.exams.length > 0
        ? apiCourse.exams[0].id.toString()
        : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Course API functions
export const courseAPI = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    const apiCourses = await apiRequest<
      ApiCourse[]
    >("/courses");
    return apiCourses.map(transformApiCourse);
  },

  // Get a specific course by ID
  getCourse: async (
    courseId: number
  ): Promise<Course> => {
    const apiCourse = await apiRequest<ApiCourse>(
      `/courses/${courseId}`
    );
    return transformApiCourse(apiCourse);
  },

  // Get course content
  getCourseContent: async (
    courseId: number
  ): Promise<Content[]> => {
    return apiRequest<Content[]>(
      `/courses/${courseId}/content`
    );
  },

  // Get specific content item
  getContent: async (
    courseId: number,
    contentId: number
  ): Promise<Content> => {
    return apiRequest<Content>(
      `/courses/${courseId}/content/${contentId}`
    );
  },
};

// Exam API functions
export const examAPI = {
  // Get exam by ID
  getExam: async (
    examId: number
  ): Promise<Exam> => {
    const apiExam = await apiRequest<ApiExam>(
      `/exams/${examId}`
    );
    return transformApiExam(apiExam);
  },

  // Get exams for a course
  getCourseExams: async (
    courseId: number
  ): Promise<Exam[]> => {
    return apiRequest<Exam[]>(
      `/courses/${courseId}/exams`
    );
  },

  // Submit exam answers
  submitExam: async (
    submission: ExamSubmission
  ): Promise<ExamResult> => {
    return apiRequest<ExamResult>(
      "/exam-submissions",
      {
        method: "POST",
        body: JSON.stringify(submission),
      }
    );
  },

  // Get exam result
  getExamResult: async (
    resultId: number
  ): Promise<ExamResult> => {
    return apiRequest<ExamResult>(
      `/exam-results/${resultId}`
    );
  },

  // Get user's exam results for a course
  getUserExamResults: async (
    courseId: number
  ): Promise<ExamResult[]> => {
    return apiRequest<ExamResult[]>(
      `/courses/${courseId}/exam-results`
    );
  },
};

// Mock data functions (for development)
export const mockData = {
  getCourse: (courseId: number): Course => ({
    id: courseId,
    name: "Introduction to Computer Science",
    description:
      "A comprehensive introduction to computer science fundamentals.",
    content: [
      {
        id: 1,
        title: "What is Computer Science?",
        text: `Computer Science is the study of computational systems, algorithms, and the design of computer systems. It encompasses both the theoretical study of algorithms and the practical aspects of implementing them in computer systems.

This field combines mathematical rigor with engineering practicality. Computer scientists work on problems ranging from abstract algorithmic analysis to concrete issues like designing programming languages, software systems, and computer architectures.

Key areas of computer science include:
• Programming and software engineering
• Data structures and algorithms
• Computer systems and architecture
• Database systems
• Computer networks
• Artificial intelligence and machine learning
• Human-computer interaction
• Computer graphics and visualization`,
        courseId: courseId,
        order: 1,
        type: "text",
      },
      {
        id: 2,
        title: "Programming Fundamentals",
        text: `Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++.

At its core, programming involves:
• Problem solving and logical thinking
• Breaking down complex problems into smaller, manageable parts
• Writing clear, efficient, and maintainable code
• Testing and debugging programs
• Understanding different programming paradigms

Programming languages provide different tools and approaches:
• Procedural languages (C, Pascal) focus on procedures and functions
• Object-oriented languages (Java, C++) organize code around objects
• Functional languages (Haskell, Lisp) emphasize mathematical functions
• Scripting languages (Python, JavaScript) are often interpreted rather than compiled

The choice of programming language depends on the specific problem domain, performance requirements, and team preferences.`,
        courseId: courseId,
        order: 2,
        type: "text",
      },
      {
        id: 3,
        title: "Data Structures",
        text: `Data structures are specialized formats for organizing, processing, retrieving and storing data. While there are several basic and advanced structure types, any data structure is designed to arrange data to suit a specific purpose.

Common data structures include:

Arrays: Fixed-size sequential collections of elements
• Fast access to elements by index
• Efficient for mathematical operations
• Limited flexibility in size

Linked Lists: Dynamic collections where elements point to the next element
• Dynamic size allocation
• Efficient insertion and deletion
• Sequential access only

Stacks: Last-In-First-Out (LIFO) collections
• Used in function calls, expression evaluation
• Simple push and pop operations

Queues: First-In-First-Out (FIFO) collections
• Used in breadth-first search, task scheduling
• Enqueue and dequeue operations

Trees: Hierarchical structures with parent-child relationships
• Binary trees, binary search trees
• Efficient searching and sorting
• Used in file systems, databases

Hash Tables: Key-value pairs with fast lookup
• Average O(1) access time
• Used in databases, caches, associative arrays

The choice of data structure significantly impacts the efficiency of algorithms and overall program performance.`,
        courseId: courseId,
        order: 3,
        type: "text",
      },
    ],
    exams: [],
    examId: "exam-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  }),

  getExam: (examId: number): Exam => ({
    id: examId,
    courseId: 1,
    courseName:
      "Introduction to Computer Science",
    title: "Computer Science Fundamentals Quiz",
    description:
      "Test your understanding of basic computer science concepts.",
    timeLimit: 30,
    passingScore: 60,
    questions: [
      {
        id: 1,
        context: "What does CPU stand for?",
        choices: [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Program Unit",
          "Computer Processing Unit",
        ],
        answer: 0,
        explanation:
          "CPU stands for Central Processing Unit, which is the main component of a computer that performs most of the processing inside the computer.",
        examId: examId,
      },
      {
        id: 2,
        context:
          "Which of the following is a programming language primarily used for web development?",
        choices: [
          "SQL",
          "CSS",
          "JavaScript",
          "Assembly",
        ],
        answer: 2,
        explanation:
          "JavaScript is a programming language commonly used for web development, both on the client-side (browsers) and server-side (Node.js).",
        examId: examId,
      },
      {
        id: 3,
        context:
          "What is the time complexity of binary search in a sorted array?",
        choices: [
          "O(n)",
          "O(log n)",
          "O(n²)",
          "O(1)",
        ],
        answer: 1,
        explanation:
          "Binary search has a time complexity of O(log n) because it eliminates half of the remaining elements in each step.",
        examId: examId,
      },
      {
        id: 4,
        context:
          "Which data structure follows the LIFO (Last-In-First-Out) principle?",
        choices: [
          "Queue",
          "Stack",
          "Array",
          "Linked List",
        ],
        answer: 1,
        explanation:
          "A stack follows the LIFO principle where the last element added is the first one to be removed.",
        examId: examId,
      },
      {
        id: 5,
        context:
          "In object-oriented programming, what is encapsulation?",
        choices: [
          "Creating multiple instances of a class",
          "Hiding internal implementation details",
          "Inheriting from a parent class",
          "Overriding methods in a subclass",
        ],
        answer: 1,
        explanation:
          "Encapsulation is the principle of hiding internal implementation details and exposing only necessary interfaces to the outside world.",
        examId: examId,
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  }),
};
