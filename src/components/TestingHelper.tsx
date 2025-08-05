import React, { useState } from 'react';
import { Copy, Check, Smartphone, Laptop, Wifi, Globe } from 'lucide-react';

interface TestingHelperProps {
  onClose: () => void;
}

export default function TestingHelper({ onClose }: TestingHelperProps) {
  const [copiedUrl, setCopiedUrl] = useState('');
  const [currentUrl] = useState(window.location.origin);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedUrl(type);
      setTimeout(() => setCopiedUrl(''), 2000);
    });
  };

  const getLocalIP = () => {
    // This is a placeholder - in reality, you'd need to detect the actual IP
    return '192.168.1.100'; // Replace with actual IP detection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Testing Guide for Lecturers</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Setup */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              Quick Setup for Demo
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <p className="font-medium">Current URL (Laptop)</p>
                  <p className="text-sm text-gray-600">{currentUrl}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(currentUrl, 'current')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  {copiedUrl === 'current' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl === 'current' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <p className="font-medium">Network URL (Phone)</p>
                  <p className="text-sm text-gray-600">http://{getLocalIP()}:5173</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`http://${getLocalIP()}:5173`, 'network')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {copiedUrl === 'network' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl === 'network' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Step by Step */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Demo Setup</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-blue-900">Start the Server</h4>
                  <p className="text-blue-800 text-sm">Run: <code className="bg-blue-100 px-1 rounded">npm run dev -- --host</code></p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-purple-900 flex items-center">
                    <Laptop className="w-4 h-4 mr-2" />
                    Laptop (Admin/Lecturer)
                  </h4>
                  <ul className="text-purple-800 text-sm space-y-1 mt-1">
                    <li>• Open: <code className="bg-purple-100 px-1 rounded">{currentUrl}</code></li>
                    <li>• Login as: <code className="bg-purple-100 px-1 rounded">admin</code></li>
                    <li>• Go to "Mark Attendance" page</li>
                    <li>• Select a course and start a session</li>
                    <li>• Display the QR code on screen</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-green-900 flex items-center">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Phone (Student)
                  </h4>
                  <ul className="text-green-800 text-sm space-y-1 mt-1">
                    <li>• Connect to same WiFi as laptop</li>
                    <li>• Open: <code className="bg-green-100 px-1 rounded">http://{getLocalIP()}:5173</code></li>
                    <li>• Login as: <code className="bg-green-100 px-1 rounded">CFJ/ND/COM/2024/001</code></li>
                    <li>• Click "Scan QR Code" button</li>
                    <li>• Point camera at laptop screen</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-orange-900">Test the System</h4>
                  <ul className="text-orange-800 text-sm space-y-1 mt-1">
                    <li>• Student scans QR from laptop screen</li>
                    <li>• Attendance should be marked in real-time</li>
                    <li>• Check progress on student dashboard</li>
                    <li>• View reports on admin panel</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sample Credentials */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900">Admin/Lecturer</h4>
                <p className="text-sm text-gray-600">Username: <code className="bg-gray-100 px-1 rounded">admin</code></p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900">Students</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><code className="bg-gray-100 px-1 rounded">CFJ/ND/COM/2024/001</code></p>
                  <p><code className="bg-gray-100 px-1 rounded">CFJ/ND/COM/2024/002</code></p>
                  <p><code className="bg-gray-100 px-1 rounded">CFJ/HND/COM/2024/001</code></p>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Issues</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900">Phone can't access laptop URL</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Ensure both devices are on same WiFi</li>
                  <li>• Check laptop firewall settings</li>
                  <li>• Try: <code className="bg-gray-100 px-1 rounded">npm run dev -- --host 0.0.0.0</code></li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900">QR code says "Invalid"</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Make sure session is active (green "Live" indicator)</li>
                  <li>• QR codes expire after 15 minutes</li>
                  <li>• Both devices must use the same system instance</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900">Camera not working</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Allow camera permissions in browser</li>
                  <li>• Use HTTPS for camera access (or localhost)</li>
                  <li>• Use manual QR input as backup</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Testing!
          </button>
        </div>
      </div>
    </div>
  );
}