# CODEX: CRUD routes for analytics
from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Analytics, UserRole
from app.schemas import AnalyticsRead
from app.routers.auth import get_current_active_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/", response_model=List[AnalyticsRead])
def read_analytics(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Analytics).all()
    if current_user.role == UserRole.teacher:
        return db.query(Analytics).filter(Analytics.teacher_id == current_user.id).all()
    # Student
    return db.query(Analytics).filter(Analytics.student_id == current_user.id).all()
