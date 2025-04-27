# CODEX: AI-powered endpoints calling Ollama for tutor, lesson, and analytics
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import httpx
import json
from sqlalchemy.orm import Session

from app.config import OLLAMA_HOST, OLLAMA_PORT, OLLAMA_MODEL, OLLAMA_STYLE, OLLAMA_PRE_PROMPT, REDIS_URL
from app.database import get_db
from app.models import Analytics, UserRole, ChatSession, ChatMessage
from app.schemas import AnalyticsRead
from app.routers.auth import require_role
import redis.asyncio as aioredis

# Initialize Redis client for caching
redis_client = aioredis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)

router = APIRouter(prefix="/ai", tags=["ai"])

class Prompt(BaseModel):
    prompt: str
    host: Optional[str] = None
    port: Optional[int] = None
    model: Optional[str] = None
    style: Optional[str] = None
    pre_prompt: Optional[str] = None
    session_id: Optional[int] = None

async def _stream_ollama(prompt: str, host: str, port: int, model: str, style: Optional[str], pre_prompt: Optional[str], history: Optional[List[dict]] = None):
    # CODEX: Use OpenAI-compatible streaming endpoint
    url = f"http://{host}:{port}/v1/chat/completions"
    system_content = pre_prompt or OLLAMA_PRE_PROMPT
    messages = [{"role": "system", "content": system_content}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": prompt})
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
    # CODEX: handle chat session and user message history
    history_msgs: List[dict] = []  # default empty history
    if request.session_id is not None:
        session = db.query(ChatSession).filter_by(id=request.session_id, user_id=current_student.id).first()
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        # prune oldest if exceed 128
        count = db.query(ChatMessage).filter_by(session_id=session.id).count()
        if count >= 128:
            oldest = db.query(ChatMessage).filter_by(session_id=session.id).order_by(ChatMessage.created_at.asc()).first()
            db.delete(oldest); db.commit()
        # build last 4 user & assistant messages as history
        user_msgs = db.query(ChatMessage).filter_by(session_id=session.id, sender="user").order_by(ChatMessage.created_at.desc()).limit(4).all()[::-1]
        assistant_msgs = db.query(ChatMessage).filter_by(session_id=session.id, sender="assistant").order_by(ChatMessage.created_at.desc()).limit(4).all()[::-1]
        combined = sorted(user_msgs + assistant_msgs, key=lambda m: m.created_at)
        history_msgs = [{"role": m.sender, "content": m.text} for m in combined]
    else:
        # create new session for first-time chat
        session = ChatSession(user_id=current_student.id)
        db.add(session); db.commit(); db.refresh(session)
    # record user prompt
    user_msg = ChatMessage(session_id=session.id, sender="user", text=request.prompt)
    db.add(user_msg); db.commit()
    # CODEX: initialize streaming with history and peek first chunk
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt, history_msgs)
    try:
        first_chunk = await stream.__anext__()
    except Exception:
        async def event_stream_error():
            yield "\n\nSorry, I had trouble processing your request. Please try again."
        return StreamingResponse(event_stream_error(), media_type="text/plain")
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
        # CODEX: record assistant message and prune if needed
        assistant_msg = ChatMessage(session_id=session.id, sender="assistant", text=response_buffer)
        db.add(assistant_msg); db.commit()
        # prune history to 128 by deleting oldest
        count2 = db.query(ChatMessage).filter_by(session_id=session.id).count()
        while count2 > 128:
            old = db.query(ChatMessage).filter_by(session_id=session.id).order_by(ChatMessage.created_at.asc()).first()
            db.delete(old); db.commit()
            count2 -= 1
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/lesson")
async def ai_lesson(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    # Redis caching for AI lesson responses
    cache_key = f"ai_lesson:{current_teacher.id}:{model}:{request.prompt}"
    cached = await redis_client.get(cache_key)
    if cached:
        async def replay():
            yield cached
        return StreamingResponse(replay(), media_type="text/plain")
    # CODEX: initialize streaming and peek first chunk to handle HTTP errors before response start
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt)
    try:
        first_chunk = await stream.__anext__()
    except Exception:
        async def event_stream_error():
            yield "\n\nSorry, I had trouble processing your request. Please try again."
        return StreamingResponse(event_stream_error(), media_type="text/plain")
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
        # Cache the lesson response in Redis (1h expiration)
        await redis_client.set(cache_key, response_buffer, ex=3600)
    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/analytics")
async def ai_generate_analytics(request: Prompt, current_teacher=Depends(require_role(UserRole.teacher)), db: Session = Depends(get_db)):
    host = request.host or OLLAMA_HOST
    port = request.port or OLLAMA_PORT
    model = request.model or OLLAMA_MODEL
    style = request.style or OLLAMA_STYLE
    pre_prompt = request.pre_prompt or OLLAMA_PRE_PROMPT
    # Redis caching for AI analytics responses
    cache_key = f"ai_analytics:{current_teacher.id}:{model}:{request.prompt}"
    cached = await redis_client.get(cache_key)
    if cached:
        async def replay():
            yield cached
        return StreamingResponse(replay(), media_type="text/plain")
    # CODEX: initialize streaming and peek first chunk to handle HTTP errors before response start
    stream = _stream_ollama(request.prompt, host, port, model, style, pre_prompt)
    try:
        first_chunk = await stream.__anext__()
    except Exception:
        async def event_stream_error():
            yield "\n\nSorry, I had trouble processing your request. Please try again."
        return StreamingResponse(event_stream_error(), media_type="text/plain")
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
        # Cache the analytics response in Redis (1h expiration)
        await redis_client.set(cache_key, response_buffer, ex=3600)
    return StreamingResponse(event_stream(), media_type="text/plain")
