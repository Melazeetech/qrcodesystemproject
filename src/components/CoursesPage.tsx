import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Clock } from 'lucide-react';
import { Course, AttendanceSession } from '../types';

interface CoursesPageProps {
  courses: Course[];
  attendanceSessions: AttendanceSession[];
  onAddCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  onUpdateCourse: (id: string, course: Partial<Course>) => void;
  onDeleteCourse: (id: string) => void;
  onCreateSession: (session: Omit<AttendanceSession, 'id' | 'createdAt'>) => void;
}

export default function CoursesPage({ 
  courses, 
  attendanceSessions, 
  onAddCourse, 
  onUpdateCourse, 
  onDeleteCourse,
  onCreateSession
}: CoursesPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showSessionForm, setShowSessionForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditUnit: 0,
    lecturer: '',
    department: '',
    level: '',
    semester: '',
    session: ''
  });

  const [sessionData, setSessionData] = useState({
    week: 1,
    date: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = [
    'Forest Resources Management',
    'Wildlife and Ecotourism Management',
    'Wood Products Engineering',
    'Forest Economics and Extension',
    'Forestry Technology'
  ];

  const levels = ['ND1', 'ND2', 'HND1', 'HND2'];
  const semesters = ['First Semester', 'Second Semester'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      onUpdateCourse(editingCourse.id, formData);
      setEditingCourse(null);
    } else {
      onAddCourse(formData);
    }
    setFormData({
      code: '',
      title: '',
      creditUnit: 0,
      lecturer: '',
      department: '',
      level: '',
      semester: '',
      session: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      creditUnit: course.creditUnit,
      lecturer: course.lecturer,
      department: course.department,
      level: course.level,
      semester: course.semester,
      session: course.session
    });
    setShowAddForm(true);
  };

  const handleCreateSession = (courseId: string) => {
    const existingSessions = attendanceSessions.filter(s => s.courseId === courseId);
    const nextWeek = existingSessions.length + 1;
    
    onCreateSession({
      courseId,
      week: nextWeek,
      date: sessionData.date,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      location: sessionData.location,
      qrCode: '',
      isActive: false
    });

    setSessionData({
      week: 1,
      date: '',
      startTime: '',
      endTime: '',
      location: ''
    });
    setShowSessionForm(null);
  };

  const getCourseSessions = (courseId: string) => {
    return attendanceSessions.filter(s => s.courseId === courseId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-600">Manage courses and create attendance sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search courses by code, title, or lecturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="FOR 201"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Introduction to Forestry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Unit *
              </label>
              <input
                type="number"
                required
                min="1"
                max="6"
                value={formData.creditUnit}
                onChange={(e) => setFormData({ ...formData, creditUnit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lecturer *
              </label>
              <input
                type="text"
                required
                value={formData.lecturer}
                onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Level</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session *
              </label>
              <input
                type="text"
                required
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="2023/2024"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCourse(null);
                  setFormData({
                    code: '',
                    title: '',
                    creditUnit: 0,
                    lecturer: '',
                    department: '',
                    level: '',
                    semester: '',
                    session: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const sessionsCount = getCourseSessions(course.id);
          return (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lecturer:</span>
                  <span className="text-gray-900">{course.lecturer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Credit Units:</span>
                  <span className="text-gray-900">{course.creditUnit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <span className="text-gray-900">{course.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sessions:</span>
                  <span className="text-gray-900 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {sessionsCount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowSessionForm(course.id)}
                className="w-full px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                Create Session
              </button>

              {/* Session Form */}
              {showSessionForm === course.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Create New Session</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={sessionData.date}
                        onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={sessionData.startTime}
                          onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={sessionData.endTime}
                          onChange={(e) => setSessionData({ ...sessionData, endTime: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={sessionData.location}
                        onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Lecture Hall A"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowSessionForm(null)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleCreateSession(course.id)}
                        className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
}