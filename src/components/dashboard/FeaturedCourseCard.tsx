import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types';

interface FeaturedCourseCardProps {
    course: Course;
    progress?: number;
    featured?: boolean;
    className?: string;
}

const FeaturedCourseCard: React.FC<FeaturedCourseCardProps> = ({
    course,
    progress = 0,
    featured = false,
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

    return (
        <div className={`group relative ${className}`}>
            {/* Featured Badge */}
            {featured && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        ⭐ Featured
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative"
                onClick={handleCourseClick}
            >
                {/* Large Gradient Header */}
                <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-8 right-8 w-32 h-32 bg-white rounded-full opacity-10"></div>
                        <div className="absolute bottom-4 right-12 w-20 h-20 bg-white rounded-full opacity-15"></div>
                        <div className="absolute top-12 left-16 w-8 h-8 bg-white rounded-full opacity-25"></div>
                        <div className="absolute bottom-16 left-8 w-12 h-12 bg-white rounded-full opacity-20"></div>
                    </div>

                    {/* Course Category Badge */}
                    <div className="absolute top-6 left-6">
                        <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                            Computer Science
                        </span>
                    </div>

                    {/* Exam Badge */}
                    {course.examId && (
                        <div className="absolute top-6 right-6">
                            <div className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Exam Available</span>
                            </div>
                        </div>
                    )}

                    {/* Course Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
                        <h3 className="text-white text-2xl font-bold mb-2 leading-tight">
                            {course.name}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm space-x-4">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>{course.content.length} lessons</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>3-4 hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                    {/* Description */}
                    <p className="text-gray-600 text-base mb-6 leading-relaxed">
                        {course.description || "Enhance your skills with this comprehensive course designed for modern learners."}
                    </p>

                    {/* Progress Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${progress === 100 ? 'bg-green-100 text-green-700' :
                                    progress > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {progress === 0 ? 'Not Started' : progress === 100 ? 'Completed' : `${Math.round(progress)}% Complete`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-3 rounded-full transition-all duration-700 ease-out ${progress === 0 ? 'bg-gray-300' :
                                        progress < 30 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                                            progress < 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                                'bg-gradient-to-r from-green-400 to-green-500'
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCourseClick}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                        >
                            {progress > 0 ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3-3 3m-6-3h12" />
                                    </svg>
                                    <span>Continue Learning</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M12 20l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                    <span>Start Course</span>
                                </>
                            )}
                        </button>

                        {course.examId && (
                            <button
                                onClick={handleExamClick}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Take Exam</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};

export default FeaturedCourseCard;