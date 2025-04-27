# CODEX: CRUD routes for analytics
from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Analytics, UserRole, Classroom, Grade
from app.schemas import AnalyticsRead, AnalyticsSummaryItem
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

# CODEX: Summary analytics endpoint for dashboards
@router.get("/summary", response_model=List[AnalyticsSummaryItem])
def read_analytics_summary(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    items: List[AnalyticsSummaryItem] = []
    if current_user.role == UserRole.teacher:
        classes = db.query(Classroom).filter(Classroom.teacher_id == current_user.id).all()
        for c in classes:
            num_students = len(c.students)
            items.append(AnalyticsSummaryItem(label=c.name, value=str(num_students)))
    elif current_user.role == UserRole.student:
        grades = db.query(Grade).filter(Grade.student_id == current_user.id).all()
        total_grades = len(grades)
        avg = sum(g.score for g in grades) / total_grades if total_grades > 0 else 0
        assignments = []
        for classroom in current_user.classrooms:
            assignments.extend(classroom.assignments)
        total_assignments = len(assignments)
        completed = total_grades
        progress = int((completed / total_assignments) * 100) if total_assignments > 0 else 0
        items.append(AnalyticsSummaryItem(label="average_score", value=f"{avg:.1f}"))
        items.append(AnalyticsSummaryItem(label="assignments", value=f"{completed}/{total_assignments}"))
        items.append(AnalyticsSummaryItem(label="course_progress", value=f"{progress}%"))
    return items
