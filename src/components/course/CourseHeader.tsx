import React from 'react';

interface CourseHeaderProps {
    courseName: string;
    hasExam?: boolean;
    onTakeExam?: () => void;
    className?: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
    courseName,
    hasExam = false,
    onTakeExam,
    className = ''
}) => {
    return (
        <header className={`bg-white shadow-sm border-b ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{courseName}</h1>
                    </div>
                    <div className="flex space-x-4">
                        {hasExam && onTakeExam && (
                            <button
                                onClick={onTakeExam}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Take Exam
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CourseHeader;