import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import Dashboard from './components/Dashboard';
import StudentsPage from './components/StudentsPage';
import CoursesPage from './components/CoursesPage';
import AttendancePage from './components/AttendancePage';
import ReportsPage from './components/ReportsPage';
import HowToUse from './components/HowToUse';
import TestingHelper from './components/TestingHelper';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Student, Course, AttendanceSession, AttendanceRecord, User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('fcfj-current-user', null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showTesting, setShowTesting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Data management with Supabase
  const {
    students,
    courses,
    attendanceSessions,
    attendanceRecords,
    loading,
    error,
    addStudent,
    addCourse,
    createSession,
    updateSession,
    markAttendance,
    initializeDefaultData
  } = useSupabaseData();

  // Initialize default data on first load
  useEffect(() => {
    const initializeData = async () => {
      if (!loading && !isInitialized) {
        try {
          await initializeDefaultData();
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize data:', error);
        }
      }
    };

    initializeData();
  }, [loading, isInitialized, initializeDefaultData]);

  // Show loading screen while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FCFJ Attendance System...</p>
        </div>
      </div>
    );
  }

  // Show error screen if database connection fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the database. Please check your internet connection and try again.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
    }

  const handleLogin = (matricNumber: string, role: 'admin' | 'student') => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin',
        matricNumber: 'admin',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator'
      });
    } else {
      const student = students.find(s => s.matricNumber === matricNumber);
      if (student) {
        setCurrentUser({
          id: student.id,
          matricNumber: student.matricNumber,
          role: 'student',
          firstName: student.firstName,
          lastName: student.lastName
        });
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  // Student management
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      await addStudent(studentData);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    // TODO: Implement update student in Supabase
    console.log('Update student:', id, updates);
  };

  const handleDeleteStudent = async (id: string) => {
    // TODO: Implement delete student in Supabase
    console.log('Delete student:', id);
  };

  // Course management
  const handleAddCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    try {
      await addCourse(courseData);
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleUpdateCourse = async (id: string, updates: Partial<Course>) => {
    // TODO: Implement update course in Supabase
    console.log('Update course:', id, updates);
  };

  const handleDeleteCourse = async (id: string) => {
    // TODO: Implement delete course in Supabase
    console.log('Delete course:', id);
  };

  // Session management
  const handleCreateSession = async (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => {
    try {
      await createSession(sessionData);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleUpdateSession = async (id: string, updates: Partial<AttendanceSession>) => {
    try {
      await updateSession(id, updates);
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  // Attendance management
  const handleMarkAttendance = async (recordData: Omit<AttendanceRecord, 'id'>) => {
    try {
      await markAttendance(recordData);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  // Student attendance marking
  const handleStudentMarkAttendance = async (sessionId: string, studentId: string) => {
    const session = attendanceSessions.find(s => s.id === sessionId);
    const student = students.find(s => s.id === studentId);
    
    if (!session || !student) return;

    const now = new Date();
    const sessionStart = new Date(`${session.date} ${session.startTime}`);
    const isLate = now > new Date(sessionStart.getTime() + 15 * 60000); // 15 minutes late

    await handleMarkAttendance({
      sessionId,
      studentId,
      matricNumber: student.matricNumber,
      markedAt: now.toISOString(),
      status: isLate ? 'late' : 'present',
      location: session.location
    });
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // If student, show student dashboard
  if (currentUser.role === 'student') {
    const student = students.find(s => s.id === currentUser.id);
    if (!student) {
      return <LoginPage onLogin={handleLogin} />;
    }

    return (
      <>
        <StudentDashboard
          student={student}
          courses={courses}
          attendanceRecords={attendanceRecords}
          attendanceSessions={attendanceSessions}
          onLogout={handleLogout}
          onMarkAttendance={handleStudentMarkAttendance}
        />
        {showHowToUse && <HowToUse onClose={() => setShowHowToUse(false)} />}
      </>
    );
  }

  // Admin interface
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            students={students}
            courses={courses}
            attendanceRecords={attendanceRecords}
            attendanceSessions={attendanceSessions}
          />
        );
      case 'students':
        return (
          <StudentsPage
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'courses':
        return (
          <CoursesPage
            courses={courses}
            attendanceSessions={attendanceSessions}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onCreateSession={handleCreateSession}
          />
        );
      case 'attendance':
        return (
          <AttendancePage
            courses={courses}
            attendanceSessions={attendanceSessions}
            students={students}
            attendanceRecords={attendanceRecords}
            onUpdateSession={handleUpdateSession}
            onMarkAttendance={handleMarkAttendance}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            students={students}
            courses={courses}
            attendanceRecords={attendanceRecords}
            attendanceSessions={attendanceSessions}
          />
        );
      default:
        return <Dashboard students={students} courses={courses} attendanceRecords={attendanceRecords} attendanceSessions={attendanceSessions} />;
    }
  };

  return (
    <>
      <Layout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        onShowHowToUse={() => setShowHowToUse(true)}
        onShowTesting={() => setShowTesting(true)}
        currentUser={currentUser}
      >
        {renderCurrentPage()}
      </Layout>
      {showHowToUse && <HowToUse onClose={() => setShowHowToUse(false)} />}
      {showTesting && <TestingHelper onClose={() => setShowTesting(false)} />}
    </>
  );
}

export default App;