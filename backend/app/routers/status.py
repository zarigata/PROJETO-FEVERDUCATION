from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import UserRole, User
from app.schemas import SystemStatus
from app.routers.auth import require_role

router = APIRouter(prefix="/status", tags=["status"])

@router.get("/", response_model=SystemStatus)
def get_system_status(current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    """Admin-only: retrieve basic system and DB status"""
    db_alive = True
    try:
        db.execute("SELECT 1")
    except Exception:
        db_alive = False
    user_count = db.query(User).count()
    return SystemStatus(
        timestamp=datetime.utcnow(),
        db_alive=db_alive,
        user_count=user_count
    )
