/*
  # Create attendance system tables

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `matric_number` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `department` (text)
      - `level` (text)
      - `phone_number` (text)
      - `created_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `title` (text)
      - `credit_unit` (integer)
      - `lecturer` (text)
      - `department` (text)
      - `level` (text)
      - `semester` (text)
      - `session` (text)
      - `created_at` (timestamp)
    
    - `attendance_sessions`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `week` (integer)
      - `date` (text)
      - `start_time` (text)
      - `end_time` (text)
      - `qr_code` (text)
      - `is_active` (boolean)
      - `location` (text)
      - `created_at` (timestamp)
    
    - `attendance_records`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `matric_number` (text)
      - `marked_at` (timestamp)
      - `status` (text)
      - `location` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (for demo purposes)
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matric_number text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  department text NOT NULL DEFAULT 'Computer Science',
  level text NOT NULL,
  phone_number text,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  credit_unit integer NOT NULL DEFAULT 3,
  lecturer text NOT NULL,
  department text NOT NULL DEFAULT 'Computer Science',
  level text NOT NULL,
  semester text NOT NULL,
  session text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create attendance_sessions table
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  week integer NOT NULL,
  date text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  qr_code text NOT NULL,
  is_active boolean DEFAULT false,
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  matric_number text NOT NULL,
  marked_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('present', 'late', 'absent')),
  location text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you would restrict these based on user roles

CREATE POLICY "Allow all operations on students" ON students
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on courses" ON courses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on attendance_sessions" ON attendance_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on attendance_records" ON attendance_records
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_matric_number ON students(matric_number);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_course_id ON attendance_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_is_active ON attendance_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON attendance_records(student_id);