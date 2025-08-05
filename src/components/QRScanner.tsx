import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      // Try back camera first (better for QR scanning)
      let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      }).catch(() => {
        // Fallback to any available camera
        return navigator.mediaDevices.getUserMedia({ video: true });
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        startScanning();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please use manual input.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
  };

  const startScanning = () => {
    setScanning(true);
    // Simulate QR code detection
    // In a real implementation, you would use a QR code library like jsQR
    const scanInterval = setInterval(() => {
      if (videoRef.current && canvasRef.current && scanning) {
        // This is a simulation - in reality, you'd process the video frame
        // For demo purposes, we'll just check if there's a QR code pattern
        
        // You can implement actual QR scanning here using libraries like:
        // - jsQR: https://github.com/cozmo/jsQR
        // - qr-scanner: https://github.com/nimiq/qr-scanner
        
        // For now, this is just a placeholder that would detect QR codes
        // The actual scanning would happen here
      }
    }, 100);

    // Cleanup interval when component unmounts or scanning stops
    return () => {
      clearInterval(scanInterval);
      setScanning(false);
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-4 border-2 border-green-400 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse"></div>
          
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1">
              {scanning ? 'Scanning for QR code...' : 'Position QR code in the frame'}
            </p>
          </div>

          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-sm">Starting camera...</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Point your camera at the QR code displayed by your lecturer
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}