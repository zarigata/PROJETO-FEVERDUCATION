#!/bin/bash

# FeverDucation Docker Setup Script
# This script sets up the FeverDucation application with Supabase

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}FeverDucation Docker Setup Script${NC}"
echo "This script will set up the FeverDucation application with Supabase"
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Create .env file
echo -e "${YELLOW}Creating .env file...${NC}"

# Generate random passwords and keys
POSTGRES_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
SUPABASE_ANON_KEY=$(openssl rand -base64 32)
SUPABASE_SERVICE_ROLE_KEY=$(openssl rand -base64 32)
DASHBOARD_USERNAME="admin"
DASHBOARD_PASSWORD=$(openssl rand -base64 12)

# Create .env file
cat > .env << EOF
# Database
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# Supabase
SUPABASE_URL=http://localhost:54321
JWT_SECRET=${JWT_SECRET}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Supabase Studio
DASHBOARD_USERNAME=${DASHBOARD_USERNAME}
DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}

# Admin User
ADMIN_EMAIL=admin@fevereducation.com
ADMIN_PASSWORD=Admin123!
EOF

echo -e "${GREEN}Environment file created successfully.${NC}"

# Create Supabase migrations directory
echo -e "${YELLOW}Creating Supabase migrations directory...${NC}"
mkdir -p supabase/migrations

# Create initial migration script
cat > supabase/migrations/01_initial_schema.sql << EOF
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

-- Create RLS policies
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
EOF

echo -e "${GREEN}Migration script created successfully.${NC}"

# Create admin user creation script
cat > supabase/migrations/02_create_admin.sql << EOF
-- Create admin user
DO \$\$
DECLARE
  admin_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_id FROM auth.users WHERE email = '${ADMIN_EMAIL}';
  
  -- If admin user doesn't exist, create it
  IF admin_id IS NULL THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at
    ) VALUES (
      '${ADMIN_EMAIL}',
      '{"full_name": "Admin User", "role": "admin"}',
      NOW()
    ) RETURNING id INTO admin_id;
    
    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      admin_id,
      jsonb_build_object('sub', admin_id, 'email', '${ADMIN_EMAIL}'),
      'email',
      NOW(),
      NOW(),
      NOW()
    );
    
    -- Insert into profiles
    INSERT INTO profiles (
      id,
      email,
      full_name,
      role,
      created_at
    ) VALUES (
      admin_id,
      '${ADMIN_EMAIL}',
      'Admin User',
      'admin',
      NOW()
    );
    
    -- Set admin password
    UPDATE auth.users
    SET encrypted_password = crypt('${ADMIN_PASSWORD}', gen_salt('bf'))
    WHERE id = admin_id;
  END IF;
END \$\$;
EOF

echo -e "${GREEN}Admin user creation script created successfully.${NC}"

# Create seed data script
cat > supabase/migrations/03_seed_data.sql << EOF
-- Seed performance_data
INSERT INTO performance_data (month, score, attendance, participation)
VALUES
  ('Jan', 75, 92, 68),
  ('Feb', 82, 89, 75),
  ('Mar', 78, 94, 72),
  ('Apr', 85, 91, 80),
  ('May', 88, 95, 85),
  ('Jun', 92, 97, 90);

-- Seed subject_data
INSERT INTO subject_data (name, students, avg_score, color)
VALUES
  ('Biology', 32, 85, '#8b5cf6'),
  ('Chemistry', 28, 78, '#06b6d4'),
  ('Physics', 24, 82, '#f97316'),
  ('Mathematics', 30, 76, '#10b981');

-- Seed class_distribution
INSERT INTO class_distribution (name, value, color)
VALUES
  ('Science', 5, '#8b5cf6'),
  ('Math', 4, '#06b6d4'),
  ('Language', 3, '#f97316'),
  ('History', 2, '#10b981');
EOF

echo -e "${GREEN}Seed data script created successfully.${NC}"

# Create init script
cat > init.sh << EOF
#!/bin/bash

# Wait for Supabase to be ready
echo "Waiting for Supabase to be ready..."
sleep 30

# Create admin user
echo "Creating admin user..."
curl -X POST http://localhost:54321/rest/v1/rpc/create_admin_user \
  -H "apikey: \${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email": "\${ADMIN_EMAIL}", "password": "\${ADMIN_PASSWORD}"}'

echo "Setup complete!"
EOF

chmod +x init.sh

echo -e "${GREEN}Initialization script created successfully.${NC}"

# Start Docker Compose
echo -e "${YELLOW}Starting Docker Compose...${NC}"
docker-compose up -d

echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

echo -e "${GREEN}Setup complete!${NC}"
echo
echo -e "${YELLOW}Supabase Studio:${NC} http://localhost:54322"
echo -e "${YELLOW}Username:${NC} ${DASHBOARD_USERNAME}"
echo -e "${YELLOW}Password:${NC} ${DASHBOARD_PASSWORD}"
echo
echo -e "${YELLOW}Application:${NC} http://localhost:3000"
echo
echo -e "${YELLOW}Admin User:${NC}"
echo -e "${YELLOW}Email:${NC} ${ADMIN_EMAIL}"
echo -e "${YELLOW}Password:${NC} ${ADMIN_PASSWORD}"
echo
echo -e "${GREEN}You can now access the application and Supabase Studio.${NC}"
