# CODEX: CRUD routes for school management
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import School, UserRole
from app.schemas import SchoolCreate, SchoolRead
from app.routers.auth import require_role

router = APIRouter(prefix="/schools", tags=["schools"])

@router.post("/", response_model=SchoolRead)
def create_school(school_in: SchoolCreate, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    # Create a new school with current admin as creator
    school = School(name=school_in.name, admin_id=current_admin.id)
    db.add(school)
    db.commit()
    db.refresh(school)
    return school

@router.get("/", response_model=List[SchoolRead])
def read_schools(current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    # Return all schools
    return db.query(School).all()

@router.get("/{school_id}", response_model=SchoolRead)
def read_school(school_id: int, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    school = db.get(School, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.put("/{school_id}", response_model=SchoolRead)
def update_school(school_id: int, school_in: SchoolCreate, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    school = db.get(School, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    school.name = school_in.name
    db.commit()
    db.refresh(school)
    return school

@router.delete("/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school(school_id: int, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    school = db.get(School, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    db.delete(school)
    db.commit()
