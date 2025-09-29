# ULMS - University Learning Management System

A modern, responsive Learning Management System built with React, TypeScript, and Tailwind CSS.

## Features

### 🏠 Student Dashboard

- **Course Overview**: Grid layout displaying all enrolled courses with progress
- **Statistics Cards**: Total courses, in-progress, completed, and average progress
- **Recent Activity**: Timeline of student learning activities and achievements
- **Course Cards**: Interactive cards with progress bars and quick actions
- **Navigation Header**: Persistent navigation with user profile and logout

### 📚 Course Management

- **Course Overview**: Display course name, description, and structured content
- **Content Navigation**: Sidebar navigation with content ordering and progress tracking
- **Rich Content Display**: Support for text-based learning materials with proper formatting
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📝 Examination System

- **Interactive Quizzes**: Multiple-choice questions with real-time feedback
- **Timer Functionality**: Configurable time limits with visual countdown
- **Progress Tracking**: Question navigation and completion status
- **Instant Results**: Detailed score breakdown and answer review
- **Passing Grade System**: Configurable passing scores with pass/fail status

### 🎨 User Interface

- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Loading States**: Smooth loading animations and error handling
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsive Layout**: Mobile-first design approach
- **Consistent Header**: Navigation bar with user profile and quick access

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common UI components
│   │   ├── UIComponents.tsx    # Button, LoadingSpinner, ProgressBar, etc.
│   │   └── index.ts            # Common components exports
│   ├── course/          # Course-related components
│   │   ├── CourseHeader.tsx    # Course page header
│   │   ├── ContentNavigation.tsx # Course content sidebar
│   │   ├── ContentDisplay.tsx  # Main content display
│   │   └── index.ts            # Course components exports
│   ├── dashboard/        # Dashboard components
│   │   ├── CourseCard.tsx      # Course card with progress
│   │   ├── StatsCard.tsx       # Statistics display card
│   │   ├── RecentActivity.tsx  # Activity timeline
│   │   └── index.ts            # Dashboard components exports
│   ├── layout/          # Layout components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── index.ts            # Layout components exports
│   ├── exam/            # Exam-related components
│   │   ├── QuestionCard.tsx    # Individual question display
│   │   ├── ExamTimer.tsx       # Timer component
│   │   ├── ExamProgress.tsx    # Progress indicator
│   │   ├── ExamResults.tsx     # Results display
│   │   └── index.ts            # Exam components exports
│   └── index.ts         # Main components exports
├── hooks/               # Custom React hooks
│   ├── useTimer.ts      # Timer management hook
│   ├── useLocalStorage.ts # localStorage hook
│   └── index.ts         # Hooks exports
├── pages/               # Main application pages
│   ├── dashboard/
│   │   └── StudentDashboard.tsx # Student dashboard with course overview
│   └── content/
│       ├── CoursePage.tsx      # Course content display and navigation
│       └── ExamPage.tsx        # Exam interface and results
├── services/            # API services and data management
│   └── api.ts          # API functions and mock data
├── types/              # TypeScript type definitions
│   └── index.ts        # Central type definitions
├── utils/              # Utility functions
│   ├── timeUtils.ts    # Time formatting utilities
│   ├── examUtils.ts    # Exam calculation utilities
│   ├── validationUtils.ts # Validation functions
│   └── index.ts        # Utils exports
└── App.tsx             # Main application router
```

## Technology Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ulms
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Viewing Courses

1. Navigate to `/course/:courseId` to view a specific course
2. Use the sidebar to navigate between different content sections
3. Click "Take Exam" to access the course examination

### Taking Exams

1. Navigate to `/exam/:examId` or click "Take Exam" from a course page
2. Answer questions by selecting the appropriate choice
3. Use "Previous" and "Next" buttons to navigate between questions
4. Click "Submit Exam" to finish and view results
5. Review your answers and see correct solutions

## API Integration

The application is designed to work with future API endpoints. Currently, it uses mock data for development.

### Course API Endpoints (Future)

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/:id/content` - Get course content

### Exam API Endpoints (Future)

- `GET /api/exams/:id` - Get exam details
- `POST /api/exam-submissions` - Submit exam answers
- `GET /api/exam-results/:id` - Get exam results

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Customization

#### Adding New Content Types

Extend the `Content` interface in `src/types/index.ts`:

```typescript
interface Content {
  id: string;
  title: string;
  text: string;
  type?:
    | "text"
    | "video"
    | "document"
    | "interactive";
  // Add new fields as needed
}
```

#### Modifying Exam Behavior

Update the exam configuration in `src/services/api.ts`:

```typescript
// Modify passing score, time limits, etc.
const mockExam = {
  timeLimit: 45, // minutes
  passingScore: 70, // percentage
  // ... other properties
};
```

## Development Guidelines

### Adding New Pages

1. Create component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation as needed

### Adding New Components

1. Create component in `src/components/`
2. Export from appropriate index file
3. Add TypeScript interfaces as needed

### API Integration

1. Replace mock data calls with actual API calls
2. Update error handling for network requests
3. Add authentication headers as needed

## Future Enhancements

### Planned Features

- **User Authentication**: Login/logout functionality
- **Progress Tracking**: Save user progress and resume capability
- **Video Content**: Support for video-based learning materials
- **Discussion Forums**: Course-specific discussion boards
- **Assignments**: File upload and submission system
- **Analytics**: Learning analytics and progress reports
- **Mobile App**: React Native companion app

### Technical Improvements

- **State Management**: Redux or Zustand for complex state
- **Caching**: React Query for API caching
- **Testing**: Jest and React Testing Library
- **Performance**: Code splitting and lazy loading
- **PWA**: Progressive Web App capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@ulms.edu or create an issue in the repository.
