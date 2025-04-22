# CODEX: CRUD routes for assignments
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Assignment, Classroom, UserRole
from app.schemas import AssignmentCreate, AssignmentRead
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("/", response_model=AssignmentRead)
def create_assignment(assignment_in: AssignmentCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    classroom = db.get(Classroom, assignment_in.classroom_id)
    if not classroom or classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not classroom else 403, detail="Not allowed")
    assignment = Assignment(**assignment_in.dict())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@router.get("/", response_model=List[AssignmentRead])
def read_assignments(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.admin:
        return db.query(Assignment).all()
    if current_user.role == UserRole.teacher:
        return db.query(Assignment).join(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    # Student: assignments in their classrooms
    assignments = []
    for classroom in current_user.classrooms:
        assignments.extend(classroom.assignments)
    return assignments

@router.get("/{assignment_id}", response_model=AssignmentRead)
def read_assignment(assignment_id: int, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    assignment = db.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if current_user.role == UserRole.admin or (current_user.role == UserRole.teacher and assignment.classroom.teacher_id == current_user.id) or (current_user.role == UserRole.student and assignment in [a for c in current_user.classrooms for a in c.assignments]):
        return assignment
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.put("/{assignment_id}", response_model=AssignmentRead)
def update_assignment(assignment_id: int, assignment_in: AssignmentCreate, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    assignment = db.get(Assignment, assignment_id)
    if not assignment or assignment.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not assignment else 403, detail="Not allowed")
    assignment.title = assignment_in.title
    assignment.description = assignment_in.description
    assignment.due_date = assignment_in.due_date
    db.commit()
    db.refresh(assignment)
    return assignment

@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(assignment_id: int, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    assignment = db.get(Assignment, assignment_id)
    if not assignment or assignment.classroom.teacher_id != current_teacher.id:
        raise HTTPException(status_code=404 if not assignment else 403, detail="Not allowed")
    db.delete(assignment)
    db.commit()
