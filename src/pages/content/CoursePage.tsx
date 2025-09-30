import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, mockData } from '../../services/api';
import type { Course } from '../../types';
import {
    LoadingSpinner,
    ErrorMessage,
    ContentNavigation,
    ContentDisplay
} from '../../components';
import { AIChatbot, AIAssistantButton } from '../../components/course';

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    // Fetch course data from API or use mock data
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const courseIdNum = parseInt(courseId || '1');

                let courseData: Course;

                // Use real API if environment variable is set to disable mock data
                if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'false') {
                    courseData = await courseAPI.getCourse(courseIdNum);
                } else {
                    // Mock data for development
                    courseData = mockData.getCourse(courseIdNum);
                }

                setCourse(courseData);
                if (courseData.content.length > 0) {
                    setSelectedContentId(courseData.content[0].id);
                }
            } catch (err) {
                setError('Failed to load course data');
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const handleTakeExam = (examId?: number) => {
        if (examId) {
            navigate(`/exam/${examId}`);
        } else if (course?.exams && course.exams.length > 0) {
            navigate(`/exam/${course.exams[0].id}`);
        }
    };

    const handleOpenChatbot = () => {
        setIsChatbotOpen(true);
    };

    const handleCloseChatbot = () => {
        setIsChatbotOpen(false);
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

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ErrorMessage
                    title="Course Not Found"
                    message="The requested course could not be found."
                />
            </div>
        );
    }

    const selectedContent = course.content.find(content => content.id === selectedContentId);
    const currentIndex = course.content.findIndex(c => c.id === selectedContentId);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setSelectedContentId(course.content[currentIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (currentIndex < course.content.length - 1) {
            setSelectedContentId(course.content[currentIndex + 1].id);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Course Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
                    {course.description && (
                        <p className="text-gray-600">{course.description}</p>
                    )}
                    {course.exams && course.exams.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {course.exams.map((exam) => (
                                <button
                                    key={exam.id}
                                    onClick={() => handleTakeExam(exam.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors mr-3"
                                >
                                    Take {exam.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Content Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <ContentNavigation
                            content={course.content}
                            selectedContentId={selectedContentId}
                            onContentSelect={setSelectedContentId}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {selectedContent && (
                            <ContentDisplay
                                content={selectedContent}
                                currentIndex={currentIndex}
                                totalContent={course.content.length}
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant Button */}
            <AIAssistantButton onClick={handleOpenChatbot} />

            {/* AI Chatbot Modal */}
            <AIChatbot
                isOpen={isChatbotOpen}
                onClose={handleCloseChatbot}
                courseId={course.id}
                contentId={selectedContentId || undefined}
            />
        </>
    );
};

export default CoursePage;