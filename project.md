FeverDucation Project Development Guide
This document outlines the fundamental process and final steps for developing FeverDucation, an AI-powered educational platform for students, teachers, and administrators. The platform supports Portuguese, English, and Japanese, with a modular, scalable architecture and a Google/Android-inspired design. It is fully Dockerized (except for the Ollama AI server) and includes a customizable CSS filter for user-driven design changes. This guide is intended for AI developers or human contributors to ensure a consistent, production-ready implementation.

Project Overview
FeverDucation is a web-based educational platform with three user roles:

Students: Access dashboards with analytics, classrooms, grades, and an AI Tutor for homework and lesson support.
Teachers: Manage classrooms, generate AI-powered lessons (quizzes, text, etc.), and view advanced analytics with AI insights.
Administrators: Oversee user management, system monitoring, and data troubleshooting via a hidden dashboard (local access only).

The platform emphasizes modularity, multilingual support (Portuguese, English, Japanese), and a clean, modern UI. It uses Python (FastAPI) for the backend, TypeScript (React) for the frontend, PostgreSQL for the database, and Ollama for AI features, all configured via a config.yaml file.

# Project Development Plan

## Step-by-Step Development Plan

- [x] 1. Project Setup: Initialize monorepo, set up dependencies, create config.yaml.
- [ ] 2. Database Implementation: Design and migrate PostgreSQL schema with SQLAlchemy.
- [ ] 3. Backend Development: Build RESTful APIs, JWT auth, RBAC, and Ollama integration.
- [ ] 4. Frontend Development: React components, i18next, and Tailwind CSS styling.
- [ ] 5. AI Features: AI Tutor, Lesson Generator, AI Analytics.
- [ ] 6. Dockerization: Dockerfiles for backend, frontend, DB, and Docker Compose.
- [ ] 7. Testing: Unit and integration tests for backend and frontend.
- [ ] 8. Documentation: README, API docs, customization guides.
- [ ] 9. Deployment: Production setup, cloud deployment instructions, monitoring.

Fundamental Development Process
1. Project Setup

Objective: Establish the project structure and dependencies.
Steps:
Create a monorepo with directories: backend/, frontend/, docker/, config/.
Initialize backend with Python (FastAPI) and frontend with TypeScript (React).
Set up PostgreSQL as the database.
Create a config.yaml file in config/ for:
Ollama server IP and model (e.g., llama3.2).
Master admin credentials (username, password).
Database connection details.


Install dependencies:
Backend: fastapi, sqlalchemy, psycopg2, python-jwt, pyyaml.
Frontend: react, typescript, tailwindcss, i18next, axios.


Configure ESLint and Prettier for code consistency.



2. Database Design

Objective: Create a scalable database schema.
Steps:
Use PostgreSQL with SQLAlchemy for ORM.
Define tables:
users: id, role (student/teacher/admin), email, password_hash, time_zone, language (pt/en/jp).
classrooms: id, name, teacher_id, student_ids (array).
grades: id, student_id, assignment_id, score, feedback.
analytics: id, user_id, type (progress/engagement), data (JSON).
audit_logs: id, admin_id, action, timestamp.


Add indexes on users.email, classrooms.teacher_id, and grades.student_id for performance.
Migrate schema using Alembic and seed initial data (admin user, sample classroom).



3. Backend Development

Objective: Build RESTful APIs and integrate Ollama.
Steps:
Implement APIs:
/auth: Login, register, refresh JWT tokens.
/users: CRUD operations (admin-only for create/delete).
/classrooms: Create, update, list, join/leave (role-based).
/grades: Submit, view, update grades.
/analytics: Fetch analytics data (student/teacher-specific).
/ai/tutor: Proxy student queries to Ollama for AI Tutor.
/ai/lesson: Generate lessons/quizzes via Ollama (teachers).
/ai/analytics: Generate AI insights for teachers.


Secure APIs with JWT and role-based access control (RBAC).
Connect to Ollama via HTTP (configurable IP in config.yaml):
Use requests library for API calls.
Implement retry logic and caching (Redis for AI responses).


Add admin-only endpoints for user management and audit logs.
Ensure APIs support multilingual error messages (pt/en/jp).



4. Frontend Development

Objective: Create a responsive, multilingual UI with customizable styles.
Steps:
Set up React with TypeScript and Tailwind CSS.
Implement components:
Login Screen: Branded with FeverDucation logo, supports pt/en/jp.
Student Dashboard: Displays analytics, classrooms, grades, AI Tutor chat.
Teacher Dashboard: Shows analytics, classroom management, lesson generator.
Admin Dashboard: User management, audit logs, system status (local-only).


Use i18next for multilingual support:
Create JSON files: locales/pt.json, locales/en.json, locales/jp.json.
Add language switcher in the UI (dropdown or flags).


Implement CSS Filter:
Add a user management section (admin/teacher) to select design presets.
Store presets in frontend/src/styles/presets/ (e.g., dark.css, light.css, high-contrast.css).
Allow users to upload custom CSS files via a form (stored in public/styles/user/).
Apply selected CSS dynamically using React state and <style> tags.


Host fonts and styles locally:
Download Roboto (for en/pt) and Noto Sans JP (for jp) from Google Fonts.
Store in frontend/public/fonts/ and reference in CSS (@font-face).
Store Tailwind-generated CSS in frontend/public/styles/base.css.


Ensure WCAG 2.1 compliance (keyboard navigation, ARIA labels).



5. AI Integration

Objective: Enable AI Tutor, Lesson Generator, and Analytics.
Steps:
AI Tutor:
Create a chat interface for students to query Ollama.
Process responses to guide without direct answers (e.g., hints, explanations).


Lesson Generator:
Allow teachers to input parameters (topic, type: quiz/lesson/text, difficulty).
Send to Ollama and format output (e.g., JSON for quizzes).


AI Analytics:
Analyze student data (grades, activity) via Ollama.
Generate insights (e.g., “Student X struggles with algebra”).


Cache AI responses in Redis to reduce Ollama load.
Add error handling for Ollama downtime.



6. Dockerization

Objective: Containerize the application for production.
Steps:
Create Dockerfiles:
Backend: Use python:3.11-slim, install dependencies, copy backend/.
Frontend: Use node:18, build React app, serve with Nginx.
Database: Use postgres:15, initialize with schema.


Write docker-compose.yml:
Services: backend, frontend, db, redis.
Environment variables: Database URL, Ollama IP, JWT secret.
Network: Internal bridge network.


Exclude Ollama (runs on separate server, e.g., 192.168.15.115).
Test locally with docker-compose up.



7. Testing

Objective: Ensure reliability and functionality.
Steps:
Backend: Write unit tests with pytest for APIs and Ollama integration.
Frontend: Use Jest and React Testing Library for component tests.
Integration: Test API-frontend communication and language switching.
Test CSS filter: Verify preset switching and custom CSS uploads.
Validate multilingual support (pt/en/jp) and font rendering.



8. Documentation

Objective: Provide clear setup and customization guides.
Steps:
Create README.md:
Project overview, setup instructions, Docker commands.
Configuration guide for config.yaml (Ollama, database).
Customization instructions for CSS presets and language files.


Generate OpenAPI documentation for APIs (via FastAPI /docs).
Document CSS filter usage and font hosting.




Final Steps for Completion

Code Review:

Validate code against requirements (modularity, multilingual support, AI integration).
Ensure no external font/style CDNs are used (all hosted in frontend/public/).


Production Deployment:

Deploy Docker containers on a cloud provider (e.g., AWS ECS, GCP Cloud Run).
Configure reverse proxy (Nginx) for HTTPS.
Set up monitoring (Prometheus) and logging (Loki).


User Testing:

Test with sample users (student, teacher, admin) in pt/en/jp.
Verify AI features (Tutor, Lesson Generator, Analytics).
Confirm CSS filter functionality and style customization.


Community Customization:

Publish frontend/public/styles/ and frontend/locales/ to a GitHub repository.
Provide templates for custom CSS presets and language files.
Encourage contributions via pull requests.


Maintenance Plan:

Schedule regular updates for Ollama models and dependencies.
Monitor audit logs for admin actions and system issues.
Add new languages (e.g., Spanish, French) as needed.




Style Description
The UI follows a Google/Android-inspired aesthetic:

Colors: Material Design palette (primary: #6200EE, secondary: #03DAC6, background: #F5F5F5).
Typography:
Roboto: Used for English and Portuguese (weights: 400, 500, 700).
Noto Sans JP: Used for Japanese (weights: 400, 500, 700).
Fonts are downloaded and hosted in frontend/public/fonts/ to avoid CDN dependencies.


Layout: Clean, minimal, with card-based components and rounded corners.
Animations: Subtle transitions (e.g., 0.3s ease-in-out for hover effects).
Customization:
CSS filter allows users to switch between presets (e.g., dark, light, high-contrast).
Custom CSS uploads are stored in public/styles/user/ and applied dynamically.
Presets are defined in frontend/src/styles/presets/ (e.g., --primary-color, --font-family).




Additional Details

Languages: Support Portuguese (Brazil), English (US), and Japanese. Extendable via locales/ files.
CSS Filter:
Accessible in user management (admin/teacher roles).
Options: Select preset, upload custom CSS, preview changes.
Store user preferences in users table (style_preference column).


Local Assets:
Fonts: frontend/public/fonts/roboto/, frontend/public/fonts/noto-sans-jp/.
Styles: frontend/public/styles/base.css, frontend/public/styles/presets/.


Security:
Admin dashboard accessible only on local server (e.g., 127.0.0.1 or 192.168.15.115).
Encrypt sensitive data (passwords, API keys) with bcrypt and environment variables.


Modularity:
Backend: Separate modules for auth, classrooms, AI, analytics.
Frontend: Reusable React components and hooks.
Easy upgrades via clear folder structure and documentation.




Deliverables

Full codebase: backend/, frontend/, docker/, config/.
config.yaml for Ollama, database, and admin settings.
Locally hosted fonts and styles in frontend/public/.
CSS filter implementation with preset and custom upload support.
Comprehensive README.md and OpenAPI docs.
Test suites for backend and frontend.
Public GitHub repository for styles and locales.


This guide ensures FeverDucation is developed with modularity, scalability, and user-driven customization, ready for production and future upgrades.
