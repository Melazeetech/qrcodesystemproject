import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Type, AlertCircle, Smartphone } from 'lucide-react';
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasTriedCamera, setHasTriedCamera] = useState(false);

  useEffect(() => {
    if (isOpen && !hasTriedCamera) {
      // Auto-switch to manual input on hosted environments if camera fails quickly
      const timer = setTimeout(() => {
        if (!cameraReady && !error) {
          setError('Camera initialization taking too long. Please use manual input.');
          setShowManualInput(true);
        }
      }, 3000);

      startScanner();
      
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      stopScanner();
    }

    return () => stopScanner();
  }, [isOpen, hasTriedCamera, cameraReady, error]);

  const startScanner = async () => {
    if (!videoRef.current || hasTriedCamera) return;
    
    setError('');
    setCameraReady(false);
    setIsInitializing(true);
    setHasTriedCamera(true);
    
    try {
      // Check if we're on HTTPS or localhost
      const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      
      if (!isSecureContext) {
        throw new Error('Camera requires HTTPS connection');
      }

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      // Test camera permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());
      } catch (permissionError) {
        throw new Error('Camera permission denied or camera not available');
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          onScan(result.data);
          onClose();
        },
        {
          onDecodeError: (err) => {
            // Ignore decode errors - they happen when no QR code is visible
            console.log('Decode error (normal):', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
          calculateScanRegion: (video) => {
            // Create a centered square scan region
            const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
            const scanSize = Math.floor(smallerDimension * 0.6);
            return {
              x: Math.floor((video.videoWidth - scanSize) / 2),
              y: Math.floor((video.videoHeight - scanSize) / 2),
              width: scanSize,
              height: scanSize,
            };
          },
        }
      );

      await scanner.start();
      setQrScanner(scanner);
      setCameraReady(true);
      setIsInitializing(false);
      
    } catch (error: any) {
      console.error('Error starting QR scanner:', error);
      setIsInitializing(false);
      
      let errorMessage = 'Camera access failed. ';
      
      if (error.message.includes('permission') || error.message.includes('denied')) {
        errorMessage += 'Please allow camera permissions and refresh the page.';
      } else if (error.message.includes('HTTPS')) {
        errorMessage += 'Camera requires secure connection (HTTPS).';
      } else if (error.message.includes('not supported')) {
        errorMessage += 'Your browser does not support camera access.';
      } else {
        errorMessage += 'Please use manual input instead.';
      }
      
      setError(errorMessage);
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
    setIsInitializing(false);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      onClose();
    }
  };

  const resetAndTryAgain = () => {
    setHasTriedCamera(false);
    setError('');
    setShowManualInput(false);
    setCameraReady(false);
    setIsInitializing(false);
    stopScanner();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {!showManualInput ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                {error ? (
                  <div className="h-64 flex flex-col items-center justify-center text-white bg-red-900 p-4">
                    <AlertCircle className="w-16 h-16 mb-4 text-red-300" />
                    <p className="text-sm text-center mb-4 text-red-100">{error}</p>
                    <div className="flex flex-col space-y-2 w-full max-w-xs">
                      <button
                        onClick={() => setShowManualInput(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Use Manual Input
                      </button>
                      <button
                        onClick={resetAndTryAgain}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                      >
                        Try Camera Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      style={{ display: cameraReady ? 'block' : 'none' }}
                      playsInline
                      muted
                    />
                    
                    {(isInitializing || !cameraReady) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
                        <Camera className="w-16 h-16 mb-4" />
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm text-center px-4">
                          {isInitializing ? 'Initializing camera...' : 'Starting camera...'}
                        </p>
                        <p className="text-xs text-gray-300 mt-2 text-center px-4">
                          If this takes too long, try manual input
                        </p>
                      </div>
                    )}

                    {cameraReady && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Scan region overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-green-400 rounded-lg bg-transparent">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                          </div>
                        </div>
                        {/* Scanning line animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 relative overflow-hidden">
                            <div className="absolute w-full h-0.5 bg-green-400 animate-pulse" style={{
                              animation: 'scan 2s linear infinite',
                              top: '50%'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-3 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 mr-2" />
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

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Tips for better scanning:</h4>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• Hold your phone steady</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep QR code within the green frame</li>
                  <li>• Move closer or further if needed</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Type className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Manual QR Code Entry</h4>
                <p className="text-sm text-gray-600">
                  Ask your lecturer to share the QR code data with you
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code Data:
                </label>
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>

              {/* Manual input instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <h4 className="font-medium text-yellow-900 mb-1">How to get QR code data:</h4>
                <ul className="text-yellow-800 space-y-1 text-xs">
                  <li>• Ask your lecturer to show the debug code</li>
                  <li>• Or ask them to share it via WhatsApp/email</li>
                  <li>• Copy and paste the entire code here</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}