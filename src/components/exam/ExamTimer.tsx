import React from 'react';
import { formatTime, isTimeRunningLow, isTimeCritical } from '../../utils';

interface ExamTimerProps {
    timeRemaining: number;
    timeLimit?: number;
    onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
    timeRemaining,
    timeLimit,
    onTimeUp
}) => {
    React.useEffect(() => {
        if (timeRemaining <= 0) {
            onTimeUp();
        }
    }, [timeRemaining, onTimeUp]);

    const getTimerColor = () => {
        if (isTimeCritical(timeRemaining)) return 'text-red-600';
        if (isTimeRunningLow(timeRemaining)) return 'text-orange-600';
        return 'text-blue-600';
    };

    const getTimerBackground = () => {
        if (isTimeCritical(timeRemaining)) return 'bg-red-50 border-red-200';
        if (isTimeRunningLow(timeRemaining)) return 'bg-orange-50 border-orange-200';
        return 'bg-blue-50 border-blue-200';
    };

    if (!timeLimit) return null;

    return (
        <div className={`text-right p-3 rounded-lg border ${getTimerBackground()}`}>
            <div className={`text-lg font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-gray-500">Time Remaining</div>
            {isTimeRunningLow(timeRemaining) && (
                <div className="text-xs text-orange-600 mt-1">
                    {isTimeCritical(timeRemaining) ? 'Time almost up!' : 'Time running low'}
                </div>
            )}
        </div>
    );
};

export default ExamTimer;