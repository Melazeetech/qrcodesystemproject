import { AttendanceRecord, AttendanceSession, AttendanceStats } from '../types';

export function calculateAttendanceStats(
  records: AttendanceRecord[],
  sessions: AttendanceSession[],
  studentId: string,
  courseId: string
): AttendanceStats {
  const courseSessions = sessions.filter(s => s.courseId === courseId);
  const studentRecords = records.filter(r => 
    r.studentId === studentId && 
    courseSessions.some(s => s.id === r.sessionId)
  );

  const attendedSessions = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const totalSessions = courseSessions.length;
  const attendancePercentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
  const qualifies = attendancePercentage >= 75;

  return {
    courseId,
    studentId,
    totalSessions,
    attendedSessions,
    attendancePercentage,
    qualifies
  };
}

export function getWeeklyAttendance(
  records: AttendanceRecord[],
  sessions: AttendanceSession[],
  courseId: string
) {
  const courseSessions = sessions.filter(s => s.courseId === courseId);
  
  return courseSessions.map(session => {
    const sessionRecords = records.filter(r => r.sessionId === session.id);
    const present = sessionRecords.filter(r => r.status === 'present').length;
    const late = sessionRecords.filter(r => r.status === 'late').length;
    const absent = sessionRecords.filter(r => r.status === 'absent').length;
    
    return {
      week: session.week,
      date: session.date,
      present,
      late,
      absent,
      total: present + late + absent
    };
  });
}