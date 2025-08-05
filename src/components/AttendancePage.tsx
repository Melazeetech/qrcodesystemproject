import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle, Clock, MapPin, Play, Square } from 'lucide-react';
import { Course, AttendanceSession, Student, AttendanceRecord } from '../types';
import { generateSessionQR } from '../utils/qrCode';

interface AttendancePageProps {
  courses: Course[];
  attendanceSessions: AttendanceSession[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onUpdateSession: (id: string, session: Partial<AttendanceSession>) => void;
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export default function AttendancePage({
  courses,
  attendanceSessions,
  students,
  attendanceRecords,
  onUpdateSession,
  onMarkAttendance
}: AttendancePageProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [scannedMatric, setScannedMatric] = useState('');

  const courseSessions = selectedCourse 
    ? attendanceSessions.filter(s => s.courseId === selectedCourse)
    : [];

  const activeSessions = attendanceSessions.filter(s => s.isActive);

  const handleStartSession = (session: AttendanceSession) => {
    const qrCode = generateSessionQR(session.id);
    onUpdateSession(session.id, { 
      isActive: true, 
      qrCode 
    });
    setSelectedSession({ ...session, isActive: true, qrCode });
  };

  const handleStopSession = (session: AttendanceSession) => {
    onUpdateSession(session.id, { isActive: false });
    if (selectedSession?.id === session.id) {
      setSelectedSession({ ...session, isActive: false });
    }
  };

  const handleManualAttendance = () => {
    if (!selectedSession || !scannedMatric) return;

    const student = students.find(s => s.matricNumber === scannedMatric);
    if (!student) {
      alert('Student not found!');
      return;
    }

    // Check if already marked
    const existingRecord = attendanceRecords.find(r => 
      r.sessionId === selectedSession.id && r.studentId === student.id
    );

    if (existingRecord) {
      alert('Student already marked present for this session!');
      return;
    }

    const now = new Date();
    const sessionStart = new Date(`${selectedSession.date} ${selectedSession.startTime}`);
    const isLate = now > new Date(sessionStart.getTime() + 15 * 60000); // 15 minutes late

    onMarkAttendance({
      sessionId: selectedSession.id,
      studentId: student.id,
      matricNumber: student.matricNumber,
      markedAt: now.toISOString(),
      status: isLate ? 'late' : 'present',
      location: selectedSession.location
    });

    setScannedMatric('');
    alert(`Attendance marked for ${student.firstName} ${student.lastName}!`);
  };

  const getSessionAttendance = (sessionId: string) => {
    const records = attendanceRecords.filter(r => r.sessionId === sessionId);
    return {
      present: records.filter(r => r.status === 'present').length,
      late: records.filter(r => r.status === 'late').length,
      total: records.length
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600">Generate QR codes and mark student attendance</p>
      </div>

      {/* Active Sessions Alert */}
      {activeSessions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              {activeSessions.length} active session(s) running
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Course</h3>
            <div className="space-y-3">
              {courses.map((course) => {
                const sessions = attendanceSessions.filter(s => s.courseId === course.id);
                const activeSession = sessions.find(s => s.isActive);
                
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedCourse === course.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{course.code}</div>
                        <div className="text-sm text-gray-600">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sessions.length} sessions
                        </div>
                      </div>
                      {activeSession && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions Management */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              {/* Sessions List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Sessions ({courseSessions.length})
                </h3>
                <div className="space-y-3">
                  {courseSessions.map((session) => {
                    const attendance = getSessionAttendance(session.id);
                    const course = courses.find(c => c.id === session.courseId);
                    
                    return (
                      <div
                        key={session.id}
                        className={`border rounded-lg p-4 ${
                          session.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                Week {session.week}
                              </span>
                              {session.isActive && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                                  Live
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {session.date} • {session.startTime}-{session.endTime}
                              </span>
                              {session.location && (
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {session.location}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              Attendance: {attendance.present + attendance.late}/{attendance.total} students
                              {attendance.late > 0 && (
                                <span className="text-orange-600 ml-2">({attendance.late} late)</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {session.isActive ? (
                              <>
                                <button
                                  onClick={() => setSelectedSession(session)}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  <QrCode className="w-4 h-4 mr-1 inline" />
                                  View QR
                                </button>
                                <button
                                  onClick={() => handleStopSession(session)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  <Square className="w-4 h-4 mr-1 inline" />
                                  Stop
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleStartSession(session)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                <Play className="w-4 h-4 mr-1 inline" />
                                Start
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {courseSessions.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No sessions created for this course
                    </p>
                  )}
                </div>
              </div>

              {/* QR Code Display */}
              {selectedSession && selectedSession.isActive && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    QR Code - Week {selectedSession.week}
                  </h3>
                  <div className="text-center">
                    <div className="inline-block p-8 bg-gray-100 rounded-lg mb-4">
                      <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {/* QR Code Pattern Simulation */}
                        <div className="absolute inset-2 grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }, (_, i) => (
                            <div
                              key={i}
                              className={`aspect-square ${
                                Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                          <div className="text-center">
                            <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600 font-mono">
                              {selectedSession.qrCode?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Students can scan this QR code to mark their attendance
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      QR Code: <span className="font-mono">{selectedSession.qrCode}</span>
                    </p>
                    
                    {/* Manual Attendance */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Manual Attendance</h4>
                      <div className="flex space-x-2 max-w-md mx-auto">
                        <input
                          type="text"
                          placeholder="Enter matric number"
                          value={scannedMatric}
                          onChange={(e) => setScannedMatric(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          onClick={handleManualAttendance}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
              <p className="text-gray-600">Choose a course from the list to manage attendance sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}