import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, mockData } from '../../services/api';
import type { Exam, LocalExamResult } from '../../types';
import {
    LoadingSpinner,
    ErrorMessage,
    QuestionCard,
    ExamTimer,
    ExamResults
} from '../../components';
import { calculateExamResult, minutesToSeconds } from '../../utils';

import CameraCaptureWebSocket from '../../components/common/CameraCaptureWebSocket';
import AlertDashboard from '../../components/monitoring/AlertDashboard';
import type { SuspiciousAlert } from '../../types/alerts';

const ExamPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, number>>(new Map());
    const [showResults, setShowResults] = useState(false);
    const [examResult, setExamResult] = useState<LocalExamResult | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousAlert[]>([]);
    const [showAlertDashboard, setShowAlertDashboard] = useState(false);

    // Fetch exam data from API or use mock data
    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const examIdNum = parseInt(examId || '1');

                let examData: Exam;

                // Use real API if environment variable is set to disable mock data
                if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'false') {
                    examData = await examAPI.getExam(examIdNum);
                } else {
                    // Mock data for development
                    examData = mockData.getExam(examIdNum);
                }

                setExam(examData);
                if (examData.timeLimit) {
                    setTimeRemaining(minutesToSeconds(examData.timeLimit));
                }
            } catch (err) {
                setError('Failed to load exam data');
                console.error('Error fetching exam:', err);
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchExam();
        }
    }, [examId]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !showResults) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmitExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, showResults]);

    // Cleanup camera stream when component unmounts or exam ends
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Stop camera when exam is submitted
    useEffect(() => {
        if (showResults && cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }, [showResults, cameraStream]);

    const handleAnswerSelect = (choiceIndex: number) => {
        if (!exam || showResults) return;

        const currentQuestion = exam.questions[currentQuestionIndex];
        setAnswers(prev => new Map(prev.set(currentQuestion.id, choiceIndex)));
    };

    const handleNextQuestion = () => {
        if (!exam) return;

        if (currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Handle suspicious activity detection
    const handleSuspiciousActivity = (alert: SuspiciousAlert) => {
        console.warn('Suspicious activity detected:', alert);

        setSuspiciousActivities(prev => [...prev, alert]);

        // Auto-show alert dashboard for high severity alerts
        if (alert.severity === 'high') {
            setShowAlertDashboard(true);
        }

        // Log to backend for instructor monitoring
        try {
            // In a real implementation, you would send this to your backend
            fetch('/api/exam/suspicious-activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId,
                    studentId: 'current-student-id', // Get from user context
                    alert,
                    timestamp: Date.now()
                })
            }).catch(err => console.error('Failed to log suspicious activity:', err));
        } catch (error) {
            console.error('Error logging suspicious activity:', error);
        }
    };

    // Handle alert dismissal
    const handleAlertDismiss = (index: number) => {
        setSuspiciousActivities(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitExam = () => {
        if (!exam) return;

        const result = calculateExamResult(
            exam.questions,
            answers,
            exam.passingScore || 60
        );

        setExamResult(result);
        setShowResults(true);
    };

    const handleBackToCourse = () => {
        if (exam) {
            navigate(`/course/${exam.courseId}`);
        }
    };

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

    if (!exam) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ErrorMessage
                    title="Exam Not Found"
                    message="The requested exam could not be found."
                />
            </div>
        );
    }

    if (showResults && examResult) {
        return (
            <ExamResults
                exam={{
                    id: exam.id,
                    title: exam.title,
                    courseName: exam.courseName,
                    questions: exam.questions
                }}
                result={examResult}
                onBackToCourse={handleBackToCourse}
            />
        );
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    const selectedAnswer = answers.get(currentQuestion.id);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Exam Header with Camera */}
            <div className="mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
                        <p className="text-gray-600 mt-1">{exam.courseName}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-center space-y-2">

                            <CameraCaptureWebSocket
                                onSuspiciousActivity={handleSuspiciousActivity}
                                size={180}
                            />

                            {/* Suspicious Activity Alert Button */}
                            {suspiciousActivities.length > 0 && (
                                <button
                                    onClick={() => setShowAlertDashboard(!showAlertDashboard)}
                                    className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${suspiciousActivities.some(a => a.severity === 'high')
                                            ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0l-6.918 7.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span>{suspiciousActivities.length} Alert{suspiciousActivities.length > 1 ? 's' : ''}</span>
                                    </div>
                                </button>
                            )}

                            {/* Alert Dashboard */}
                            {showAlertDashboard && (
                                <div className="absolute top-0 left-full ml-4 w-96 z-10">
                                    <AlertDashboard
                                        alerts={suspiciousActivities}
                                        onAlertDismiss={handleAlertDismiss}
                                    />
                                </div>
                            )}
                        </div>
                        {/* Timer */}
                        {exam.timeLimit && (
                            <ExamTimer
                                timeRemaining={timeRemaining}
                                timeLimit={exam.timeLimit}
                                onTimeUp={handleSubmitExam}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Question */}
            <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
            />

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <div className="flex space-x-3">
                    {currentQuestionIndex === exam.questions.length - 1 ? (
                        <button
                            onClick={handleSubmitExam}
                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                        >
                            Submit Exam
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamPage;