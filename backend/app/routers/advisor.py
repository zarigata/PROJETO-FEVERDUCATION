# CODEX: Advisor endpoint for student overview
from fastapi import APIRouter, Depends
from typing import List
from datetime import date
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lesson, Assignment, Grade, Classroom, UserRole, classroom_students
from app.schemas import AdvisorResponse
from app.routers.auth import require_role

router = APIRouter(prefix="/advisor", tags=["advisor"])

@router.get("/", response_model=AdvisorResponse)
def get_advisor(current_student=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    today = date.today()
    # upcoming lessons
    lessons = db.query(Lesson).join(Classroom).join(classroom_students).filter(
        classroom_students.c.student_id == current_student.id,
        Lesson.scheduled_date >= today
    ).order_by(Lesson.scheduled_date).all()
    # pending assignments
    assignments = db.query(Assignment).join(Classroom).join(classroom_students).filter(
        classroom_students.c.student_id == current_student.id
    ).all()
    completed_ids = [g.assignment_id for g in current_student.grades]
    pending_assignments = [a for a in assignments if a.id not in completed_ids]
    # low grades
    low_grades = [g for g in current_student.grades if g.score < 70]
    return AdvisorResponse(
        upcoming_lessons=lessons,
        pending_assignments=pending_assignments,
        low_grades=low_grades
    )
