# CODEX: AI-powered endpoints calling Ollama for tutor, lesson, and analytics
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import httpx
from sqlalchemy.orm import Session

from app.config import OLLAMA_HOST, OLLAMA_PORT, OLLAMA_MODEL
from app.database import get_db
from app.models import Analytics, UserRole
from app.schemas import AnalyticsRead
from app.routers.auth import require_role

router = APIRouter(prefix="/ai", tags=["ai"])

class Prompt(BaseModel):
    prompt: str

async def call_ollama(prompt: str) -> str:
    url = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/models/{OLLAMA_MODEL}/generate"
    payload = {"prompt": prompt}
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload)
    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Ollama request failed")
    data = resp.json()
    # assume data.response holds the generated text
    return data.get("response", "")

@router.post("/tutor", response_model=AnalyticsRead)
async def ai_tutor(request: Prompt, current_student=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    text = await call_ollama(request.prompt)
    record = Analytics(student_id=current_student.id, data={"prompt": request.prompt, "response": text})
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.post("/lesson", response_model=AnalyticsRead)
async def ai_lesson(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    text = await call_ollama(request.prompt)
    record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": text})
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.post("/analytics", response_model=AnalyticsRead)
async def ai_generate_analytics(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    text = await call_ollama(request.prompt)
    record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": text})
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
