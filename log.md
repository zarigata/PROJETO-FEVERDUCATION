# FeverDucation Modification Log (Steps 1–3)

This document details all code and configuration changes made to implement Steps 1–3 of the project plan.

---

## Step 1: Project Setup

1. Monorepo & Environment
   - Created directories: `backend/`, `frontend/`, `config/`, `.gitignore`.
   - Initialized Python virtual environment in `backend/venv`.

2. Configuration
   - Added `config.yaml` at project root:
     ```yaml
     database:
       url: postgres://user:pass@localhost:5432/feverducation

     ollama:
       host: 192.168.15.115  # external Ollama server IP
       model: llama3.2       # default model

     jwt:
       secret_key: YOUR_SECRET
       algorithm: HS256
       access_token_expires: 15
       refresh_token_expires: 60
     ```
   - Created `app/config.py`:
     - Loaded `config.yaml` via `PyYAML`.
     - Merged with `.env` loaded by `python-dotenv`.
     - Exposed typed settings via Pydantic `BaseSettings`.

3. Dependencies
   - Populated `backend/requirements.txt`:
     ```text
     fastapi>=0.95.0
     "uvicorn[standard]"
     sqlalchemy>=2.0.0
     psycopg2-binary>=2.9.0
     python-jose[cryptography]>=3.3.0
     passlib[bcrypt]>=1.7.4
     pydantic>=1.10.0
     python-dotenv>=1.0.0
     python-multipart>=0.0.5
     httpx>=0.23.0
     ```
   - Installed deps with `pip install -r requirements.txt`.

---

## Step 2: Database Implementation

1. `app/database.py`
   - Configured SQLAlchemy `engine` using `settings.database.url`.
   - Defined `SessionLocal = sessionmaker(...)` and `Base = declarative_base()`.
   - Implemented `get_db()` dependency for request-scoped sessions.

2. `app/models.py`
   - Defined ORM models:
     - `User(id, email, password_hash, role, timezone, language)`
     - `Classroom(id, name, teacher_id, students)`
     - `Assignment(id, title, description, due_date, classroom_id)`
     - `Grade(id, student_id, assignment_id, score, feedback)`
     - `Analytics(id, user_id, type, data)`
     - `AuditLog(id, admin_id, action, timestamp)`
   - Added relationships and indexes.

3. Alembic
   - Initialized Alembic in `backend/alembic/`.
   - Generated initial migration (`alembic revision --autogenerate -m 

---

## Step 3: Frontend Development
- Added `src/api.ts` as central API client with auth interceptor.
- Created components:
  - `CSSSettings.tsx` (CSS presets & custom CSS upload)
  - `StudentDashboard.tsx` (analytics, classrooms, grades, AI Tutor chat)
  - `TeacherDashboard.tsx` (analytics, classroom CRUD, lesson generator)
  - `AdminDashboard.tsx` (user management, audit logs, system status)
  - `PrivateRoute.tsx` for role-based route protection
- Updated `Login.tsx` to use API client and redirect based on user role
- Wrapped protected routes with `PrivateRoute` in `App.tsx`
- Added `public/styles/fonts.css` with Roboto & Noto Sans JP; linked in `public/index.html`
- Added CSS preset files under `src/styles/presets` (light, dark, high-contrast)
- Extended locales (en, pt, jp) with new translation keys: analytics, classrooms, grades, ai_tutor, lesson_generator, generate, users

---

## Step 4: Frontend Development
- Added `src/api.ts` as central API client with auth interceptor.
- Created components:
  - `CSSSettings.tsx` (CSS presets & custom CSS upload)
  - `StudentDashboard.tsx` (analytics, classrooms, grades, AI Tutor chat)
  - `TeacherDashboard.tsx` (analytics, classroom CRUD, lesson generator)
  - `AdminDashboard.tsx` (user management, audit logs, system status)
  - `PrivateRoute.tsx` for role-based route protection
- Updated `Login.tsx` to use API client and redirect based on user role
- Wrapped protected routes with `PrivateRoute` in `App.tsx`
- Added `public/styles/fonts.css` with Roboto & Noto Sans JP; linked in `public/index.html`
- Added CSS preset files under `src/styles/presets` (light, dark, high-contrast)
- Extended locales (en, pt, jp) with new translation keys: analytics, classrooms, grades, ai_tutor, lesson_generator, generate, users

---

## Step 5: Registration & Admin Provisioning

1. **Backend:**
   - Added `/auth/register` endpoint with `RegisterModel` and `response_model=UserRead`.
   - Hashed passwords via `get_password_hash` and created tables on startup (`Base.metadata.create_all`).
   - Seeded default admin using `create_default_admin()` reading `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`.

2. **Frontend:**
   - Updated `src/api.ts` baseURL to include `/api` prefix.
   - Modified `Register.tsx` to send JSON payload, log responses/errors, and navigate on success.

3. **CORS & Proxy:**
   - Restricted CORS origins in `main.py` to `http://localhost:3000` and `http://localhost:3001`.
   - Added `frontend/nginx.conf` to proxy `/api/` to backend and fallback to `index.html` for SPA.
   - Updated `frontend/Dockerfile` to use Nginx on port 80 and copy `nginx.conf`.
   - Remapped ports in `docker-compose.yml` (frontend: `3000:80`) and added `env_file` for backend.

4. **Environment Management:**
   - Created `.env.example` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` presets.
   - Configured backend service in `docker-compose.yml` to load root `.env` via `env_file`.
