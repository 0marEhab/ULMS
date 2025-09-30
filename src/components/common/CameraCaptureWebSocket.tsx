import React, { useEffect, useRef, useState } from "react";
import reference from "/reference_image.jpg";
import type { SuspiciousAlert, WebSocketResponse } from "../../types/alerts";

const WS_URL = "wss://s8tj6p2j-8000.uks1.devtunnels.ms/api/v1/ws";

interface CameraCaptureProps {
    size?: number;
    className?: string;
    onSuspiciousActivity?: (alert: SuspiciousAlert) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
    size = 200,
    className = '',
    onSuspiciousActivity
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [referenceImageBase64, setReferenceImageBase64] = useState<
        string | null
    >(null);
    const [isConnected, setIsConnected] = useState(false);
    const [frameCount, setFrameCount] = useState(0);
    const [currentAlert, setCurrentAlert] = useState<SuspiciousAlert | null>(null);
    const [alertHistory, setAlertHistory] = useState<SuspiciousAlert[]>([]);

    // Function to process suspicious activity alerts
    const processSuspiciousActivity = (response: WebSocketResponse) => {
        let alert: SuspiciousAlert | null = null;

        if (response.face_count === 0) {
            alert = {
                id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'no_face',
                message: 'No face detected in the frame',
                timestamp: Date.now(),
                severity: 'high'
            };
        } else if (response.multiple_faces || response.face_count > 1) {
            alert = {
                id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'multiple_faces',
                message: `Multiple faces detected (${response.face_count} faces)`,
                timestamp: Date.now(),
                severity: 'high'
            };
        } else if (!response.match && response.face_count === 1) {
            alert = {
                id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'face_mismatch',
                message: 'Face does not match reference image',
                timestamp: Date.now(),
                severity: 'medium'
            };
        } else if (response.error) {
            alert = {
                id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'error',
                message: response.error,
                timestamp: Date.now(),
                severity: 'medium'
            };
        }

        if (alert) {
            setCurrentAlert(alert);
            setAlertHistory(prev => [...prev, alert!]);

            // Call parent callback if provided
            if (onSuspiciousActivity) {
                onSuspiciousActivity(alert);
            }

            // Play alert sound
            playAlertSound(alert.severity);

            // Auto-clear alert after 5 seconds
            setTimeout(() => {
                setCurrentAlert(null);
            }, 5000);
        }
    };

    // Function to play alert sound
    const playAlertSound = (severity: 'low' | 'medium' | 'high') => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Different frequencies for different severities
            oscillator.frequency.setValueAtTime(
                severity === 'high' ? 800 : severity === 'medium' ? 600 : 400,
                context.currentTime
            );

            gainNode.gain.setValueAtTime(0.3, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.5);
        } catch (error) {
            console.warn('Could not play alert sound:', error);
        }
    };

    // Function to draw video to circular canvas
    const drawVideoToCanvas = () => {
        const video = videoRef.current;
        const displayCanvas = displayCanvasRef.current;

        if (!video || !displayCanvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
            animationRef.current = requestAnimationFrame(drawVideoToCanvas);
            return;
        }

        const ctx = displayCanvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Create circular clipping path
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();

        // Calculate dimensions to maintain aspect ratio and fill circle
        const aspectRatio = video.videoWidth / video.videoHeight;
        let drawWidth, drawHeight, drawX, drawY;

        if (aspectRatio > 1) {
            // Video is wider than tall
            drawHeight = size;
            drawWidth = size * aspectRatio;
            drawX = -(drawWidth - size) / 2;
            drawY = 0;
        } else {
            // Video is taller than wide
            drawWidth = size;
            drawHeight = size / aspectRatio;
            drawX = 0;
            drawY = -(drawHeight - size) / 2;
        }

        // Draw video frame
        ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();

        // Continue animation
        animationRef.current = requestAnimationFrame(drawVideoToCanvas);
    };

    useEffect(() => {
        // Load reference image once
        fetchReferenceImage().then((dataUrl) => {
            setReferenceImageBase64(dataUrl);
        });

        // Initialize WebSocket
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("WebSocket connection open");
            setIsConnected(true);
        };
        ws.onmessage = (event) => {
            console.log("WebSocket response:", event.data);
            try {
                const response: WebSocketResponse = JSON.parse(event.data);
                processSuspiciousActivity(response);
            } catch (error) {
                console.error("Error parsing WebSocket response:", error);
            }
        };
        ws.onerror = (e) => {
            console.error("WebSocket error:", e);
            setIsConnected(false);
        };
        ws.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
        };
        setSocket(ws);

        // Cleanup on unmount
        return () => {
            ws.close();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current!.srcObject = stream;
                videoRef.current!.play();

                // Start circular video rendering
                videoRef.current!.addEventListener('loadedmetadata', () => {
                    drawVideoToCanvas();
                });

                const captureInterval = () => {
                    const delay = 5000 + Math.random() * 5000; // 5-10 sec
                    setTimeout(() => {
                        captureFrame();
                        captureInterval();
                    }, delay);
                };

                captureInterval();
            })
            .catch(console.error);
    }, [referenceImageBase64, socket]);

    const captureFrame = () => {
        if (
            !videoRef.current ||
            !canvasRef.current ||
            !referenceImageBase64 ||
            !socket
        )
            return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameDataUrl = canvas.toDataURL("image/png");

        const payload = {
            reference_image: referenceImageBase64,
            frame_image: frameDataUrl,
        };

        socket.send(JSON.stringify(payload));
        setFrameCount(prev => prev + 1);
        console.log(`Frame ${frameCount + 1} sent to WebSocket`);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Hidden video element */}
            <video
                ref={videoRef}
                style={{ display: "none" }}
                playsInline
                muted
            />

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Circular display canvas */}
            <canvas
                ref={displayCanvasRef}
                width={size}
                height={size}
                className={`rounded-full border-4 shadow-lg transition-all duration-300 ${currentAlert?.severity === 'high' ? 'border-red-500 animate-pulse' :
                    currentAlert?.severity === 'medium' ? 'border-yellow-500' :
                        isConnected ? 'border-green-500' : 'border-gray-300'
                    }`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: '#f3f4f6'
                }}
            />

            {/* Connection Status Indicator */}
            <div className="absolute top-2 right-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                    } shadow-sm`} title={isConnected ? 'Connected' : 'Disconnected'} />
            </div>

            {/* Frame Counter */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-mono">
                {frameCount}
            </div>

            {/* Suspicious Activity Alert */}
            {currentAlert && (
                <div className={`absolute -bottom-16 left-1/2 transform -translate-x-1/2 min-w-max px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium animate-bounce ${currentAlert.severity === 'high' ? 'bg-red-600' :
                    currentAlert.severity === 'medium' ? 'bg-yellow-600' :
                        'bg-blue-600'
                    }`}>
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0l-6.918 7.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>{currentAlert.message}</span>
                        <button
                            onClick={() => setCurrentAlert(null)}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Alert History Summary */}
            {alertHistory.length > 0 && (
                <div className="absolute -top-8 left-0 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                    Alerts: {alertHistory.length}
                    <span className="ml-2 text-red-400">
                        {alertHistory.filter(a => a.severity === 'high').length} High
                    </span>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;

// Helper
const fetchReferenceImage = async (): Promise<string | null> => {
    try {
        const res = await fetch(reference);
        const blob = await res.blob();
        return await blobToBase64(blob);
    } catch (err) {
        console.error(err);
        return null;
    }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
