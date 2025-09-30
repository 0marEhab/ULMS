import React from 'react';
import type { LocalExamResult, Question } from '../../types';
import { calculatePercentage, getExamFeedback, getLetterGrade } from '../../utils';

interface ExamResultsProps {
    exam: {
        id: number;
        title: string;
        courseName: string;
        questions: Question[];
    };
    result: LocalExamResult;
    onBackToCourse: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({
    exam,
    result,
    onBackToCourse
}) => {
    const percentage = calculatePercentage(result.score, result.totalQuestions);
    const letterGrade = getLetterGrade(percentage);
    const feedback = getExamFeedback(percentage, result.passed);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
                        <button
                            onClick={onBackToCourse}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Back to Course
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-8">
                    {/* Score Summary */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            <span className={`text-3xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {percentage}%
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${result.passed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                Grade: {letterGrade}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {result.passed ? 'Congratulations!' : 'Keep Studying!'}
                        </h2>

                        <p className="text-gray-600 mb-2">
                            You scored {result.score} out of {result.totalQuestions} questions correctly.
                        </p>

                        <p className={`font-medium ${result.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {feedback}
                        </p>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
                        {exam.questions.map((question, index) => {
                            const answer = result.answers.find(a => a.questionId === question.id);
                            const isCorrect = answer?.correct ?? false;
                            const selectedChoice = answer?.selectedChoice ?? -1;

                            return (
                                <div key={question.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">
                                            {index + 1}. {question.context}
                                        </h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {question.choices.map((choice, choiceIndex) => {
                                            const isCorrectAnswer = choiceIndex === question.answer;
                                            const isSelectedAnswer = selectedChoice === choiceIndex;

                                            let choiceClass = 'p-2 rounded text-sm ';

                                            if (isCorrectAnswer) {
                                                choiceClass += 'bg-green-50 border border-green-200 text-green-800';
                                            } else if (isSelectedAnswer && !isCorrectAnswer) {
                                                choiceClass += 'bg-red-50 border border-red-200 text-red-800';
                                            } else {
                                                choiceClass += 'bg-gray-50';
                                            }

                                            return (
                                                <div key={choiceIndex} className={choiceClass}>
                                                    {choice}
                                                    {isCorrectAnswer && (
                                                        <span className="ml-2 text-green-600 font-medium">✓ Correct Answer</span>
                                                    )}
                                                    {isSelectedAnswer && !isCorrectAnswer && (
                                                        <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {question.explanation && (
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-sm text-blue-800">
                                                <strong>Explanation:</strong> {question.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={onBackToCourse}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                        >
                            Back to Course
                        </button>
                        {!result.passed && (
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                            >
                                Retake Exam
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamResults;