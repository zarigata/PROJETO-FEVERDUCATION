# CODEX: Main FastAPI application for FeverDucation
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.classrooms import router as classrooms_router
from app.routers.assignments import router as assignments_router
from app.routers.grades import router as grades_router
from app.routers.analytics import router as analytics_router
from app.routers.audit_logs import router as audit_logs_router
from app.routers.ai import router as ai_router

# Initialize FastAPI app
app = FastAPI(
    title="FeverDucation API",
    description="AI-powered educational platform backend",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(classrooms_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")
app.include_router(grades_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(audit_logs_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to FeverDucation API"}
