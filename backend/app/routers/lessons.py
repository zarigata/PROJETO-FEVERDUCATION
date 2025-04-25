# CODEX: Lesson scheduling endpoints
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models import Lesson, Classroom, UserRole
from app.schemas import LessonCreate, LessonRead
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/lessons", tags=["lessons"]);

@router.post("/", response_model=LessonRead)
def create_lesson(lesson_in: LessonCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, lesson_in.classroom_id)
    if not classroom or classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not classroom else 403, detail="Not allowed")
    lesson = Lesson(**lesson_in.dict())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.get("/", response_model=List[LessonRead])
def read_lessons(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Lesson).all()
    if current_user.role == UserRole.teacher:
        return db.query(Lesson).join(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    # student: lessons in enrolled classrooms
    lessons = []
    for c in current_user.classrooms:
        lessons.extend(c.lessons)
    return lessons

@router.get("/{lesson_id}", response_model=LessonRead)
def read_lesson(lesson_id: int, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if current_user.role == UserRole.admin or \
       (current_user.role == UserRole.teacher and lesson.classroom.teacher_id == current_user.id) or \
       (current_user.role == UserRole.student and lesson.classroom in current_user.classrooms):
        return lesson
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.put("/{lesson_id}", response_model=LessonRead)
def update_lesson(lesson_id: int, lesson_in: LessonCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson or lesson.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not lesson else 403, detail="Not allowed")
    lesson.title = lesson_in.title
    lesson.description = lesson_in.description
    lesson.scheduled_date = lesson_in.scheduled_date
    db.commit()
    db.refresh(lesson)
    return lesson

@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson(lesson_id: int, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson or lesson.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not lesson else 403, detail="Not allowed")
    db.delete(lesson)
    db.commit()
