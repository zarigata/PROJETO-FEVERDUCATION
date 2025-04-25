from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_active_user
from app.schemas import PreferencesRead, PreferencesUpdate

router = APIRouter()

@router.get("/preferences", response_model=PreferencesRead)
def get_user_preferences(current_user = Depends(get_current_active_user)):
    """Return current user's preferences"""
    return {"theme": current_user.theme, "language": current_user.language}

@router.post("/preferences", response_model=PreferencesRead)
def update_user_preferences(prefs: PreferencesUpdate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Update and return user's preferences"""
    if prefs.theme is not None:
        current_user.theme = prefs.theme
    if prefs.language is not None:
        current_user.language = prefs.language
    db.commit()
    db.refresh(current_user)
    return {"theme": current_user.theme, "language": current_user.language}
