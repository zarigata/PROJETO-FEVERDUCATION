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
