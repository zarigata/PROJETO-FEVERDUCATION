-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    timezone VARCHAR(50)
);

-- Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    schedule JSONB,
    timezone VARCHAR(50)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, classroom_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    ai_generated BOOLEAN DEFAULT FALSE
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    score NUMERIC,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    metric_type VARCHAR(50),
    value NUMERIC,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT,
    target_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
