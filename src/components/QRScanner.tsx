import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Type, AlertCircle, Smartphone } from 'lucide-react';
import QrScanner from 'qr-scanner';

// Define the props for the QRScanner component
interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  // A ref to hold the video element for the camera feed
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State to manage the QrScanner instance
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  
  // State to track if the camera is ready and displaying the feed
  const [cameraReady, setCameraReady] = useState(false);
  
  // State to hold any error messages
  const [error, setError] = useState<string>('');
  
  // State to toggle between camera view and manual input
  const [showManualInput, setShowManualInput] = useState(false);
  
  // State for the value of the manual input field
  const [manualInput, setManualInput] = useState('');
  
  // State for the camera initialization process
  const [isInitializing, setIsInitializing] = useState(false);

  // The main effect to control the scanner lifecycle
  useEffect(() => {
    // If the scanner modal is open and we have a video element
    if (isOpen && videoRef.current) {
      setIsInitializing(true);
      setError('');
      setShowManualInput(false);
      setCameraReady(false);
      
      const videoElement = videoRef.current;

      // Start the scanner in an async function
      const startScanner = async () => {
        try {
          // The QrScanner library handles camera access, so we don't need a separate getUserMedia call.
          // It will automatically prompt for permissions and start the video stream.
          const scanner = new QrScanner(
            videoElement,
            (result) => {
              // A QR code was successfully scanned
              onScan(result.data);
              onClose();
            },
            {
              onDecodeError: (err) => {
                // Ignore decode errors, as they are normal when no QR code is in view
              },
              highlightScanRegion: true,
              highlightCodeOutline: true,
              preferredCamera: 'environment', // Use the back camera on mobile devices
            }
          );
          
          await scanner.start();
          setQrScanner(scanner);
          setCameraReady(true);
          setIsInitializing(false);

        } catch (err: any) {
          // Handle any errors during camera initialization or permission denial
          console.error('Error starting QR scanner:', err);
          setIsInitializing(false);

          let errorMessage = 'Camera access failed. ';
          if (err.message.includes('permission') || err.message.includes('denied')) {
            errorMessage += 'Please allow camera permissions and refresh the page.';
          } else if (err.message.includes('HTTPS')) {
            errorMessage += 'Camera requires a secure connection (HTTPS).';
          } else if (err.message.includes('not supported')) {
            errorMessage += 'Your browser does not support camera access.';
          } else {
            errorMessage += 'Please use manual input instead.';
          }
          setError(errorMessage);
          setShowManualInput(true);
        }
      };

      startScanner();

      // Cleanup function to stop and destroy the scanner when the modal closes
      return () => {
        if (qrScanner) {
          qrScanner.stop();
          qrScanner.destroy();
          setQrScanner(null);
        }
      };
    } else if (!isOpen && qrScanner) {
      // If the modal is closed but the scanner is still active, stop it
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
  }, [isOpen, onScan, onClose, qrScanner]); // The effect re-runs when isOpen changes

  // Function to handle the manual form submission
  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      onClose();
    }
  };

  // Reset the state to try the camera again
  const resetAndTryAgain = () => {
    setError('');
    setShowManualInput(false);
    setCameraReady(false);
    setIsInitializing(false);
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {!showManualInput ? (
            <>
              {/* Camera Container with a fixed aspect ratio */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4 w-full aspect-square">
                {error ? (
                  // Error message and action buttons
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-red-900 p-4">
                    <AlertCircle className="w-16 h-16 mb-4 text-red-300" />
                    <p className="text-sm text-center mb-4 text-red-100">{error}</p>
                    <div className="flex flex-col space-y-2 w-full max-w-xs">
                      <button
                        onClick={() => setShowManualInput(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Use Manual Input
                      </button>
                      <button
                        onClick={resetAndTryAgain}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Try Camera Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Video element for the camera feed */}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    
                    {/* Loading spinner and message */}
                    {(isInitializing || !cameraReady) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
                        <Camera className="w-16 h-16 mb-4 animate-pulse" />
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm text-center px-4">
                          Initializing camera...
                        </p>
                        <p className="text-xs text-gray-300 mt-2 text-center px-4">
                          If it fails, you can use manual input.
                        </p>
                      </div>
                    )}
                    
                    {/* Scanning overlay and animation */}
                    {cameraReady && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Scan region overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-green-400 rounded-lg bg-transparent">
                            {/* Corner markers */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                          </div>
                        </div>
                        {/* Scanning line animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 relative overflow-hidden">
                            <div className="absolute w-full h-0.5 bg-green-400 opacity-75" style={{
                              animation: 'scan 2s linear infinite',
                              top: '0%'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Instructions and Manual Input Button */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-3 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Point your camera at the QR code.
                </p>
                <button
                  onClick={() => setShowManualInput(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Manual Input
                </button>
              </div>

              {/* Tips for scanning */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Tips for better scanning:</h4>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• Hold your phone steady</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep QR code within the green frame</li>
                </ul>
              </div>
            </>
          ) : (
            // Manual input section
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Type className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Manual QR Code Entry</h4>
                <p className="text-sm text-gray-600">
                  Ask your lecturer to share the QR code data with you
                </p>
              </div>

              <div>
                <label htmlFor="manualInput" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code Data:
                </label>
                <textarea
                  id="manualInput"
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
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
