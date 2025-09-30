import React, { useEffect, useRef, useState } from "react";
import reference from "/reference_image.jpg";

const WS_URL = "wss://s8tj6p2j-8000.uks1.devtunnels.ms/api/v1/ws";

interface CameraCaptureProps {
    size?: number;
    className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
    size = 200,
    className = ''
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
                className="rounded-full border-4 border-white shadow-lg"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: '#f3f4f6'
                }}
            />






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
