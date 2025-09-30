import React from 'react';
import CameraCapture from '../common/CameraCaptureWebSocket';

/**
 * Example page showing the circular camera capture component
 */
const CircularCameraDemo: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Circular Camera with WebSocket</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Small Size */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Small (120px)</h3>
                    <div className="flex justify-center mb-4">
                        <CameraCapture size={120} />
                    </div>
                    <p className="text-sm text-gray-600">Compact size for sidebar or corner display</p>
                </div>

                {/* Medium Size */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Medium (200px)</h3>
                    <div className="flex justify-center mb-4">
                        <CameraCapture size={200} />
                    </div>
                    <p className="text-sm text-gray-600">Default size for general use</p>
                </div>

                {/* Large Size */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Large (300px)</h3>
                    <div className="flex justify-center mb-4">
                        <CameraCapture size={300} />
                    </div>
                    <p className="text-sm text-gray-600">Large size for detailed monitoring</p>
                </div>
            </div>

            {/* Feature Information */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Features</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">Visual Indicators</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>🔵 Blue dot: WebSocket connected</li>
                            <li>🔴 Red dot: WebSocket disconnected</li>
                            <li>🟢 Green dot: Camera active</li>
                            <li>📊 Frame counter: Shows captured frames</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Technical Details</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>Circular canvas rendering</li>
                            <li>WebSocket streaming to server</li>
                            <li>Reference image comparison</li>
                            <li>Random 5-10 second intervals</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Configuration */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Configuration</h3>
                <div className="space-y-2 text-sm">
                    <p><strong>WebSocket URL:</strong> <code>wss://s8tj6p2j-8000.uks1.devtunnels.ms/api/v1/ws</code></p>
                    <p><strong>Reference Image:</strong> <code>/reference.jpg</code></p>
                    <p><strong>Capture Format:</strong> PNG (Base64 encoded)</p>
                    <p><strong>Capture Interval:</strong> 5-10 seconds (randomized)</p>
                </div>
            </div>
        </div>
    );
};

export default CircularCameraDemo;