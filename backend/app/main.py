# CODEX: Main FastAPI application for FeverDucation
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
import os
from app.models import User, UserRole
from app.security import get_password_hash
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.classrooms import router as classrooms_router
from app.routers.assignments import router as assignments_router
from app.routers.grades import router as grades_router
from app.routers.analytics import router as analytics_router
from app.routers.audit_logs import router as audit_logs_router
from app.routers.ai import router as ai_router
from app.routers.lessons import router as lessons_router
from app.routers.advisor import router as advisor_router
from app.routers.preferences import router as preferences_router
from app.routers.chat import router as chat_router
from app.routers.status import router as status_router

# Initialize FastAPI app
app = FastAPI(
    title="FeverDucation API",
    description="AI-powered educational platform backend",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# CODEX: Create DB tables on startup (development only)
Base.metadata.create_all(bind=engine)

# CODEX: Auto-create default admin user on startup
def create_default_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if admin_email and admin_password:
        db = SessionLocal()
        try:
            if not db.query(User).filter(User.email == admin_email).first():
                hashed = get_password_hash(admin_password)
                admin = User(email=admin_email, password_hash=hashed, role=UserRole.admin)
                db.add(admin)
                db.commit()
        finally:
            db.close()
create_default_admin()

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(classrooms_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")
app.include_router(grades_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(audit_logs_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(lessons_router, prefix="/api")
app.include_router(advisor_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(preferences_router, prefix="/api/user")
app.include_router(status_router, prefix="/api")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to FeverDucation API"}
