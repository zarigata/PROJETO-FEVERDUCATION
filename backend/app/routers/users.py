# CODEX: CRUD routes for user management
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, UserRole
from app.schemas import UserCreate, UserRead, UserUpdate, JoinModel as ClassroomJoinModel  # for join classroom functionality
from app.security import get_password_hash
from app.routers.auth import get_current_active_user, require_role

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserRead)
def create_user(user_in: UserCreate, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user_in.password)
    user = User(email=user_in.email, password_hash=hashed, role=user_in.role, timezone=user_in.timezone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/", response_model=List[UserRead])
def read_users(search: Optional[str] = Query(None, description="Search by email or name"), current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    query = db.query(User)
    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(User.email.ilike(pattern), User.name.ilike(pattern)))
    users = query.all()
    # Attach classroom info for admin listing
    def classroom_brief_list(classrooms):
        return [{"id": c.id, "name": c.name} for c in classrooms]
    result = []
    for user in users:
        user_data = UserRead.from_orm(user).dict()
        # For teachers: classrooms they teach
        user_data["taught_classrooms"] = classroom_brief_list(getattr(user, "taught_classrooms", []))
        # For students: classrooms they are in
        user_data["classrooms"] = classroom_brief_list(getattr(user, "classrooms", []))
        result.append(user_data)
    return result

@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return user

@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_in: UserUpdate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    if user_in.email:
        target.email = user_in.email
    if user_in.password:
        target.password_hash = get_password_hash(user_in.password)
    if user_in.role and current_user.role == UserRole.admin:
        target.role = user_in.role
    if user_in.timezone:
        target.timezone = user_in.timezone
    # CODEX: profile update fields
    if user_in.name is not None:
        target.name = user_in.name
    if user_in.birthday is not None:
        target.birthday = user_in.birthday
    if user_in.profile_photo is not None:
        target.profile_photo = user_in.profile_photo
    db.commit()
    db.refresh(target)
    return target

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
