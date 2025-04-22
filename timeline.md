Step-by-Step Development Plan for Educational Platform
Step 1: Project Setup and Environment Configuration

Objective: Establish the project structure and development environment.
Tasks:
Create a project directory with subfolders: backend, frontend, docker, docs, and config.
Initialize a Python virtual environment in the backend directory using python -m venv venv.
Install core Python dependencies: FastAPI (for API), uvicorn (ASGI server), pydantic (data validation), psycopg2-binary (PostgreSQL driver), python-jose (JWT), passlib (password hashing), PyYAML (config parsing), and requests (for Ollama API calls).
Set up a Git repository and create a .gitignore file to exclude venv, __pycache__, and sensitive files (e.g., config.yaml).
Create a config.yaml file in the config directory with placeholders for:
Ollama settings (IP, port, model name).
Database credentials (host, port, name, user, password).
Admin credentials (master username, hashed password).
JWT secret key and algorithm.


Write a basic README.md in the docs directory with setup instructions and project overview.


Docker Setup:
Create a Dockerfile in the backend directory for the Python backend:FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


Create a docker-compose.yml in the docker directory to define services (backend, frontend, database, Ollama):version: '3.8'
services:
  backend:
    build: ../backend
    ports:
      - "8000:8000"
    volumes:
      - ../backend:/app
      - ../config:/config
    environment:
      - CONFIG_PATH=/config/config.yaml
    depends_on:
      - db
      - ollama
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=edu_platform
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=securepassword
    volumes:
      - pgdata:/var/lib/postgresql/data
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
  frontend:
    build: ../frontend
    ports:
      - "3000:3000"
    volumes:
      - ../frontend:/app
volumes:
  pgdata:
  ollama_data:


Create a requirements.txt file in the backend directory listing all Python dependencies.


Security:
Ensure config.yaml is excluded from version control.
Use environment variables for sensitive Docker configurations (e.g., database credentials).



Step 2: Database Design and Setup

Objective: Design and initialize a PostgreSQL database for the application.
Tasks:
Choose PostgreSQL for its robustness and support for relational data with JSON fields for flexibility.
Design the database schema:
users: Stores user data (id, username, email, hashed_password, role [student/teacher/admin], created_at, timezone).
classrooms: Stores classroom data (id, name, teacher_id, schedule, timezone).
enrollments: Maps students to classrooms (student_id, classroom_id).
grades: Stores student grades (id, student_id, classroom_id, assignment_id, score, submitted_at).
assignments: Stores assignment details (id, classroom_id, title, description, due_date, ai_generated).
analytics: Stores precomputed analytics data (id, user_id, classroom_id, metric_type, value, generated_at).
audit_logs: Tracks admin actions (id, admin_id, action, target_user_id, timestamp).


Write SQL scripts in backend/db/schema.sql to create tables with appropriate constraints (e.g., foreign keys, unique indexes).
Implement a Python script (backend/db/init_db.py) using psycopg2 to connect to PostgreSQL, execute schema.sql, and insert a default admin user with a hashed password.
Update docker-compose.yml to mount schema.sql into the PostgreSQL container for initialization.


Security:
Hash passwords using passlib with bcrypt.
Restrict database access to the backend service using Docker network isolation.
Use parameterized queries to prevent SQL injection.



Step 3: Backend Development - Core API and Authentication

Objective: Build a secure FastAPI backend with user management and authentication.
Tasks:
Create a main.py in the backend directory to initialize the FastAPI app:from fastapi import FastAPI
from routers import auth, users, classrooms, analytics, ai
import yaml

app = FastAPI()

with open(os.getenv("CONFIG_PATH", "/config/config.yaml"), "r") as f:
    config = yaml.safe_load(f)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(classrooms.router)
app.include_router(analytics.router)
app.include_router(ai.router)


Implement authentication in backend/routers/auth.py:
Use JWT for token-based authentication with python-jose.
Create endpoints: /login (validate credentials, return JWT), /refresh (issue new token), /me (return current user details).
Secure endpoints with role-based middleware (e.g., restrict admin routes to admin role).


Implement user management in backend/routers/users.py:
Endpoints: /users (admin: create/delete/list users), /users/{id} (admin: update user, user: view own profile).
Validate input with Pydantic models (e.g., UserCreate, UserUpdate).
Hash passwords before storing in the database.


Create a utility module backend/utils/security.py for JWT handling, password hashing, and role checks.


Security:
Use HTTPS for all API communication (configure in Docker with a reverse proxy like Nginx if needed).
Implement rate limiting on authentication endpoints using slowapi.
Sanitize user inputs to prevent XSS and injection attacks.
Store JWT secret in config.yaml and rotate periodically.



Step 4: Backend Development - Core Features

Objective: Implement student, teacher, and admin functionalities.
Tasks:
Student Features (backend/routers/students.py):
Endpoint: /students/dashboard (return analytics, classrooms, grades).
Endpoint: /students/ai-tutor (send query to Ollama, return AI response).


Teacher Features (backend/routers/teachers.py):
Endpoint: /teachers/dashboard (return classrooms, analytics).
Endpoint: /teachers/lesson-generator (send prompt to Ollama, return quiz/lesson/text).
Endpoint: /teachers/analytics (AI-driven insights from student data).


Admin Features (backend/routers/admin.py):
Endpoint: /admin/users (CRUD operations for users).
Endpoint: /admin/audit (view audit logs).
Endpoint: /admin/health (check system status, e.g., database, Ollama).


Implement database queries in backend/db/queries.py for reusability (e.g., fetch classrooms, compute analytics).
Integrate Ollama in backend/utils/ai.py:import requests
from config import config

def query_ollama(prompt: str) -> str:
    response = requests.post(
        f"{config['ollama']['url']}/api/generate",
        json={"model": config['ollama']['model'], "prompt": prompt}
    )
    return response.json().get("response", "")




Docker:
Ensure Ollama service is accessible to the backend via Docker network.
Mount config.yaml as a volume to the backend container.


Security:
Restrict admin endpoints to admin role using JWT claims.
Log all admin actions to audit_logs table.



Step 5: Frontend Development

Objective: Build a responsive React frontend with modular styling and internationalization.
Tasks:
Initialize a React app in the frontend directory using Vite:npm create vite@latest frontend -- --template react


Install dependencies: react-router-dom, axios, i18next, react-i18next, tailwindcss, postcss, autoprefixer.
Set up Tailwind CSS for modular styling:/* frontend/src/styles/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;


Create a Dockerfile in the frontend directory:FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]


Implement components:
StudentDashboard: Display analytics, classrooms, grades, AI tutor chat.
TeacherDashboard: Show classrooms, analytics, lesson generator form.
AdminDashboard: User management, audit logs, system health.


Set up internationalization with i18next:
Create frontend/src/locales/en.json and es.json for English and Spanish translations.
Add a language switcher component to toggle languages.


Create a frontend/src/styles/themes directory for custom CSS themes (e.g., light.css, dark.css).
Implement API calls to the backend using axios with JWT authentication.


Security:
Store JWT in HttpOnly cookies or secure local storage.
Sanitize user inputs in forms to prevent XSS.
Use Content Security Policy (CSP) headers in production.



Step 6: AI Integration

Objective: Fully integrate Ollama for AI tutor and lesson generator.
Tasks:
Configure Ollama in config.yaml:ollama:
  url: http://ollama:11434
  model: llama3


Implement AI tutor logic in backend/routers/students.py:
Accept student queries, format prompts, and query Ollama.
Cache responses to reduce load on Ollama.


Implement lesson generator in backend/routers/teachers.py:
Accept parameters (e.g., subject, type [quiz/lesson/text], difficulty).
Generate structured output (e.g., JSON for quizzes) using Ollama.


Optimize AI performance by limiting concurrent requests and setting timeouts.


Docker:
Ensure Ollama container has sufficient resources (CPU, memory).
Test connectivity between backend and Ollama containers.



Step 7: Testing

Objective: Ensure the application is robust and secure.
Tasks:
Write unit tests for backend using pytest (e.g., test authentication, user creation, AI endpoints).
Write integration tests to verify API-database interactions.
Test frontend components with Vitest or Jest.
Perform security testing:
Check for SQL injection vulnerabilities.
Test JWT authentication and role-based access.
Validate input sanitization.


Test Docker setup by running docker-compose up and verifying all services start correctly.


Security:
Use tools like bandit for static code analysis in Python.
Scan Docker images for vulnerabilities with docker scan.



Step 8: Documentation and Customization

Objective: Provide comprehensive documentation and enable customization.
Tasks:
Update README.md with:
Setup instructions for Docker and local development.
Configuration guide for config.yaml.
Instructions for adding custom CSS themes.
Guide for adding new languages to i18next.


Create a docs/customization.md file explaining how to:
Modify Tailwind CSS classes.
Add new themes in frontend/src/styles/themes.
Update translations in frontend/src/locales.


Provide example custom CSS files in frontend/src/styles/themes.


Docker:
Include a script to rebuild Docker images after customization (docker/rebuild.sh).



Step 9: Deployment Preparation

Objective: Prepare the application for production.
Tasks:
Configure a production docker-compose.prod.yml with:
Nginx as a reverse proxy for HTTPS.
Scaled backend instances for load balancing.
Persistent volumes for database and Ollama data.


Set up environment variables for production (e.g., CONFIG_PATH, POSTGRES_PASSWORD).
Optimize backend performance:
Enable database connection pooling with asyncpg.
Cache frequently accessed data (e.g., analytics) with Redis (add to docker-compose.yml).


Optimize frontend:
Build production bundle with npm run build.
Serve with Nginx in the frontend container.




Security:
Generate a strong JWT secret and update config.yaml.
Configure CORS to allow only trusted origins.
Enable HTTPS with Let’s Encrypt certificates.



Step 10: Final Validation and Launch

Objective: Validate the application and deploy it.
Tasks:
Run end-to-end tests to verify all features (student, teacher, admin dashboards; AI tutor; lesson generator).
Test language switching and theme customization.
Deploy the application using docker-compose -f docker-compose.prod.yml up -d.
Monitor logs (docker-compose logs) to ensure no errors.
Perform a final security audit (e.g., check for exposed ports, validate HTTPS).
Announce the launch and provide access to documentation.


Security:
Set up monitoring for unauthorized access attempts.
Schedule regular backups of the database and config.yaml.



