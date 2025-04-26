# CODEX: AI-powered endpoints calling Ollama for tutor, lesson, and analytics
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import httpx
import json
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
    # CODEX: Use OpenAI-compatible streaming endpoint
    url = f"http://{host}:{port}/v1/chat/completions"
    system_content = pre_prompt or OLLAMA_PRE_PROMPT
    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": prompt},
    ]
    payload = {"model": model, "messages": messages, "stream": True}
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, json=payload) as resp:
            if resp.status_code != 200:
                # fully read error body
                try:
                    body = await resp.read()
                except Exception:
                    try:
                        body = await resp.aread()
                    except Exception:
                        body = b""
                detail = body.decode(errors="ignore") if body else resp.reason_phrase
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Ollama error: {detail}")
            # parse SSE data frames
            async for line in resp.aiter_lines():
                if not line.startswith("data:"):
                    continue
                data_str = line[len("data:"):].strip()
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    content_chunk = data["choices"][0].get("delta", {}).get("content", "")
                except Exception:
                    continue
                if content_chunk:
                    yield content_chunk

@router.post("/tutor")
async def ai_tutor(request: Prompt, current_student=Depends(require_role(UserRole.student)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    # CODEX: initialize streaming and peek first chunk to handle HTTP errors before response start
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt)
    try:
        first_chunk = await stream.__anext__()
    except HTTPException as e:
        raise e
    response_buffer = first_chunk
    async def event_stream():
        nonlocal response_buffer
        # yield initial chunk
        yield first_chunk
        # stream remaining chunks
        async for chunk in stream:
            response_buffer += chunk
            yield chunk
        # record analytics after full response
        record = Analytics(student_id=current_student.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record); db.commit(); db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/lesson")
async def ai_lesson(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    # CODEX: initialize streaming and peek first chunk to handle HTTP errors before response start
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt)
    try:
        first_chunk = await stream.__anext__()
    except HTTPException as e:
        raise e
    response_buffer = first_chunk
    async def event_stream():
        nonlocal response_buffer
        # yield initial chunk
        yield first_chunk
        # stream remaining chunks
        async for chunk in stream:
            response_buffer += chunk
            yield chunk
        # record analytics after full response
        record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record); db.commit(); db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/analytics")
async def ai_generate_analytics(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    # CODEX: initialize streaming and peek first chunk to handle HTTP errors before response start
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt)
    try:
        first_chunk = await stream.__anext__()
    except HTTPException as e:
        raise e
    response_buffer = first_chunk
    async def event_stream():
        nonlocal response_buffer
        # yield initial chunk
        yield first_chunk
        # stream remaining chunks
        async for chunk in stream:
            response_buffer += chunk
            yield chunk
        # record analytics after full response
        record = Analytics(teacher_id=current_teacher.id, data={"prompt": request.prompt, "response": response_buffer})
        db.add(record); db.commit(); db.refresh(record)
    return StreamingResponse(event_stream(), media_type="text/plain")
