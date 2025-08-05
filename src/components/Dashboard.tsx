import React from 'react';
import { Users, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import { Student, Course, AttendanceRecord, AttendanceSession } from '../types';
import { calculateAttendanceStats } from '../utils/attendance';

interface DashboardProps {
  students: Student[];
  courses: Course[];
  attendanceRecords: AttendanceRecord[];
  attendanceSessions: AttendanceSession[];
}

export default function Dashboard({ students, courses, attendanceRecords, attendanceSessions }: DashboardProps) {
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const activeSessions = attendanceSessions.filter(s => s.isActive).length;
  
  // Calculate overall statistics
  const qualifiedStudents = students.filter(student => {
    return courses.every(course => {
      const stats = calculateAttendanceStats(attendanceRecords, attendanceSessions, student.id, course.id);
      return stats.qualifies || stats.totalSessions === 0;
    });
  }).length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Qualified Students',
      value: qualifiedStudents,
      icon: CheckCircle,
      color: 'bg-emerald-500'
    },
    {
      title: 'Active Sessions',
      value: activeSessions,
      icon: AlertTriangle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of attendance system statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{course.code}</p>
                  <p className="text-sm text-gray-600">{course.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{course.creditUnit} units</p>
                  <p className="text-xs text-gray-400">{course.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {attendanceSessions
              .filter(session => session.isActive)
              .slice(0, 5)
              .map((session) => {
                const course = courses.find(c => c.id === session.courseId);
                return (
                  <div key={session.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">{course?.code}</p>
                      <p className="text-sm text-gray-600">Week {session.week}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{session.date}</p>
                    </div>
                  </div>
                );
              })}
            {attendanceSessions.filter(s => s.isActive).length === 0 && (
              <p className="text-gray-500 text-center py-4">No active sessions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}