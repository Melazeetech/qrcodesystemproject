import React, { useState } from 'react';
import { User, BookOpen, CheckCircle, AlertTriangle, Calendar, Clock, TrendingUp, LogOut, Camera, QrCode } from 'lucide-react';
import { Student, Course, AttendanceRecord, AttendanceSession } from '../types';
import { calculateAttendanceStats } from '../utils/attendance';

interface StudentDashboardProps {
  student: Student;
  courses: Course[];
  attendanceRecords: AttendanceRecord[];
  attendanceSessions: AttendanceSession[];
  onLogout: () => void;
  onMarkAttendance: (sessionId: string, studentId: string) => void;
}

export default function StudentDashboard({
  student,
  courses,
  attendanceRecords,
  attendanceSessions,
  onLogout,
  onMarkAttendance
}: StudentDashboardProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // Get courses for student's level
  const studentCourses = courses.filter(course => course.level === student.level);

  // Calculate attendance statistics for each course
  const courseStats = studentCourses.map(course => {
    const stats = calculateAttendanceStats(
      attendanceRecords,
      attendanceSessions,
      student.id,
      course.id
    );
    return {
      course,
      ...stats
    };
  });

  // Overall statistics
  const totalCourses = studentCourses.length;
  const qualifiedCourses = courseStats.filter(stat => stat.qualifies).length;
  const averageAttendance = courseStats.length > 0 
    ? courseStats.reduce((acc, stat) => acc + stat.attendancePercentage, 0) / courseStats.length 
    : 0;

  // Active sessions for student's courses
  const activeSessions = attendanceSessions.filter(session => 
    session.isActive && studentCourses.some(course => course.id === session.courseId)
  );

  const handleQRScan = () => {
    if (!scannedCode.trim()) {
      setScanResult({ success: false, message: 'Please enter a valid QR code' });
      return;
    }

    // Find active session matching the QR code
    const session = activeSessions.find(s => s.qrCode === scannedCode);
    
    if (!session) {
      setScanResult({ success: false, message: 'Invalid or expired QR code' });
      return;
    }

    // Check if already marked
    const existingRecord = attendanceRecords.find(r => 
      r.sessionId === session.id && r.studentId === student.id
    );

    if (existingRecord) {
      setScanResult({ success: false, message: 'You have already marked attendance for this session' });
      return;
    }

    // Mark attendance
    onMarkAttendance(session.id, student.id);
    setScanResult({ success: true, message: 'Attendance marked successfully!' });
    setScannedCode('');
    setShowScanner(false);
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
    >
      {/* Single Large Watermark */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: `url('./download.jpeg')`,
          backgroundSize: '1000px 1000px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="./download.jpeg" 
                alt="FCFJ Logo" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FCFJ Student Portal</h1>
                <p className="text-sm text-gray-500">Computer Science Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-xs text-gray-500">{student.matricNumber}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {student.firstName}!
          </h2>
          <p className="text-gray-600">
            Track your attendance progress and ensure you meet the 75% requirement for all courses.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCourses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Qualified Courses</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{qualifiedCourses}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">At Risk</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{totalCourses - qualifiedCourses}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Average Attendance</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{averageAttendance.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Attendance Progress</h3>
              <div className="space-y-6">
                {courseStats.map((stat) => (
                  <div key={stat.course.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{stat.course.code}</h4>
                        <p className="text-sm text-gray-600">{stat.course.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Lecturer: {stat.course.lecturer}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stat.qualifies
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {stat.qualifies ? 'Qualified' : 'At Risk'}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {stat.attendedSessions}/{stat.totalSessions} sessions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Attendance Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {stat.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          stat.attendancePercentage >= 75 ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(stat.attendancePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-medium">75% (Required)</span>
                      <span>100%</span>
                    </div>
                    {stat.attendancePercentage < 75 && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        You need {Math.ceil((0.75 * stat.totalSessions) - stat.attendedSessions)} more sessions to qualify
                      </div>
                    )}
                  </div>
                ))}
                {courseStats.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No courses found for your level</p>
                )}
              </div>
            </div>
          </div>

          {/* QR Scanner & Active Sessions */}
          <div className="space-y-6">
            {/* QR Scanner */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
              
              {!showScanner ? (
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR Code</span>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Camera Simulation */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={(video) => {
                        if (video && !video.srcObject) {
                          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                            .then(stream => {
                              video.srcObject = stream;
                              video.play();
                            })
                            .catch(() => {
                              // Fallback to front camera if back camera fails
                              navigator.mediaDevices.getUserMedia({ video: true })
                                .then(stream => {
                                  video.srcObject = stream;
                                  video.play();
                                })
                                .catch(() => {
                                  // Show fallback UI if camera access fails
                                  video.style.display = 'none';
                                  const fallback = video.parentElement?.querySelector('.camera-fallback');
                                  if (fallback) fallback.style.display = 'block';
                                });
                            });
                        }
                      }}
                      className="w-full h-64 object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="camera-fallback absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-white" style={{ display: 'none' }}>
                      <Camera className="w-16 h-16 mb-4" />
                      <p className="text-sm mb-2">Camera not available</p>
                      <p className="text-xs text-gray-400">Use manual input below</p>
                    </div>
                    {/* QR Code scanning overlay */}
                    <div className="absolute inset-4 border-2 border-green-400 rounded-lg pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1">
                        Position QR code within the green frame
                      </p>
                    </div>
                  </div>
                  
                  {/* Manual Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter QR code manually:
                    </label>
                    <input
                      type="text"
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter QR code"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowScanner(false);
                        setScannedCode('');
                        setScanResult(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleQRScan}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {scanResult && (
                <div className={`mt-4 p-3 rounded-lg ${
                  scanResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    {scanResult.success ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{scanResult.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {activeSessions.map((session) => {
                  const course = studentCourses.find(c => c.id === session.courseId);
                  const isMarked = attendanceRecords.some(r => 
                    r.sessionId === session.id && r.studentId === student.id
                  );
                  
                  return (
                    <div key={session.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{course?.code}</p>
                          <p className="text-sm text-gray-600">Week {session.week}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                            Live
                          </span>
                          {isMarked && (
                            <p className="text-xs text-green-600 mt-1">✓ Marked</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeSessions.length === 0 && (
                  <p className="text-gray-500 text-center py-4 text-sm">No active sessions</p>
                )}
              </div>
            </div>

            {/* Exam Eligibility */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Eligibility</h3>
              <div className="space-y-3">
                {courseStats.map((stat) => (
                  <div key={stat.course.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stat.course.code}</p>
                      <p className="text-xs text-gray-500">{stat.attendancePercentage.toFixed(1)}%</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        stat.qualifies
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {stat.qualifies ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}