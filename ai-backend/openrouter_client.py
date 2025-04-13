#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - OpenRouter API Client                                //
//  ---------------------------------------------------------------        //
//  This module provides an interface to interact with OpenRouter API      //
//  for cloud-based LLM inference as a fallback or alternative to Ollama.  //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
"""

import json
import requests
import aiohttp
import asyncio
import logging
from typing import Dict, Any, List, Optional, Union, Generator, AsyncGenerator
import os

from .config import config

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.get_config()["system"]["log_level"]),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("openrouter_client")


class OpenRouterClient:
    """
    ////////////////////////////////////////////////////////
    // Client for interacting with OpenRouter API for     //
    // cloud-based LLM inference as fallback or alternate //
    ////////////////////////////////////////////////////////
    """

    def __init__(self):
        """Initialize the OpenRouter client with configuration."""
        self.openrouter_config = config.get_openrouter_config()
        self.base_url = config.get_api_base_url("openrouter")
        self.model = self.openrouter_config.get("model", "anthropic/claude-3-7-sonnet")
        self.parameters = self.openrouter_config.get("parameters", {})
        self.timeout = config.get_config()["system"]["timeout"]
        
        # Get API key from config or environment variable
        self.api_key = self.openrouter_config.get("api_key") or os.environ.get("OPENROUTER_API_KEY", "")
        
        if not self.api_key:
            logger.warning("OpenRouter API key not set! API requests will fail.")
        
        logger.info(f"Initialized OpenRouter client with base URL: {self.base_url}")
        logger.info(f"Default model set to: {self.model}")

    def _build_headers(self) -> Dict[str, str]:
        """Build headers for API requests."""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://feverducation.com",  # Replace with your actual domain
            "X-Title": "FeverEducation App"  # Replace with your app name
        }

    def list_models(self) -> List[Dict[str, Any]]:
        """
        ////////////////////////////////////////////////////////
        // Get a list of all models available in OpenRouter   //
        ////////////////////////////////////////////////////////
        """
        if not self.api_key:
            logger.error("Cannot list models: API key not set")
            return []
            
        try:
            response = requests.get(
                f"{self.base_url}/models",
                headers=self._build_headers(),
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json().get("data", [])
        except requests.RequestException as e:
            logger.error(f"Failed to list models: {str(e)}")
            return []

    async def list_models_async(self) -> List[Dict[str, Any]]:
        """Asynchronous version of list_models."""
        if not self.api_key:
            logger.error("Cannot list models: API key not set")
            return []
            
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/models",
                    headers=self._build_headers(),
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("data", [])
        except aiohttp.ClientError as e:
            logger.error(f"Failed to list models asynchronously: {str(e)}")
            return []

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        stream: bool = False,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Union[Dict[str, Any], Generator[Dict[str, Any], None, None]]:
        """
        ////////////////////////////////////////////////////////
        // Chat completion with message history               //
        //                                                    //
        // Args:                                              //
        //   messages: List of message dicts with role/content//
        //   model: Model to use (defaults to config)         //
        //   parameters: Generation parameters                //
        //   stream: Whether to stream the response           //
        //   tools: Optional list of tools for function calling//
        //                                                    //
        // Returns:                                           //
        //   Response dict or stream generator                //
        ////////////////////////////////////////////////////////
        """
        if not self.api_key:
            error_msg = "Cannot generate chat: API key not set"
            logger.error(error_msg)
            return {"error": error_msg}
            
        model = model or self.model
        merged_params = {**self.parameters, **(parameters or {})}
        
        payload = {
            "model": model,
            "messages": messages,
            **merged_params
        }
        
        if tools:
            payload["tools"] = tools
        
        if stream:
            return self._stream_chat(payload)
        else:
            return self._complete_chat(payload)

    def _complete_chat(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Send a chat request and return the full response."""
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self._build_headers(),
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Chat failed: {str(e)}")
            return {"error": str(e)}

    def _stream_chat(self, payload: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        """Stream the chat response chunks as they're generated."""
        payload["stream"] = True
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self._build_headers(),
                json=payload,
                stream=True,
                timeout=self.timeout,
            )
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    line_text = line.decode('utf-8')
                    # Skip empty lines and "data: [DONE]" messages
                    if line_text.startswith('data: ') and line_text != 'data: [DONE]':
                        chunk_data = json.loads(line_text[6:])  # Remove 'data: ' prefix
                        yield chunk_data
        except requests.RequestException as e:
            logger.error(f"Streaming chat failed: {str(e)}")
            yield {"error": str(e)}

    async def chat_async(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        stream: bool = False,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Union[Dict[str, Any], AsyncGenerator[Dict[str, Any], None]]:
        """Asynchronous version of chat."""
        if not self.api_key:
            error_msg = "Cannot generate chat: API key not set"
            logger.error(error_msg)
            return {"error": error_msg}
            
        model = model or self.model
        merged_params = {**self.parameters, **(parameters or {})}
        
        payload = {
            "model": model,
            "messages": messages,
            **merged_params
        }
        
        if tools:
            payload["tools"] = tools
        
        if stream:
            return self._stream_chat_async(payload)
        else:
            return await self._complete_chat_async(payload)

    async def _complete_chat_async(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Async version of _complete_chat."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=self._build_headers(),
                    json=payload,
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    return await response.json()
        except aiohttp.ClientError as e:
            logger.error(f"Async chat failed: {str(e)}")
            return {"error": str(e)}

    async def _stream_chat_async(self, payload: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """Async version of _stream_chat."""
        payload["stream"] = True
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=self._build_headers(),
                    json=payload,
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    
                    async for line in response.content:
                        line_text = line.decode('utf-8').strip()
                        # Skip empty lines and "data: [DONE]" messages
                        if line_text.startswith('data: ') and line_text != 'data: [DONE]':
                            try:
                                chunk_data = json.loads(line_text[6:])  # Remove 'data: ' prefix
                                yield chunk_data
                            except json.JSONDecodeError:
                                continue
        except aiohttp.ClientError as e:
            logger.error(f"Async streaming chat failed: {str(e)}")
            yield {"error": str(e)}

# Create a client instance
client = OpenRouterClient()

if __name__ == "__main__":
    # Simple test when run directly (requires API key)
    if client.api_key:
        models = client.list_models()
        print(f"Available models: {json.dumps(models, indent=2)}")
        
        response = client.chat([
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": "What is OpenRouter and how does it work?"}
        ])
        print(f"Response: {json.dumps(response, indent=2)}")
    else:
        print("Error: API key not set. Set OPENROUTER_API_KEY environment variable or configure in ai_config.json")
