import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setError('');
    setCameraReady(false);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      let mediaStream;
      
      try {
        // Try back camera first (better for QR scanning)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
      } catch (backCameraError) {
        console.log('Back camera not available, trying front camera');
        // Fallback to front camera
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setCameraReady(true);
          }).catch((playError) => {
            console.error('Error playing video:', playError);
            setError('Failed to start camera preview');
          });
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraReady(false);
    setError('');
  };

  const handleManualInput = () => {
    const input = prompt('Enter QR code manually:');
    if (input && input.trim()) {
      onScan(input.trim());
      onClose();
    }
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
          {error ? (
            <div className="h-64 flex flex-col items-center justify-center text-white bg-red-900">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-sm text-center px-4">{error}</p>
              <button
                onClick={handleManualInput}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Manual Input
              </button>
            </div>
          ) : !cameraReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
              <Camera className="w-16 h-16 mb-4" />
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm">Starting camera...</p>
            </div>
          ) : null}
          
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
            style={{ display: cameraReady ? 'block' : 'none' }}
          />
          
          {cameraReady && (
            <>
              {/* Scanning overlay */}
              <div className="absolute inset-4 border-2 border-green-400 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1">
                  Position QR code in the green frame
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Point your camera at the QR code displayed by your lecturer
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleManualInput}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manual Input
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
