import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types';

interface CourseCardProps {
    course: Course;
    progress?: number; // 0-100 percentage
    className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    progress = 0,
    className = ''
}) => {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate(`/course/${course.id}`);
    };

    const handleExamClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (course.examId) {
            navigate(`/exam/${course.examId}`);
        }
    };

    // Dynamic gradient based on course ID for variety
    const getGradient = (id: number) => {
        const gradients = [
            'from-blue-500 via-blue-600 to-blue-700',
            'from-purple-500 via-purple-600 to-purple-700',
            'from-green-500 via-green-600 to-green-700',
            'from-orange-500 via-orange-600 to-orange-700',
            'from-pink-500 via-pink-600 to-pink-700',
            'from-indigo-500 via-indigo-600 to-indigo-700',
        ];
        const index = (id - 1) % gradients.length;
        return gradients[index];
    };

    const getProgressColor = (progress: number) => {
        if (progress === 0) return 'bg-gray-300';
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressText = (progress: number) => {
        if (progress === 0) return 'Not Started';
        if (progress === 100) return 'Completed';
        return `${Math.round(progress)}% Complete`;
    };

    return (
        <div className={`group relative ${className}`}>
            {/* Main Card */}
            <div
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                onClick={handleCourseClick}
            >
                {/* Course Header with Gradient */}
                <div className={`h-40 bg-gradient-to-br ${getGradient(course.id)} relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full opacity-20"></div>
                        <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full opacity-15"></div>
                        <div className="absolute top-8 left-20 w-6 h-6 bg-white rounded-full opacity-25"></div>
                    </div>

                    {/* Course Icon */}
                    <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>

                    {/* Exam Badge */}
                    {course.examId && (
                        <div className="absolute top-4 right-4">
                            <div className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Exam</span>
                            </div>
                        </div>
                    )}

                    {/* Course Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent">
                        <h3 className="text-white text-lg font-bold mb-1 line-clamp-2 leading-tight">
                            {course.name}
                        </h3>
                        <div className="flex items-center text-white/80 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>{course.content.length} lessons</span>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                    {/* Description */}
                    {course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {course.description}
                        </p>
                    )}

                    {/* Progress Section */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${progress === 100 ? 'bg-green-100 text-green-700' :
                                    progress > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {getProgressText(progress)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getProgressColor(progress)}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Est. 2-3 hours</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-5 7h4m-4 4h4" />
                                </svg>
                                <span>Updated {new Date(course.updatedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCourseClick}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                        >
                            {progress > 0 ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M12 20l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                    <span>Continue Learning</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M12 20l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                    <span>Start Course</span>
                                </>
                            )}
                        </button>

                        {course.examId && (
                            <button
                                onClick={handleExamClick}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Exam</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};

export default CourseCard;