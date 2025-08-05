import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Student, Course, AttendanceSession, AttendanceRecord } from '../types'

export function useSupabaseData() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    loadAllData()
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    const studentsSubscription = supabase
      .channel('students')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        loadStudents()
      })
      .subscribe()

    const coursesSubscription = supabase
      .channel('courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        loadCourses()
      })
      .subscribe()

    const sessionsSubscription = supabase
      .channel('attendance_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_sessions' }, () => {
        loadAttendanceSessions()
      })
      .subscribe()

    const recordsSubscription = supabase
      .channel('attendance_records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, () => {
        loadAttendanceRecords()
      })
      .subscribe()

    return () => {
      studentsSubscription.unsubscribe()
      coursesSubscription.unsubscribe()
      sessionsSubscription.unsubscribe()
      recordsSubscription.unsubscribe()
    }
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      loadStudents(),
      loadCourses(),
      loadAttendanceSessions(),
      loadAttendanceRecords()
    ])
    setLoading(false)
  }

  const loadStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading students:', error)
      return
    }

    const formattedStudents: Student[] = data.map(student => ({
      id: student.id,
      matricNumber: student.matric_number,
      firstName: student.first_name,
      lastName: student.last_name,
      email: student.email,
      department: student.department,
      level: student.level,
      phoneNumber: student.phone_number,
      createdAt: student.created_at
    }))

    setStudents(formattedStudents)
  }

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading courses:', error)
      return
    }

    const formattedCourses: Course[] = data.map(course => ({
      id: course.id,
      code: course.code,
      title: course.title,
      creditUnit: course.credit_unit,
      lecturer: course.lecturer,
      department: course.department,
      level: course.level,
      semester: course.semester,
      session: course.session,
      createdAt: course.created_at
    }))

    setCourses(formattedCourses)
  }

  const loadAttendanceSessions = async () => {
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading sessions:', error)
      return
    }

    const formattedSessions: AttendanceSession[] = data.map(session => ({
      id: session.id,
      courseId: session.course_id,
      week: session.week,
      date: session.date,
      startTime: session.start_time,
      endTime: session.end_time,
      qrCode: session.qr_code,
      isActive: session.is_active,
      location: session.location || '',
      createdAt: session.created_at
    }))

    setAttendanceSessions(formattedSessions)
  }

  const loadAttendanceRecords = async () => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .order('marked_at', { ascending: false })

    if (error) {
      console.error('Error loading records:', error)
      return
    }

    const formattedRecords: AttendanceRecord[] = data.map(record => ({
      id: record.id,
      sessionId: record.session_id,
      studentId: record.student_id,
      matricNumber: record.matric_number,
      markedAt: record.marked_at,
      status: record.status as 'present' | 'late' | 'absent',
      location: record.location || ''
    }))

    setAttendanceRecords(formattedRecords)
  }

  // CRUD operations
  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('students')
      .insert({
        matric_number: studentData.matricNumber,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        email: studentData.email,
        department: studentData.department,
        level: studentData.level,
        phone_number: studentData.phoneNumber
      })

    if (error) {
      console.error('Error adding student:', error)
      throw error
    }
  }

  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('courses')
      .insert({
        code: courseData.code,
        title: courseData.title,
        credit_unit: courseData.creditUnit,
        lecturer: courseData.lecturer,
        department: courseData.department,
        level: courseData.level,
        semester: courseData.semester,
        session: courseData.session
      })

    if (error) {
      console.error('Error adding course:', error)
      throw error
    }
  }

  const createSession = async (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('attendance_sessions')
      .insert({
        course_id: sessionData.courseId,
        week: sessionData.week,
        date: sessionData.date,
        start_time: sessionData.startTime,
        end_time: sessionData.endTime,
        qr_code: sessionData.qrCode,
        is_active: sessionData.isActive,
        location: sessionData.location
      })

    if (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  const updateSession = async (id: string, updates: Partial<AttendanceSession>) => {
    const updateData: any = {}
    
    if (updates.courseId) updateData.course_id = updates.courseId
    if (updates.week) updateData.week = updates.week
    if (updates.date) updateData.date = updates.date
    if (updates.startTime) updateData.start_time = updates.startTime
    if (updates.endTime) updateData.end_time = updates.endTime
    if (updates.qrCode) updateData.qr_code = updates.qrCode
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive
    if (updates.location) updateData.location = updates.location

    const { error } = await supabase
      .from('attendance_sessions')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating session:', error)
      throw error
    }
  }

  const markAttendance = async (recordData: Omit<AttendanceRecord, 'id'>) => {
    const { error } = await supabase
      .from('attendance_records')
      .insert({
        session_id: recordData.sessionId,
        student_id: recordData.studentId,
        matric_number: recordData.matricNumber,
        marked_at: recordData.markedAt,
        status: recordData.status,
        location: recordData.location
      })

    if (error) {
      console.error('Error marking attendance:', error)
      throw error
    }
  }

  return {
    students,
    courses,
    attendanceSessions,
    attendanceRecords,
    loading,
    addStudent,
    addCourse,
    createSession,
    updateSession,
    markAttendance,
    refreshData: loadAllData
  }
}