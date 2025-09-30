
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoursePage from "./pages/content/CoursePage";
import ExamPage from "./pages/content/ExamPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourseManagement from "./pages/instructor/InstructorCourseManagement";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Layout } from "./components";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              index: true,
              element: <StudentDashboard />,
            },
            {
              path: "dashboard",
              element: <StudentDashboard />,
            },
            {
              path: "course/:courseId",
              element: <CoursePage />,
            },
            {
              path: "exam/:examId",
              element: <ExamPage />,
            },
            // Instructor routes
            {
              path: "instructor/dashboard",
              element: <InstructorDashboard />,
            },
            {
              path: "instructor/course/:courseId",
              element: <InstructorCourseManagement />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
