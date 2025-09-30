import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    enrolledDate: string;
    lastActive: string;
    grade: number;
    completedLessons: number;
    totalLessons: number;
}

interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    examName: string;
    score: number;
    completedAt: string;
    duration: string;
    screenshots: string[];
}

interface CourseContent {
    id: string;
    title: string;
    type: 'lesson' | 'quiz' | 'assignment';
    order: number;
    status: 'draft' | 'published';
    createdAt: string;
}

const InstructorCourseManagement: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mock data
    const course = {
        id: courseId,
        name: 'Advanced Computer Science',
        description: 'Comprehensive computer science fundamentals and advanced topics.',
        studentsCount: 45
    };

    const [students] = useState<Student[]>([
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@student.edu',
            enrolledDate: '2024-01-15',
            lastActive: '2024-03-01',
            grade: 87.5,
            completedLessons: 8,
            totalLessons: 12
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@student.edu',
            enrolledDate: '2024-01-20',
            lastActive: '2024-03-02',
            grade: 92.3,
            completedLessons: 10,
            totalLessons: 12
        },
        {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@student.edu',
            enrolledDate: '2024-01-18',
            lastActive: '2024-02-28',
            grade: 78.9,
            completedLessons: 6,
            totalLessons: 12
        }
    ]);

    const [examResults] = useState<ExamResult[]>([
        {
            id: '1',
            studentId: '1',
            studentName: 'John Doe',
            examName: 'Midterm Exam',
            score: 85,
            completedAt: '2024-02-15T10:30:00Z',
            duration: '1h 45m',
            screenshots: [
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop'
            ]
        },
        {
            id: '2',
            studentId: '2',
            studentName: 'Jane Smith',
            examName: 'Midterm Exam',
            score: 92,
            completedAt: '2024-02-15T09:15:00Z',
            duration: '1h 30m',
            screenshots: [
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
            ]
        }
    ]);

    const [courseContent] = useState<CourseContent[]>([
        {
            id: '1',
            title: 'Introduction to Algorithms',
            type: 'lesson',
            order: 1,
            status: 'published',
            createdAt: '2024-01-10'
        },
        {
            id: '2',
            title: 'Data Structures Fundamentals',
            type: 'lesson',
            order: 2,
            status: 'published',
            createdAt: '2024-01-12'
        },
        {
            id: '3',
            title: 'Algorithm Analysis Quiz',
            type: 'quiz',
            order: 3,
            status: 'draft',
            createdAt: '2024-01-15'
        }
    ]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const tabs = [
        { name: 'Course Content', icon: '📚' },
        { name: 'Students', icon: '👥' },
        { name: 'Exam Results', icon: '📊' },
        { name: 'Screenshots', icon: '📸' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/instructor/dashboard')}
                                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                                <p className="text-gray-600">{course.studentsCount} students enrolled</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                                Preview Course
                            </button>
                            <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                                Publish Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Custom Tab Navigation */}
                <div className="flex space-x-1 rounded-xl bg-white p-1 shadow-lg border border-gray-200 mb-8">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(index)}
                            className={`w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all duration-200 ${activeTab === index
                                    ? 'bg-gray-800 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {/* Course Content Panel */}
                    {activeTab === 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                    <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Add Content</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {courseContent.map((content) => (
                                        <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${content.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
                                                        content.type === 'quiz' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-green-100 text-green-600'
                                                    }`}>
                                                    {content.type === 'lesson' ? '📖' : content.type === 'quiz' ? '❓' : '📝'}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                                                    <p className="text-sm text-gray-500">Order: {content.order} • Created: {new Date(content.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${content.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {content.status}
                                                </span>
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Students Panel */}
                    {activeTab === 1 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-700 font-semibold">
                                                                {student.firstName[0]}{student.lastName[0]}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {student.firstName} {student.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-gray-700 h-2 rounded-full"
                                                                style={{ width: `${(student.completedLessons / student.totalLessons) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {student.completedLessons}/{student.totalLessons}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.grade >= 90 ? 'bg-green-100 text-green-800' :
                                                            student.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                                                                student.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.grade}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(student.lastActive).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Exam Results Panel */}
                    {activeTab === 2 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Exam Results</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-6">
                                    {examResults.map((result) => (
                                        <div key={result.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{result.examName}</h3>
                                                    <p className="text-gray-600">{result.studentName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-2xl font-bold ${result.score >= 90 ? 'text-green-600' :
                                                            result.score >= 80 ? 'text-blue-600' :
                                                                result.score >= 70 ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                        }`}>
                                                        {result.score}%
                                                    </div>
                                                    <p className="text-sm text-gray-500">Duration: {result.duration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>Completed: {new Date(result.completedAt).toLocaleDateString()}</span>
                                                <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                                                    View Screenshots ({result.screenshots.length})
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Screenshots Panel */}
                    {activeTab === 3 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Exam Screenshots</h2>
                                <p className="text-gray-600 mt-1">Monitoring screenshots captured during exams</p>
                            </div>
                            <div className="p-6">
                                {examResults.map((result) => (
                                    <div key={result.id} className="mb-8 last:mb-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {result.studentName} - {result.examName}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(result.completedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {result.screenshots.map((screenshot, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={screenshot}
                                                        alt={`Screenshot ${index + 1}`}
                                                        className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                        <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium transition-opacity duration-200">
                                                            View Full Size
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                                                        {index + 1} / {result.screenshots.length}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorCourseManagement;