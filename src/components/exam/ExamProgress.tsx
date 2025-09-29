import React from 'react';

interface ExamProgressProps {
    current: number;
    total: number;
    answered: number;
    className?: string;
}

const ExamProgress: React.FC<ExamProgressProps> = ({
    current,
    total,
    answered,
    className = ''
}) => {
    const progressPercentage = (current / total) * 100;
    const answeredPercentage = (answered / total) * 100;

    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                    Question {current} of {total}
                </span>
                <span className="text-sm text-gray-500">
                    {answered} of {total} answered ({Math.round(answeredPercentage)}%)
                </span>
            </div>

            {/* Progress bar container */}
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                {/* Current position indicator */}
                <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300 relative"
                    style={{ width: `${progressPercentage}%` }}
                >
                    {/* Answered questions overlay */}
                    <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${(answered / current) * 100}%` }}
                    />
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                        <span>Current Progress</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>Answered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamProgress;