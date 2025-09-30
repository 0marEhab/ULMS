import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../../services/api';
import type { Course } from '../../types';
import {
    LoadingSpinner,
    ErrorMessage
} from '../../components/common';

interface InstructorCourse extends Course {
    studentsCount?: number;
    examsCount?: number;
    averageGrade?: number;
}

interface InstructorStats {
    totalCourses: number;
    totalStudents: number;
    totalExams: number;
    averageGrade: number;
}

const InstructorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [stats, setStats] = useState<InstructorStats>({
        totalCourses: 0,
        totalStudents: 0,
        totalExams: 0,
        averageGrade: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock instructor data
    const instructor = {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@university.edu',
        department: 'Computer Science'
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Mock instructor courses
            const instructorCourses = [
                {
                    ...mockData.getCourse(1),
                    studentsCount: 45,
                    examsCount: 3,
                    averageGrade: 87.5
                },
                {
                    ...mockData.getCourse(2),
                    id: 2,
                    name: 'Advanced Web Development',
                    description: 'Deep dive into modern web frameworks and advanced concepts.',
                    studentsCount: 32,
                    examsCount: 2,
                    averageGrade: 82.3
                },
                {
                    id: 3,
                    name: 'Database Systems',
                    description: 'Comprehensive database design and management course.',
                    content: [],
                    exams: [],
                    examId: 'exam-3',
                    studentsCount: 38,
                    examsCount: 4,
                    averageGrade: 85.1,
                    createdAt: '2024-02-01T00:00:00Z',
                    updatedAt: '2024-02-15T00:00:00Z'
                }
            ];

            setCourses(instructorCourses);

            // Calculate stats
            const totalStudents = instructorCourses.reduce((sum, course) => sum + (course.studentsCount || 0), 0);
            const totalExams = instructorCourses.reduce((sum, course) => sum + (course.examsCount || 0), 0);
            const averageGrade = instructorCourses.reduce((sum, course) => sum + (course.averageGrade || 0), 0) / instructorCourses.length;

            setStats({
                totalCourses: instructorCourses.length,
                totalStudents,
                totalExams,
                averageGrade: Math.round(averageGrade * 10) / 10
            });

        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Error loading instructor dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId: number) => {
        navigate(`/instructor/course/${courseId}`);
    };

    const handleCreateCourse = () => {
        navigate('/instructor/course/new');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 mt-4">Loading your instructor dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {instructor.firstName}!
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {instructor.department} Department • Instructor Dashboard
                            </p>
                        </div>
                        <button
                            onClick={handleCreateCourse}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Create New Course</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Grade</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.averageGrade}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden transform hover:-translate-y-1"
                        >
                            {/* Course Header */}
                            <div className="bg-gray-800 p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                                <div className="relative">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-gray-200 transition-colors duration-200">
                                        {course.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>
                            </div>

                            {/* Course Stats */}
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{course.studentsCount}</div>
                                        <div className="text-xs text-gray-500">Students</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{course.examsCount}</div>
                                        <div className="text-xs text-gray-500">Exams</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{course.averageGrade}%</div>
                                        <div className="text-xs text-gray-500">Avg Grade</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/instructor/course/${course.id}/content`);
                                        }}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/instructor/course/${course.id}/students`);
                                        }}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <span>Students</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/instructor/course/${course.id}/exams`);
                                        }}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Exams</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Course Card */}
                    <div
                        onClick={handleCreateCourse}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center min-h-[300px] transform hover:-translate-y-1"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors duration-200">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Course</h3>
                            <p className="text-gray-500 text-sm">Start building your next course</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;