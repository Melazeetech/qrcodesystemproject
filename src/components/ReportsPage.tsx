import React, { useState } from 'react';
import { Download, Filter, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Student, Course, AttendanceRecord, AttendanceSession } from '../types';
import { calculateAttendanceStats, getWeeklyAttendance } from '../utils/attendance';

interface ReportsPageProps {
  students: Student[];
  courses: Course[];
  attendanceRecords: AttendanceRecord[];
  attendanceSessions: AttendanceSession[];
}

export default function ReportsPage({
  students,
  courses,
  attendanceRecords,
  attendanceSessions
}: ReportsPageProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const departments = Array.from(new Set(students.map(s => s.department)));
  const levels = Array.from(new Set(students.map(s => s.level)));

  // Filter students based on selected filters
  const filteredStudents = students.filter(student => {
    if (selectedLevel && student.level !== selectedLevel) return false;
    if (selectedDepartment && student.department !== selectedDepartment) return false;
    return true;
  });

  // Generate attendance statistics
  const generateStats = () => {
    if (!selectedCourse) return [];

    return filteredStudents.map(student => {
      const stats = calculateAttendanceStats(
        attendanceRecords,
        attendanceSessions,
        student.id,
        selectedCourse
      );
      return {
        student,
        ...stats
      };
    }).sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  };

  const attendanceStats = generateStats();
  const course = courses.find(c => c.id === selectedCourse);

  // Overall statistics
  const totalQualified = attendanceStats.filter(s => s.qualifies).length;
  const totalDisqualified = attendanceStats.filter(s => !s.qualifies && s.totalSessions > 0).length;
  const averageAttendance = attendanceStats.length > 0 
    ? attendanceStats.reduce((acc, s) => acc + s.attendancePercentage, 0) / attendanceStats.length 
    : 0;

  // Weekly attendance data
  const weeklyData = selectedCourse 
    ? getWeeklyAttendance(attendanceRecords, attendanceSessions, selectedCourse)
    : [];

  const handleExport = () => {
    if (!course || attendanceStats.length === 0) return;

    const csvContent = [
      ['Matric Number', 'Name', 'Department', 'Level', 'Total Sessions', 'Attended', 'Percentage', 'Status'],
      ...attendanceStats.map(stat => [
        stat.student.matricNumber,
        `${stat.student.firstName} ${stat.student.lastName}`,
        stat.student.department,
        stat.student.level,
        stat.totalSessions,
        stat.attendedSessions,
        `${stat.attendancePercentage.toFixed(1)}%`,
        stat.qualifies ? 'Qualified' : 'Disqualified'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.code}_attendance_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600">Analyze attendance patterns and generate reports</p>
        </div>
        {selectedCourse && attendanceStats.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedCourse && course ? (
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{attendanceStats.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Qualified (≥75%)</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{totalQualified}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Disqualified ({'<75%'})</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{totalDisqualified}</p>
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

          {/* Weekly Attendance Chart */}
          {weeklyData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Trend</h3>
              <div className="space-y-3">
                {weeklyData.map((week, index) => {
                  const attendanceRate = week.total > 0 ? ((week.present + week.late) / week.total) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium text-gray-700">
                        Week {week.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{week.date}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {attendanceRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {week.present + week.late}/{week.total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Attendance Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Detailed Attendance - {course.code}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceStats.map((stat) => (
                    <tr key={stat.student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {stat.student.firstName} {stat.student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{stat.student.matricNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {stat.student.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.attendedSessions}/{stat.totalSessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {stat.attendancePercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  stat.attendancePercentage >= 75 ? 'bg-green-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${Math.min(stat.attendancePercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stat.qualifies
                              ? 'bg-green-100 text-green-800'
                              : stat.totalSessions > 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {stat.qualifies ? 'Qualified' : stat.totalSessions > 0 ? 'Disqualified' : 'No Data'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {attendanceStats.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No attendance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
          <p className="text-gray-600">Choose a course to view detailed attendance reports and analytics</p>
        </div>
      )}
    </div>
  );
}