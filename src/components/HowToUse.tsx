import React from 'react';
import { BookOpen, Users, QrCode, BarChart3, Camera, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface HowToUseProps {
  onClose: () => void;
}

export default function HowToUse({ onClose }: HowToUseProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">How to Use FCFJ Attendance System</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-600" />
              System Overview
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-700">
                The FCFJ QR Code Attendance System is designed for the Computer Science Department to track student attendance 
                with a 75% minimum requirement for exam eligibility. The system prevents impersonation through QR code validation, 
                time limits, and location verification.
              </p>
            </div>
          </section>

          {/* For Students */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              For Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">1. Login</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use your matric number (e.g., CFJ/ND/COM/2024/001)</li>
                  <li>• Select "Student" role</li>
                  <li>• Click "Sign In"</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">2. View Dashboard</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check attendance progress for each course</li>
                  <li>• Monitor 75% requirement status</li>
                  <li>• View exam eligibility</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">3. Mark Attendance</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click "Scan QR Code" button</li>
                  <li>• Use camera to scan lecturer's QR code</li>
                  <li>• Or manually enter QR code</li>
                  <li>• Confirm attendance marking</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">4. Track Progress</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Monitor attendance percentage</li>
                  <li>• Check qualification status</li>
                  <li>• View active sessions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Administrators */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
              For Administrators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">1. Login as Admin</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Use username: "admin"</li>
                  <li>• Select "Admin" role</li>
                  <li>• Access full system controls</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">2. Manage Students</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Add new students manually</li>
                  <li>• Import students via CSV</li>
                  <li>• Edit student information</li>
                  <li>• View student records</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">3. Manage Courses</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Create new courses</li>
                  <li>• Set up weekly sessions</li>
                  <li>• Assign lecturers</li>
                  <li>• Configure course details</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">4. Generate Reports</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• View attendance statistics</li>
                  <li>• Export attendance reports</li>
                  <li>• Monitor course progress</li>
                  <li>• Track qualification rates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* QR Code System */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-6 h-6 mr-2 text-green-600" />
              QR Code Attendance Process
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Lecturer Generates QR</h4>
                  <p className="text-sm text-gray-600">
                    Lecturer starts a session and displays the QR code for students to scan
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Student Scans Code</h4>
                  <p className="text-sm text-gray-600">
                    Student uses camera or manual input to submit the QR code within time limit
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Attendance Recorded</h4>
                  <p className="text-sm text-gray-600">
                    System validates and records attendance with timestamp and verification
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Anti-Impersonation Features */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
              Anti-Impersonation Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Time-Limited QR Codes</h4>
                <p className="text-sm text-orange-800">
                  QR codes expire after 15 minutes to prevent sharing and ensure real-time attendance
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Session Validation</h4>
                <p className="text-sm text-orange-800">
                  Each QR code is unique to a specific session and cannot be reused
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Duplicate Prevention</h4>
                <p className="text-sm text-orange-800">
                  System prevents multiple attendance marks for the same student in one session
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Location Tracking</h4>
                <p className="text-sm text-orange-800">
                  Optional location verification ensures students are physically present
                </p>
              </div>
            </div>
          </section>

          {/* 75% Requirement */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              75% Attendance Requirement
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Qualification Rules</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Minimum 75% attendance required for exam eligibility</li>
                    <li>• Calculated per course individually</li>
                    <li>• Both present and late attendance count</li>
                    <li>• Real-time progress tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Status Indicators</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <span className="text-green-600">Green:</span> Qualified (≥75%)</li>
                    <li>• <span className="text-red-600">Red:</span> At Risk ({'<75%'})</li>
                    <li>• Progress bars show current status</li>
                    <li>• Alerts for courses needing attention</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Issues & Solutions</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">QR Code Not Working</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check if the session is still active</li>
                  <li>• Ensure QR code hasn't expired (15-minute limit)</li>
                  <li>• Try manual entry if camera scanning fails</li>
                  <li>• Contact lecturer if issues persist</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Login Issues</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verify matric number format: CFJ/ND/COM/YYYY/XXX</li>
                  <li>• Check if you're registered in the system</li>
                  <li>• Contact admin for account issues</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Attendance Not Showing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Refresh the page to see latest updates</li>
                  <li>• Check if you scanned the correct course QR</li>
                  <li>• Verify attendance was marked successfully</li>
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
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}