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
import { useSharedStorage } from './hooks/useSharedStorage';
import { Student, Course, AttendanceSession, AttendanceRecord, User } from './types';
import { defaultStudents, defaultCourses } from './data/defaultData';

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('fcfj-current-user', null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showTesting, setShowTesting] = useState(false);
  
  // Data management with localStorage
  const [students, setStudents] = useSharedStorage<Student[]>('fcfj-students', []);
  const [courses, setCourses] = useSharedStorage<Course[]>('fcfj-courses', []);
  const [attendanceSessions, setAttendanceSessions] = useSharedStorage<AttendanceSession[]>('fcfj-sessions', []);
  const [attendanceRecords, setAttendanceRecords] = useSharedStorage<AttendanceRecord[]>('fcfj-records', []);

  // Initialize default data on first load
  useEffect(() => {
    if (students.length === 0) {
      const initialStudents = defaultStudents.map(student => ({
        ...student,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }));
      setStudents(initialStudents);
    }

    if (courses.length === 0) {
      const initialCourses = defaultCourses.map(course => ({
        ...course,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }));
      setCourses(initialCourses);
    }
  }, [students.length, courses.length, setStudents, setCourses]);

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
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
      setAttendanceRecords(attendanceRecords.filter(record => record.studentId !== id));
    }
  };

  // Course management
  const handleAddCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
      setAttendanceSessions(attendanceSessions.filter(session => session.courseId !== id));
      setAttendanceRecords(attendanceRecords.filter(record => {
        const session = attendanceSessions.find(s => s.id === record.sessionId);
        return session?.courseId !== id;
      }));
    }
  };

  // Session management
  const handleCreateSession = (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setAttendanceSessions([...attendanceSessions, newSession]);
  };

  const handleUpdateSession = (id: string, updates: Partial<AttendanceSession>) => {
    setAttendanceSessions(attendanceSessions.map(session =>
      session.id === id ? { ...session, ...updates } : session
    ));
  };

  // Attendance management
  const handleMarkAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: crypto.randomUUID()
    };
    setAttendanceRecords([...attendanceRecords, newRecord]);
  };

  // Student attendance marking
  const handleStudentMarkAttendance = (sessionId: string, studentId: string) => {
    const session = attendanceSessions.find(s => s.id === sessionId);
    const student = students.find(s => s.id === studentId);
    
    if (!session || !student) return;

    const now = new Date();
    const sessionStart = new Date(`${session.date} ${session.startTime}`);
    const isLate = now > new Date(sessionStart.getTime() + 15 * 60000); // 15 minutes late

    handleMarkAttendance({
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