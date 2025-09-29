import React from 'react';
import type { Content } from '../../types';

interface ContentNavigationProps {
    content: Content[];
    selectedContentId: number | null;
    onContentSelect: (contentId: number) => void;
    className?: string;
}

const ContentNavigation: React.FC<ContentNavigationProps> = ({
    content,
    selectedContentId,
    onContentSelect,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
            <nav className="space-y-2">
                {content.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => onContentSelect(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedContentId === item.id
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center">
                            <span className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">
                                {index + 1}
                            </span>
                            <span className="truncate">{item.title}</span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ContentNavigation;