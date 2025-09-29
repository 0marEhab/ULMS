
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoursePage from "./pages/content/CoursePage";
import ExamPage from "./pages/content/ExamPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import { Layout } from "./components";

function App() {
  // Mock student data
  const student = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.edu'
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ULMS</h1>
            <p className="text-gray-600 mb-8">University Learning Management System</p>
            <div className="space-x-4">
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
              >
                Go to Dashboard
              </a>
              <a
                href="/course/1"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
              >
                View Sample Course
              </a>
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <Layout student={student} onLogout={handleLogout}>
          <StudentDashboard />
        </Layout>
      ),
    },
    {
      path: "/course/:courseId",
      element: (
        <Layout student={student} onLogout={handleLogout}>
          <CoursePage />
        </Layout>
      ),
    },
    {
      path: "/exam/:examId",
      element: (
        <Layout student={student} onLogout={handleLogout}>
          <ExamPage />
        </Layout>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
