import React, { useState } from 'react';
import type { SuspiciousAlert } from '../../types/alerts';

interface AlertDashboardProps {
    alerts: SuspiciousAlert[];
    onAlertDismiss?: (index: number) => void;
    onAlertAction?: (alert: SuspiciousAlert, action: string) => void;
}

const AlertDashboard: React.FC<AlertDashboardProps> = ({
    alerts,
    onAlertDismiss,
    onAlertAction
}) => {
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredAlerts = alerts.filter(alert =>
        filter === 'all' || alert.severity === filter
    );

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'no_face':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                );
            case 'multiple_faces':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'face_mismatch':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0l-6.918 7.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">No suspicious activity detected</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            {alerts.filter(a => a.severity === 'high').length} High Priority
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Filter Buttons */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                            <option value="all">All Alerts</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <svg className={`w-5 h-5 transform ${isExpanded ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Alert List */}
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-48 overflow-hidden'}`}>
                {filteredAlerts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No alerts match the current filter
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredAlerts.map((alert, index) => (
                            <div key={index} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className={`mt-1 ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                                            {getAlertIcon(alert.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-gray-900">
                                                    {alert.message}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {alert.studentName && (
                                                    <span className="mr-4">Student: {alert.studentName}</span>
                                                )}
                                                <span>Time: {formatTimestamp(alert.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        {alert.severity === 'high' && onAlertAction && (
                                            <button
                                                onClick={() => onAlertAction(alert, 'investigate')}
                                                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                                            >
                                                Investigate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onAlertDismiss?.(index)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                    <span>Total: {alerts.length} alerts</span>
                    <div className="flex space-x-4">
                        <span className="text-red-600">High: {alerts.filter(a => a.severity === 'high').length}</span>
                        <span className="text-yellow-600">Medium: {alerts.filter(a => a.severity === 'medium').length}</span>
                        <span className="text-blue-600">Low: {alerts.filter(a => a.severity === 'low').length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertDashboard;