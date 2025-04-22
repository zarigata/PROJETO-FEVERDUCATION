# CODEX: CRUD routes for grade management
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Grade, Assignment, Classroom, UserRole
from app.schemas import GradeCreate, GradeRead
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/grades", tags=["grades"])

@router.post("/", response_model=GradeRead)
def create_grade(grade_in: GradeCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    assignment = db.get(Assignment, grade_in.assignment_id)
    if not assignment or assignment.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not assignment else 403, detail="Not allowed")
    grade = Grade(**grade_in.dict())
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade

@router.get("/", response_model=List[GradeRead])
def read_grades(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Grade).all()
    if current_user.role == UserRole.teacher:
        return db.query(Grade).join(Assignment).join(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    return db.query(Grade).filter(Grade.student_id == current_user.id).all()

@router.get("/{grade_id}", response_model=GradeRead)
def read_grade(grade_id: int, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    grade = db.get(Grade, grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    if current_user.role == UserRole.admin or (current_user.role == UserRole.teacher and grade.assignment.classroom.teacher_id == current_user.id) or (current_user.role == UserRole.student and grade.student_id == current_user.id):
        return grade
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.put("/{grade_id}", response_model=GradeRead)
def update_grade(grade_id: int, grade_in: GradeCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    grade = db.get(Grade, grade_id)
    if not grade or grade.assignment.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not grade else 403, detail="Not allowed")
    grade.score = grade_in.score
    db.commit()
    db.refresh(grade)
    return grade

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    grade = db.get(Grade, grade_id)
    if not grade or grade.assignment.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not grade else 403, detail="Not allowed")
    db.delete(grade)
    db.commit()
