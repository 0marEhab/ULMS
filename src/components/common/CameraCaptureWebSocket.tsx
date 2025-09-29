import React, { useEffect, useRef, useState } from "react";
import reference from "/reference.jpg";

const WS_URL = "wss://s8tj6p2j-8000.uks1.devtunnels.ms/api/v1/ws";

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [referenceImageBase64, setReferenceImageBase64] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Load reference image once
    fetchReferenceImage().then((dataUrl) => {
      setReferenceImageBase64(dataUrl);
    });

    // Initialize WebSocket
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("WebSocket connection open");
    };
    ws.onmessage = (event) => {
      console.log("WebSocket response:", event.data);
    };
    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };
    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();

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
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "400px" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
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
