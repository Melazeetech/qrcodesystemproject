export interface Student {
  id: string;
  matricNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  level: string;
  phoneNumber: string;
  photo?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnit: number;
  lecturer: string;
  department: string;
  level: string;
  semester: string;
  session: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  week: number;
  date: string;
  startTime: string;
  endTime: string;
  qrCode: string;
  isActive: boolean;
  location?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  matricNumber: string;
  markedAt: string;
  status: 'present' | 'late' | 'absent';
  verificationPhoto?: string;
  location?: string;
}

export interface AttendanceStats {
  courseId: string;
  studentId: string;
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
  qualifies: boolean;
}

export interface User {
  id: string;
  matricNumber: string;
  role: 'admin' | 'student';
  firstName: string;
  lastName: string;
}