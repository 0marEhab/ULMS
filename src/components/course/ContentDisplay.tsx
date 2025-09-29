import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Content } from '../../types';

interface ContentDisplayProps {
    content: Content;
    currentIndex: number;
    totalContent: number;
    onPrevious: () => void;
    onNext: () => void;
    className?: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
    content,
    currentIndex,
    totalContent,
    onPrevious,
    onNext,
    className = ''
}) => {
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < totalContent - 1;

    // Process the content text to handle escaped newlines and convert to proper markdown
    const processContentText = (text: string): string => {
        // Replace escaped newlines with actual newlines
        let processedText = text.replace(/\\n/g, '\n');

        // Handle bullet points that might not be properly formatted
        processedText = processedText.replace(/^•\s/gm, '- ');

        // Convert HTML strong tags to markdown if present
        processedText = processedText.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
        processedText = processedText.replace(/<\/strong>/g, '**');

        // Clean up any remaining HTML tags that might interfere
        processedText = processedText.replace(/<\/?[^>]+(>|$)/g, '');

        return processedText;
    };

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {content.title}
                </h2>
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-ul:pl-6">
                    <ReactMarkdown
                        components={{
                            // Custom styling for list items
                            li: ({ children }) => (
                                <li className="mb-2 text-gray-700">{children}</li>
                            ),
                            // Custom styling for paragraphs
                            p: ({ children }) => (
                                <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
                            ),
                            // Custom styling for strong text
                            strong: ({ children }) => (
                                <strong className="font-semibold text-gray-900">{children}</strong>
                            ),
                            // Custom styling for unordered lists
                            ul: ({ children }) => (
                                <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>
                            ),
                            // Custom styling for ordered lists
                            ol: ({ children }) => (
                                <ol className="mb-4 pl-6 space-y-2 list-decimal">{children}</ol>
                            )
                        }}
                    >
                        {processContentText(content.text)}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Content Navigation */}
            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-500">
                        {currentIndex + 1} of {totalContent}
                    </span>

                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentDisplay;