from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole
from app.routers.auth import get_current_active_user
from app.schemas import UserRead

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/", response_model=List[UserRead])
def read_students(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.teacher:
        # collect students from teacher's classrooms
        students = []
        for classroom in current_user.taught_classrooms:
            students.extend(classroom.students)
        # remove duplicates
        unique_students = {student.id: student for student in students}.values()
        return list(unique_students)
    if current_user.role == UserRole.admin:
        return db.query(User).filter(User.role == UserRole.student).all()
    raise HTTPException(status_code=403, detail="Insufficient permissions")
