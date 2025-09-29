import type {
  ChatbotRequest,
  ChatbotResponse,
  ChatbotSummaryResponse,
} from "../types";

// Generate a unique chat ID for session tracking
const generateChatId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
};

// Store chat ID in session storage to maintain conversation context
const getChatId = (): string => {
  let chatId =
    sessionStorage.getItem("ai_chat_id");
  if (!chatId) {
    chatId = generateChatId();
    sessionStorage.setItem("ai_chat_id", chatId);
  }
  return chatId;
};

// Chatbot API service
export const chatbotAPI = {
  // Send message to AI chatbot
  sendMessage: async (
    request: ChatbotRequest
  ): Promise<ChatbotResponse> => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";

    // For development, use mock data when enabled
    if (
      import.meta.env.VITE_ENABLE_MOCK_DATA ===
      "true"
    ) {
      return mockChatbotResponse(request);
    }

    try {
      const chatId = getChatId();

      // Build query parameters for the real API
      const params = new URLSearchParams({
        q: request.message,
        chatId: chatId,
      });

      if (request.courseId) {
        params.append(
          "courseId",
          request.courseId.toString()
        );
      }

      const url = `${API_BASE_URL}/chat/ask?${params.toString()}`;
      console.log(
        `Making chatbot API request to: ${url}`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `Chatbot API request failed: ${url}`,
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
      console.log(`Chatbot API response:`, data);
      return data;
    } catch (error) {
      console.error("Chatbot API error:", error);
      // Fallback to mock response on error
      return mockChatbotResponse(request);
    }
  },

  // Get chat summary
  getSummary: async (
    chatId?: string
  ): Promise<ChatbotSummaryResponse> => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";
    const targetChatId = chatId || getChatId();

    // For development, use mock data when enabled
    if (
      import.meta.env.VITE_ENABLE_MOCK_DATA ===
      "true"
    ) {
      return mockChatSummary();
    }

    try {
      const params = new URLSearchParams({
        chatId: targetChatId,
      });

      const url = `${API_BASE_URL}/chat/summary?${params.toString()}`;
      console.log(
        `Making chat summary API request to: ${url}`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `Chat summary API request failed: ${url}`,
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
        `Chat summary API response:`,
        data
      );
      return data;
    } catch (error) {
      console.error(
        "Chat summary API error:",
        error
      );
      // Fallback to mock response on error
      return mockChatSummary();
    }
  },
};

// Mock chatbot responses for development
const mockChatbotResponse = async (
  request: ChatbotRequest
): Promise<ChatbotResponse> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(
      resolve,
      1000 + Math.random() * 1500
    )
  );

  const message = request.message.toLowerCase();

  // Course-specific responses
  if (
    message.includes("computer science") ||
    message.includes("cs")
  ) {
    return {
      answer:
        "Computer Science is the study of computational systems, algorithms, and the design of computer systems. It combines theoretical foundations with practical applications in software development, data analysis, and system design. The field covers programming languages, data structures, algorithms, computer architecture, and software engineering principles.",
      sources: [
        {
          id: "1",
          url: "https://en.wikipedia.org/wiki/Computer_science",
        },
        {
          id: "2",
          url: "https://www.acm.org/about-acm/about-the-acm-organization",
        },
        {
          id: "3",
          url: "https://www.ieee-cs.org/about",
        },
      ],
      confidence: 0.95,
    };
  }

  if (
    message.includes("programming") ||
    message.includes("code") ||
    message.includes("software")
  ) {
    return {
      answer:
        "Programming is the process of creating instructions for computers using programming languages. It involves problem-solving, logical thinking, and breaking down complex problems into smaller, manageable parts. Key concepts include variables, functions, control structures, data types, and debugging. Popular languages include Python, JavaScript, Java, and C++.",
      sources: [
        {
          id: "4",
          url: "https://developer.mozilla.org/en-US/docs/Learn",
        },
        {
          id: "5",
          url: "https://www.codecademy.com/learn",
        },
        {
          id: "6",
          url: "https://www.freecodecamp.org/",
        },
      ],
      confidence: 0.92,
    };
  }

  if (
    message.includes("data structure") ||
    message.includes("algorithm")
  ) {
    return {
      answer:
        "Data structures are specialized formats for organizing and storing data efficiently. Common types include arrays (fast access), linked lists (dynamic size), stacks (LIFO), queues (FIFO), trees (hierarchical), and hash tables (key-value). Algorithms are step-by-step procedures for solving problems, with performance measured by time and space complexity using Big O notation.",
      sources: [
        {
          id: "7",
          url: "https://www.geeksforgeeks.org/data-structures/",
        },
        {
          id: "8",
          url: "https://visualgo.net/en",
        },
        {
          id: "9",
          url: "https://www.bigocheatsheet.com/",
        },
      ],
      confidence: 0.9,
    };
  }

  if (
    message.includes("exam") ||
    message.includes("test") ||
    message.includes("quiz")
  ) {
    return {
      answer:
        "To prepare for your exam, I recommend reviewing the course content systematically. Focus on understanding key concepts rather than memorizing. Practice with sample questions, create summary notes, and identify areas where you need more study time. The exam will test your understanding of the material covered in this course.",
      sources: null,
      confidence: 0.85,
    };
  }

  if (
    message.includes("help") ||
    message.includes("how") ||
    message.includes("what")
  ) {
    return {
      answer:
        "I'm here to help you understand the course material! You can ask me about specific programming concepts, computer science fundamentals, data structures, algorithms, or any topics covered in your course content. I can explain concepts, provide examples, and point you to additional resources.",
      sources: null,
      confidence: 0.88,
    };
  }

  // Default response
  return {
    answer:
      "I'm your AI course assistant! I can help explain concepts from this course, answer questions about programming and computer science, assist with understanding the material, and provide additional resources. What would you like to learn about?",
    sources: [
      {
        id: "10",
        url: "https://stackoverflow.com/",
      },
      {
        id: "11",
        url: "https://www.w3schools.com/",
      },
      {
        id: "12",
        url: "https://developer.mozilla.org/",
      },
    ],
    confidence: 0.8,
  };
};

// Mock chat summary for development
const mockChatSummary =
  async (): Promise<ChatbotSummaryResponse> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        500 + Math.random() * 1000
      )
    );

    const summaries = [
      "The user asked about computer science, seeking a definition or overview. The assistant provided a concise explanation covering key areas like algorithms, programming, AI, etc., emphasizing its scope from theory to practice.",
      "The conversation covered programming fundamentals including variables, functions, and control structures. The assistant explained different programming languages and their applications in modern software development.",
      "Discussion focused on data structures and algorithms, with explanations of arrays, linked lists, stacks, queues, and their time complexity characteristics using Big O notation.",
      "The user inquired about exam preparation strategies. The assistant provided study tips including systematic review, practice questions, and time management techniques for academic success.",
      "The conversation involved helping the user understand course material with explanations of key concepts, examples, and additional learning resources for computer science topics.",
    ];

    return {
      summary:
        summaries[
          Math.floor(
            Math.random() * summaries.length
          )
        ],
    };
  };

export default chatbotAPI;
