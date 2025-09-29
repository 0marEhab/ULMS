import React, { useState, useEffect } from 'react';
import { courseAPI, mockData } from '../../services/api';
import type { Course } from '../../types';
import {
    LoadingSpinner,
    ErrorMessage
} from '../../components/common';
import CourseCard from '../../components/dashboard/CourseCard';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';

const StudentDashboard: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock student data
    const student = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.edu'
    };

    // Mock progress data
    const courseProgress: Record<number, number> = {
        1: 75, // Course 1 is 75% complete
        2: 30, // Course 2 is 30% complete
        3: 0,  // Course 3 not started
    };

    // Mock recent activities
    const recentActivities = [
        {
            id: '1',
            type: 'exam_completed' as const,
            title: 'Completed Computer Science Exam',
            description: 'Scored 85% on the final examination',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
            id: '2',
            type: 'lesson_completed' as const,
            title: 'Completed Data Structures Lesson',
            description: 'Finished learning about binary trees and algorithms',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        {
            id: '3',
            type: 'course_started' as const,
            title: 'Started Web Development Course',
            description: 'Began learning HTML, CSS, and JavaScript fundamentals',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
            id: '4',
            type: 'achievement_earned' as const,
            title: 'Earned "Quick Learner" Badge',
            description: 'Completed 3 lessons in a single day',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);

                let coursesData: Course[];

                // Use real API if environment variable is set to disable mock data
                if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'false') {
                    coursesData = await courseAPI.getCourses();
                } else {
                    // Mock data for development - multiple courses
                    coursesData = [
                        mockData.getCourse(1),
                        {
                            id: 2,
                            name: 'Web Development Fundamentals',
                            description: 'Learn HTML, CSS, JavaScript, and modern web development frameworks.',
                            content: [
                                {
                                    id: 1,
                                    title: 'HTML Basics',
                                    text: 'Introduction to HTML structure, elements, and semantic markup.',
                                    courseId: 2,
                                    order: 1,
                                    type: 'text'
                                },
                                {
                                    id: 2,
                                    title: 'CSS Styling',
                                    text: 'Learn how to style HTML elements with CSS properties and selectors.',
                                    courseId: 2,
                                    order: 2,
                                    type: 'text'
                                },
                                {
                                    id: 3,
                                    title: 'JavaScript Programming',
                                    text: 'Introduction to JavaScript programming concepts and DOM manipulation.',
                                    courseId: 2,
                                    order: 3,
                                    type: 'text'
                                }
                            ],
                            exams: [],
                            examId: 'exam-2',
                            createdAt: '2024-01-15T00:00:00Z',
                            updatedAt: '2024-02-01T00:00:00Z'
                        },
                        {
                            id: 3,
                            name: 'Database Design & SQL',
                            description: 'Master database design principles and SQL query language.',
                            content: [
                                {
                                    id: 1,
                                    title: 'Database Fundamentals',
                                    text: 'Understanding databases, tables, and relationships.',
                                    courseId: 3,
                                    order: 1,
                                    type: 'text'
                                },
                                {
                                    id: 2,
                                    title: 'SQL Basics',
                                    text: 'Learn basic SQL commands for querying databases.',
                                    courseId: 3,
                                    order: 2,
                                    type: 'text'
                                }
                            ],
                            exams: [],
                            examId: 'exam-3',
                            createdAt: '2024-02-01T00:00:00Z',
                            updatedAt: '2024-02-15T00:00:00Z'
                        }
                    ];
                }

                setCourses(coursesData);
            } catch (err) {
                setError('Failed to load courses');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Calculate stats
    const totalCourses = courses.length;
    const coursesInProgress = Object.values(courseProgress).filter(progress => progress > 0 && progress < 100).length;
    const completedCourses = Object.values(courseProgress).filter(progress => progress === 100).length;
    const averageProgress = Object.values(courseProgress).reduce((sum, progress) => sum + progress, 0) / totalCourses || 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {student.firstName}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Continue your learning journey with your enrolled courses.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Courses"
                        value={totalCourses}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
                    />

                    <StatsCard
                        title="In Progress"
                        value={coursesInProgress}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        trend={{ value: 15, isPositive: true }}
                    />

                    <StatsCard
                        title="Completed"
                        value={completedCourses}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />

                    <StatsCard
                        title="Avg. Progress"
                        value={`${Math.round(averageProgress)}%`}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        trend={{ value: 8, isPositive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Courses Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </button>
                        </div>

                        {courses.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                    Browse Courses
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        progress={courseProgress[course.id] || 0}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-1">
                        <RecentActivity activities={recentActivities} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;