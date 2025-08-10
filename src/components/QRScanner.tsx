import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Type } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [isOpen]);

  const checkCameraAccess = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      if (!hasCamera) throw new Error('No camera detected.');
    } catch {
      throw new Error('Camera permission denied or unavailable.');
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) return;

    setError('');
    setCameraReady(false);

    // Check HTTPS requirement
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Camera access requires HTTPS. Please use a secure connection.');
      setShowManualInput(true);
      return;
    }

    try {
      await checkCameraAccess();

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          onScan(result.data);
          onClose();
        },
        {
          onDecodeError: (err) => {
            console.log('Decode error (normal):', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
        }
      );

      await scanner.start();

      // Force facing mode for mobile
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;

      setQrScanner(scanner);
      setCameraReady(true);

    } catch (error: any) {
      console.error('Error starting QR scanner:', error);
      setError(error.message || 'Camera access denied or not available. Please use manual input.');
      setShowManualInput(true);
    }
  };

  const stopScanner = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setCameraReady(false);
    setError('');
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {!showManualInput ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                {error ? (
                  <div className="h-64 flex flex-col items-center justify-center text-white bg-red-900">
                    <Camera className="w-16 h-16 mb-4" />
                    <p className="text-sm text-center px-4 mb-4">{error}</p>
                    <button
                      onClick={() => setShowManualInput(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Use Manual Input
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      style={{ display: cameraReady ? 'block' : 'none' }}
                    />

                    {!cameraReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
                        <Camera className="w-16 h-16 mb-4" />
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm">Starting camera...</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Point your camera at the QR code displayed by your lecturer
                </p>
                <button
                  onClick={() => setShowManualInput(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Manual Input
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code Data:
                </label>
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Paste the QR code data here..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Camera
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualInput.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
