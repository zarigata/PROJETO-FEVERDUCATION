# CODEX: CRUD routes for user management
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, UserRole
from app.schemas import UserCreate, UserRead, UserUpdate
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
def read_users(current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    return db.query(User).all()

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
