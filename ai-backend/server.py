#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - AI Backend Server                                    //
//  ---------------------------------------------------------------        //
//  This module provides a FastAPI server that bridges the Next.js         //
//  frontend with the Ollama LLM backend and database services.            //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
"""

import os
import json
import logging
import uvicorn
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

from .config import config
from .ollama_client import client as ollama_client
from .openrouter_client import client as openrouter_client
from .ai_manager import manager as ai_manager

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.get_config()["system"]["log_level"]),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("ai_backend_server")

# Initialize FastAPI app
app = FastAPI(
    title="FeverEducation AI Backend",
    description="API for AI content generation and educational insights",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender (system, user, assistant)")
    content: str = Field(..., description="Content of the message")

class GenerationRequest(BaseModel):
    messages: List[Message] = Field(..., description="List of conversation messages")
    model: Optional[str] = Field(None, description="Model to use for generation")
    stream: Optional[bool] = Field(False, description="Whether to stream the response")

class InsightRequest(BaseModel):
    teacher: Dict[str, Any] = Field(..., description="Teacher information")
    timeframe: str = Field(..., description="Timeframe for insights")
    types: List[str] = Field(..., description="Types of insights to generate")
    dataPoints: Dict[str, Any] = Field(..., description="Data points for analysis")

# API routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "FeverEducation AI Backend is running"}

@app.get("/api/status")
async def status():
    """Get status of AI services"""
    ollama_available = await ai_manager.is_ollama_available_async()
    
    # Check if OpenRouter is configured
    openrouter_config = config.get_openrouter_config()
    openrouter_configured = bool(openrouter_config.get("api_key", ""))
    
    return {
        "ollama": {
            "available": ollama_available,
            "model": config.get_ollama_config().get("model")
        },
        "openrouter": {
            "configured": openrouter_configured,
            "model": config.get_openrouter_config().get("model") if openrouter_configured else None
        }
    }

@app.get("/api/models")
async def list_models():
    """List available AI models"""
    models = ai_manager.get_available_models()
    return {"models": models}

@app.post("/api/generate")
async def generate(request: GenerationRequest):
    """Generate content using the AI model"""
    try:
        logger.info(f"Generating content with model: {request.model or config.get_ollama_config().get('model')}")
        
        result = await ai_manager.chat_async(
            messages=[{
                "role": msg.role,
                "content": msg.content
            } for msg in request.messages],
            model=request.model,
            stream=request.stream
        )

        # Handle different response formats
        if isinstance(result, dict):
            if "error" in result:
                raise HTTPException(status_code=500, detail=result["error"])
                
            # Format response based on model
            if "choices" in result and len(result["choices"]) > 0:
                # OpenRouter format
                return {
                    "response": result["choices"][0]["message"]["content"],
                    "model": result.get("model", "unknown")
                }
            elif "response" in result:
                # Ollama format
                return {
                    "response": result["response"],
                    "model": result.get("model", "unknown")
                }
        
        # Fallback response format
        return {
            "response": "I'm sorry, I couldn't generate a response at this time.",
            "model": "fallback"
        }
        
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/insights")
async def generate_insights(request: InsightRequest):
    """Generate educational insights based on provided data"""
    try:
        logger.info(f"Generating insights for teacher: {request.teacher['id']}")
        
        # Create a prompt for the AI to analyze the data
        analysis_prompt = f"""
        You are an educational data analyst. Analyze the following teaching data for {request.teacher['name']} 
        over the {request.timeframe} timeframe and provide actionable insights.
        
        Focus on these areas: {', '.join(request.types)}.
        
        The data is as follows:
        {json.dumps(request.dataPoints, indent=2)}
        
        For each insight, provide:
        1. A category (success, warning, or info)
        2. A concise title
        3. A detailed description
        4. A specific metric with its value, trend (up/down), and change percentage
        5. A recommended action
        
        Format your response as a JSON array.
        """
        
        # Generate insights using the AI
        result = await ai_manager.chat_async(
            messages=[
                {"role": "system", "content": "You are an expert educational data analyst."},
                {"role": "user", "content": analysis_prompt}
            ]
        )
        
        # Parse the AI response
        if isinstance(result, dict):
            if "error" in result:
                raise HTTPException(status_code=500, detail=result["error"])
                
            # Try to extract insights from various response formats
            content = ""
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
            elif "response" in result:
                content = result["response"]
                
            # Try to parse the content as JSON
            try:
                # Extract JSON array from the content
                json_start = content.find('[')
                json_end = content.rfind(']') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_content = content[json_start:json_end]
                    insights = json.loads(json_content)
                    return {"insights": insights}
                
                # If no JSON array found, return the raw content
                return {"insights": content, "raw": True}
                
            except json.JSONDecodeError:
                return {"insights": content, "raw": True}
        
        # Fallback response
        return {
            "insights": [
                {
                    "type": "info",
                    "title": "AI Analysis Unavailable",
                    "description": "The AI could not analyze the data at this time. Please try again later.",
                    "metric": {
                        "label": "Analysis Status",
                        "value": "Failed",
                        "trend": "neutral",
                        "change": "0%"
                    }
                }
            ]
        }
        
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def start():
    """Start the FastAPI server"""
    uvicorn.run(
        "ai_backend.server:app",
        host=config.get_ollama_config().get("host", "127.0.0.1"),
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    # Run directly when script is executed
    start()
