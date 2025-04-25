# CODEX: AI-powered endpoints calling Ollama for tutor, lesson, and analytics
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import httpx
from sqlalchemy.orm import Session

from app.config import OLLAMA_HOST, OLLAMA_PORT, OLLAMA_MODEL, OLLAMA_STYLE, OLLAMA_PRE_PROMPT
from app.database import get_db
from app.models import Analytics, UserRole
from app.schemas import AnalyticsRead
from app.routers.auth import require_role

router = APIRouter(prefix="/ai", tags=["ai"])

class Prompt(BaseModel):
    prompt: str
    host: Optional[str] = None
    port: Optional[int] = None
    model: Optional[str] = None
    style: Optional[str] = None
    pre_prompt: Optional[str] = None

async def _stream_ollama(prompt: str, host: str, port: int, model: str, style: Optional[str], pre_prompt: Optional[str]):
    url = f"http://{host}:{port}/models/{model}/generate"
    payload = {"prompt": prompt}
    if style:
        payload["style"] = style
    if pre_prompt:
        payload["pre_prompt"] = pre_prompt
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, json=payload) as resp:
            if resp.status_code != 200:
                detail = await resp.text()
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Ollama error: {detail}")
            async for chunk in resp.aiter_text():
                yield chunk

@router.post("/tutor")
async def ai_tutor(request: Prompt, current_student=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    response_buffer = ""
    async def event_stream():
        nonlocal response_buffer
        async for chunk in _stream_ollama(request.prompt, host, port, model, style, pre_prompt):
            response_buffer += chunk
            yield chunk
        record = Analytics(student_id=current_student.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record)
        db.commit()
        db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/lesson")
async def ai_lesson(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    response_buffer = ""
    async def event_stream():
        nonlocal response_buffer
        async for chunk in _stream_ollama(request.prompt, host, port, model, style, pre_prompt):
            response_buffer += chunk
            yield chunk
        record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record)
        db.commit()
        db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/analytics")
async def ai_generate_analytics(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    response_buffer = ""
    async def event_stream():
        nonlocal response_buffer
        async for chunk in _stream_ollama(request.prompt, host, port, model, style, pre_prompt):
            response_buffer += chunk
            yield chunk
        record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record)
        db.commit()
        db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")
