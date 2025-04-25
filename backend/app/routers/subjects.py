from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Subject, Classroom, UserRole
from app.schemas import SubjectCreate, SubjectRead
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/subjects", tags=["subjects"])

@router.post("/", response_model=SubjectRead)
def create_subject(subject_in: SubjectCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, subject_in.classroom_id)
    if not classroom or classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not classroom else 403, detail="Not allowed")
    subject = Subject(**subject_in.dict())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

@router.get("/", response_model=List[SubjectRead])
def read_subjects(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Subject).all()
    if current_user.role == UserRole.teacher:
        return db.query(Subject).join(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    subjects = []
    for classroom in current_user.classrooms:
        subjects.extend(classroom.subjects)
    return subjects

@router.get("/{subject_id}", response_model=SubjectRead)
def read_subject(subject_id: int, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    subject = db.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    if current_user.role == UserRole.admin or (current_user.role == UserRole.teacher and subject.classroom.teacher_id == current_user.id) or (current_user.role == UserRole.student and subject in subject.classroom.students):
        return subject
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.put("/{subject_id}", response_model=SubjectRead)
def update_subject(subject_id: int, subject_in: SubjectCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    subject = db.get(Subject, subject_id)
    if not subject or subject.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not subject else 403, detail="Not allowed")
    subject.name = subject_in.name
    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    subject = db.get(Subject, subject_id)
    if not subject or subject.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not subject else 403, detail="Not allowed")
    db.delete(subject)
    db.commit()
