import React, { useRef, useEffect, useState } from 'react';

interface CameraCanvasProps {
    size?: number;
    className?: string;
    onCameraReady?: (stream: MediaStream) => void;
    onError?: (error: string) => void;
    onCameraStopped?: () => void;
}

const CameraCanvas: React.FC<CameraCanvasProps> = ({
    size = 200,
    className = '',
    onCameraReady,
    onError,
    onCameraStopped
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationRef = useRef<number | null>(null);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }

            setStream(mediaStream);
            setIsPermissionGranted(true);
            setError(null);

            if (onCameraReady) {
                onCameraReady(mediaStream);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
            setError(errorMessage);
            setIsPermissionGranted(false);

            if (onError) {
                onError(errorMessage);
            }

            console.error('Camera access error:', err);
        }
    };

    const drawVideoToCanvas = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Stop animation if camera is not active or elements are missing
        if (!canvas || !video || !isPermissionGranted || video.readyState !== video.HAVE_ENOUGH_DATA) {
            if (isPermissionGranted && video && video.readyState < video.HAVE_ENOUGH_DATA) {
                // Keep trying if video is loading
                animationRef.current = requestAnimationFrame(drawVideoToCanvas);
            }
            return;
        }

        const ctx = canvas.getContext('2d');
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

        // Continue animation only if camera is still active
        if (isPermissionGranted) {
            animationRef.current = requestAnimationFrame(drawVideoToCanvas);
        }
    };

    const stopCamera = () => {
        // Stop animation frame
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        // Stop video stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        // Clear video source
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsPermissionGranted(false);
        setError(null);

        if (onCameraStopped) {
            onCameraStopped();
        }
    };

    useEffect(() => {
        if (isPermissionGranted && videoRef.current) {
            const videoElement = videoRef.current;
            const handleLoadedMetadata = () => {
                drawVideoToCanvas();
            };

            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [isPermissionGranted]);

    // Cleanup effect - only runs when component unmounts
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handlePermissionRequest = () => {
        startCamera();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Hidden video element */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
                muted
            />

            {/* Canvas for circular display */}
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="rounded-full border-4 border-white shadow-lg"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: '#f3f4f6'
                }}
            />

            {/* Permission overlay */}
            {!isPermissionGranted && !error && (
                <div
                    className="absolute inset-0 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={handlePermissionRequest}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                >
                    <div className="text-center">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-600">Click to enable camera</p>
                    </div>
                </div>
            )}

            {/* Error overlay */}
            {error && (
                <div
                    className="absolute inset-0 rounded-full bg-red-100 border-4 border-white shadow-lg flex items-center justify-center"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                >
                    <div className="text-center p-4">
                        <svg className="w-6 h-6 mx-auto text-red-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-xs text-red-600 text-center">Camera access denied</p>
                    </div>
                </div>
            )}

            {/* Camera status indicator and toggle */}
            {isPermissionGranted && (
                <>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                        <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <button
                        onClick={stopCamera}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-colors"
                        title="Turn off camera"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-4.95-4.95m0 0L5.636 5.636M13.05 16.05L5.636 5.636" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
};

export default CameraCanvas;