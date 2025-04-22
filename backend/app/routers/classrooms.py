# CODEX: CRUD routes for classroom management
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Classroom, UserRole
from app.schemas import ClassroomCreate, ClassroomRead
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/classrooms", tags=["classrooms"])

@router.post("/", response_model=ClassroomRead)
def create_classroom(classroom_in: ClassroomCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = Classroom(name=classroom_in.name, teacher_id=current_teacher.id)
    db.add(classroom)
    db.commit()
    db.refresh(classroom)
    return classroom

@router.get("/", response_model=List[ClassroomRead])
def read_classrooms(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Classroom).all()
    if current_user.role == UserRole.teacher:
        return db.query(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    return current_user.classrooms

@router.get("/{classroom_id}", response_model=ClassroomRead)
def read_classroom(classroom_id: int, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    if current_user.role == UserRole.admin or (current_user.role == UserRole.teacher and classroom.teacher_id == current_user.id) or (current_user.role == UserRole.student and current_user in classroom.students):
        return classroom
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.put("/{classroom_id}", response_model=ClassroomRead)
def update_classroom(classroom_id: int, classroom_in: ClassroomCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, classroom_id)
    if not classroom or classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not classroom else 403, detail="Not allowed")
    classroom.name = classroom_in.name
    db.commit()
    db.refresh(classroom)
    return classroom

@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classroom(classroom_id: int, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, classroom_id)
    if not classroom or classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not classroom else 403, detail="Not allowed")
    db.delete(classroom)
    db.commit()
