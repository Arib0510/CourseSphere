-- =============================================
-- University Course Registration System
-- Database Schema & Row Level Security
-- =============================================

-- =============================================
-- 1. TABLES
-- =============================================

-- Profiles table: extends Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    student_id TEXT UNIQUE,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table: all available courses
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_no TEXT UNIQUE NOT NULL,
    course_title TEXT NOT NULL,
    credits NUMERIC(4,2) NOT NULL CHECK (credits > 0),
    credit_hours NUMERIC(4,2) NOT NULL CHECK (credit_hours > 0),
    academic_year TEXT,
    semester TEXT,
    category TEXT,
    capacity INTEGER DEFAULT 40 CHECK (capacity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations table: student-course enrollments
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(student_id, course_id)
);

-- Admins table: stores admin emails
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. INDEXES (for query performance)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_academic_year ON courses(academic_year);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_no ON courses(course_no);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);

-- =============================================
-- 3. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ----- PROFILES POLICIES -----

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ----- COURSES POLICIES -----

-- Anyone (authenticated) can view courses
CREATE POLICY "Courses are viewable by everyone"
ON courses FOR SELECT
USING (true);

-- Only service role (backend admin) can insert/update/delete courses
-- These operations go through the backend with supabaseAdmin client

-- ----- REGISTRATIONS POLICIES -----

-- Students can view their own registrations
CREATE POLICY "Students view own registrations"
ON registrations FOR SELECT
USING (auth.uid() = student_id);

-- Students can insert their own registrations
CREATE POLICY "Students insert own registrations"
ON registrations FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Students can delete their own registrations
CREATE POLICY "Students delete own registrations"
ON registrations FOR DELETE
USING (auth.uid() = student_id);

-- ----- ADMINS POLICIES -----

-- Admins table is only accessed via service role (backend)
-- No direct client access needed

-- =============================================
-- 4. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for courses
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: when a new user signs up via Supabase Auth
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
