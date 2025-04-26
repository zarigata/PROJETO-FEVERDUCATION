# CODEX: Chat history management endpoints
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.routers.auth import require_role
from app.models import ChatSession, ChatMessage, UserRole
from app.schemas import ChatSessionRead, ChatMessageRead

router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("/sessions", response_model=List[ChatSessionRead])
def list_sessions(current_user=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    # get up to last 32 sessions
    sessions = db.query(ChatSession).filter_by(user_id=current_user.id)\
        .order_by(ChatSession.created_at.desc()).limit(32).all()
    return sessions

@router.post("/sessions", response_model=ChatSessionRead)
def create_session(current_user=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    # prune oldest if exceed 32
    count = db.query(ChatSession).filter_by(user_id=current_user.id).count()
    if count >= 32:
        oldest = db.query(ChatSession).filter_by(user_id=current_user.id)\
            .order_by(ChatSession.created_at.asc()).first()
        db.delete(oldest)
        db.commit()
    new = ChatSession(user_id=current_user.id)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
def get_messages(session_id: int, current_user=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter_by(id=session_id, user_id=current_user.id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    messages = db.query(ChatMessage).filter_by(session_id=session.id)\
        .order_by(ChatMessage.created_at.asc()).limit(128).all()
    return messages
