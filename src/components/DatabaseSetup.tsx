import React, { useState } from 'react'
import { Database, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { defaultStudents, defaultCourses } from '../data/defaultData'

interface DatabaseSetupProps {
  onComplete: () => void
}

export default function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const createTables = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Create students table
      const { error: studentsError } = await supabase.rpc('create_students_table')
      if (studentsError) throw studentsError

      // Create courses table
      const { error: coursesError } = await supabase.rpc('create_courses_table')
      if (coursesError) throw coursesError

      // Create attendance_sessions table
      const { error: sessionsError } = await supabase.rpc('create_sessions_table')
      if (sessionsError) throw sessionsError

      // Create attendance_records table
      const { error: recordsError } = await supabase.rpc('create_records_table')
      if (recordsError) throw recordsError

      setSuccess('Database tables created successfully!')
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const seedData = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Insert students
      const studentsData = defaultStudents.map(student => ({
        matric_number: student.matricNumber,
        first_name: student.firstName,
        last_name: student.lastName,
        email: student.email,
        department: student.department,
        level: student.level,
        phone_number: student.phoneNumber
      }))

      const { error: studentsError } = await supabase
        .from('students')
        .insert(studentsData)

      if (studentsError) throw studentsError

      // Insert courses
      const coursesData = defaultCourses.map(course => ({
        code: course.code,
        title: course.title,
        credit_unit: course.creditUnit,
        lecturer: course.lecturer,
        department: course.department,
        level: course.level,
        semester: course.semester,
        session: course.session
      }))

      const { error: coursesError } = await supabase
        .from('courses')
        .insert(coursesData)

      if (coursesError) throw coursesError

      setSuccess('Sample data inserted successfully!')
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Database Setup</h1>
          <p className="text-gray-600">Initialize your attendance system database</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Create Tables</h3>
            <p className="text-gray-600">Create the necessary database tables for the attendance system.</p>
            <button
              onClick={createTables}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Tables
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Add Sample Data</h3>
            <p className="text-gray-600">Insert sample students and courses for testing.</p>
            <button
              onClick={seedData}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
              Add Sample Data
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Setup Complete!</h3>
            <p className="text-gray-600">Your database is ready. You can now use the attendance system.</p>
            <button
              onClick={onComplete}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Start Using System
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>
    </div>
  )
}