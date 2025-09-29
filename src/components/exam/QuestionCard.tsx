import React from 'react';
import type { Question } from '../../types';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    selectedAnswer?: number;
    onAnswerSelect: (choiceIndex: number) => void;
    disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionNumber,
    selectedAnswer,
    onAnswerSelect,
    disabled = false
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {questionNumber}. {question.context}
            </h2>

            <div className="space-y-3">
                {question.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => !disabled && onAnswerSelect(index)}
                        disabled={disabled}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${selectedAnswer === index
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswer === index
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                                }`}>
                                {selectedAnswer === index && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                            <span>{choice}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;