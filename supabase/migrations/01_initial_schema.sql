-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ CODEX: FeverDucation Database Schema - Initial Migration                   ║
-- ║ Created by: Cascade AI Assistant                                           ║
-- ║ Purpose: Sets up the initial database schema for the FeverDucation platform ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  grade TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  current_topic TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_ids INTEGER[] DEFAULT '{}',
  performance INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'at-risk')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance_data table
CREATE TABLE IF NOT EXISTS performance_data (
  id SERIAL PRIMARY KEY,
  month VARCHAR(255) NOT NULL,
  score NUMERIC NOT NULL,
  attendance NUMERIC NOT NULL,
  participation NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subject_data table
CREATE TABLE IF NOT EXISTS subject_data (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  students INTEGER NOT NULL,
  avg_score NUMERIC NOT NULL,
  color VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_distribution table
CREATE TABLE IF NOT EXISTS class_distribution (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value INTEGER NOT NULL,
  color VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ CODEX: Row Level Security Policies                                        ║
-- ║ Purpose: Implements security rules for data access control                 ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_distribution ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for classes
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT USING (true);

CREATE POLICY "Teachers can insert their own classes" ON classes
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own classes" ON classes
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own classes" ON classes
  FOR DELETE USING (auth.uid() = teacher_id);

-- Create policies for students
CREATE POLICY "Students are viewable by everyone" ON students
  FOR SELECT USING (true);

-- Create policies for performance_data
CREATE POLICY "Performance data is viewable by everyone" ON performance_data
  FOR SELECT USING (true);

-- Create policies for subject_data
CREATE POLICY "Subject data is viewable by everyone" ON subject_data
  FOR SELECT USING (true);

-- Create policies for class_distribution
CREATE POLICY "Class distribution is viewable by everyone" ON class_distribution
  FOR SELECT USING (true);

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ CODEX: Admin Role Function                                                ║
-- ║ Purpose: Provides admin access control functionality                       ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policies
CREATE POLICY "Admins can do everything with profiles" ON profiles
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can do everything with classes" ON classes
  USING (is_admin() OR auth.uid() = teacher_id)
  WITH CHECK (is_admin() OR auth.uid() = teacher_id);

CREATE POLICY "Admins can do everything with students" ON students
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can do everything with performance_data" ON performance_data
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can do everything with subject_data" ON subject_data
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can do everything with class_distribution" ON class_distribution
  USING (is_admin())
  WITH CHECK (is_admin());

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ CODEX: Sample Data Insertion                                              ║
-- ║ Purpose: Provides initial data for testing and demonstration               ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- Insert sample performance data
INSERT INTO performance_data (month, score, attendance, participation)
VALUES
  ('Jan', 65, 80, 70),
  ('Feb', 70, 82, 72),
  ('Mar', 75, 85, 75),
  ('Apr', 80, 87, 78),
  ('May', 85, 90, 82),
  ('Jun', 90, 92, 85);

-- Insert sample subject data
INSERT INTO subject_data (name, students, avg_score, color)
VALUES
  ('Mathematics', 120, 78, '#4CAF50'),
  ('Science', 110, 82, '#2196F3'),
  ('History', 90, 75, '#FFC107'),
  ('Language', 100, 80, '#9C27B0'),
  ('Arts', 70, 85, '#FF5722');

-- Insert sample class distribution
INSERT INTO class_distribution (name, value, color)
VALUES
  ('Grade 6', 120, '#4CAF50'),
  ('Grade 7', 150, '#2196F3'),
  ('Grade 8', 100, '#FFC107'),
  ('Grade 9', 130, '#9C27B0'),
  ('Grade 10', 110, '#FF5722');
