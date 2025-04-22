# CODEX: CRUD routes for audit logs
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog, UserRole
from app.schemas import AuditLogRead
from app.routers.auth import require_role

router = APIRouter(prefix="/audit_logs", tags=["audit_logs"])

@router.get("/", response_model=List[AuditLogRead])
def read_audit_logs(current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    """Admin-only: retrieve all audit logs"""
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

@router.get("/{log_id}", response_model=AuditLogRead)
def read_audit_log(log_id: int, current_admin=Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    """Admin-only: retrieve a specific audit log by ID"""
    log = db.get(AuditLog, log_id)
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit log not found")
    return log
