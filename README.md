# FeverDucation - AI-powered Learning Platform

FeverDucation is an AI-powered teaching platform that revolutionizes education for both teachers and students.

## Features

- **Teacher Dashboard**: Analytics, class management, and student tracking
- **AI Class Generator**: Create engaging lessons in seconds
- **AI Homework Builder**: Generate personalized assignments
- **Student Portal**: Access classes, quizzes, and learning materials
- **AI Tutor**: 24/7 learning assistance for students
- **Admin Panel**: Manage users, classes, and system settings

## Tech Stack

- Next.js
- React
- Tailwind CSS
- shadcn/ui components
- Supabase (Authentication & Database)
- Docker

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Quick Start

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/fevereducation.git
   cd fevereducation
   \`\`\`

2. Run the setup script:
   \`\`\`bash
   chmod +x setup.sh
   ./setup.sh
   \`\`\`

3. The setup script will:
   - Create necessary environment variables
   - Set up Supabase with initial schema
   - Create an admin user
   - Seed the database with sample data
   - Start the application

4. Access the application:
   - Application: http://localhost:3000
   - Supabase Studio: http://localhost:54322

### Manual Setup

If you prefer to set up manually:

1. Create a `.env` file with the following variables:
   \`\`\`
   # Database
   POSTGRES_PASSWORD=your_postgres_password

   # Supabase
   SUPABASE_URL=http://localhost:54321
   JWT_SECRET=your_jwt_secret
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

   # Supabase Studio
   DASHBOARD_USERNAME=admin
   DASHBOARD_PASSWORD=your_dashboard_password

   # Admin User
   ADMIN_EMAIL=admin@fevereducation.com
   ADMIN_PASSWORD=your_admin_password
   \`\`\`

2. Start the services:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. Initialize the database:
   \`\`\`bash
   docker-compose exec supabase psql -U postgres -f /docker-entrypoint-initdb.d/01_initial_schema.sql
   docker-compose exec supabase psql -U postgres -f /docker-entrypoint-initdb.d/02_create_admin.sql
   docker-compose exec supabase psql -U postgres -f /docker-entrypoint-initdb.d/03_seed_data.sql
   \`\`\`

## Administrator Access

The setup script creates an admin user with the following credentials:

- Email: admin@fevereducation.com
- Password: Admin123!

To access the admin panel, log in with these credentials and navigate to `/admin/dashboard`.

## User Management

Administrators can manage users through the admin panel:

1. Log in as an admin
2. Navigate to `/admin/dashboard`
3. Click on "Manage Users"

From there, you can:
- View all users
- Add new users
- Edit existing users
- Delete users
- Change user roles

## Security

- The admin panel is hidden and only accessible to users with the admin role
- Role-based access control is implemented for all features
- Supabase Row Level Security (RLS) policies protect data
- All passwords are securely hashed

## Development

### Local Development

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/fevereducation.git
   cd fevereducation
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT
