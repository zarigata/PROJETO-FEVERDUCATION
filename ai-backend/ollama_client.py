#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - Ollama API Client                                    //
//  ---------------------------------------------------------------        //
//  This module provides an interface to interact with the Ollama API      //
//  for local LLM inference. It supports both sync and async operations.   //
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

from .config import config

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.get_config()["system"]["log_level"]),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("ollama_client")


class OllamaClient:
    """
    ////////////////////////////////////////////////////////
    // Client for interacting with Ollama API for local   //
    // LLM inference and model management                //
    ////////////////////////////////////////////////////////
    """

    def __init__(self):
        """Initialize the Ollama client with configuration."""
        self.ollama_config = config.get_ollama_config()
        self.base_url = config.get_api_base_url("ollama")
        self.model = self.ollama_config.get("model", "llama3.2")
        self.parameters = self.ollama_config.get("parameters", {})
        self.timeout = config.get_config()["system"]["timeout"]
        
        logger.info(f"Initialized Ollama client with base URL: {self.base_url}")
        logger.info(f"Default model set to: {self.model}")

    def _build_headers(self) -> Dict[str, str]:
        """Build headers for API requests."""
        return {
            "Content-Type": "application/json",
        }

    def list_models(self) -> List[Dict[str, Any]]:
        """
        ////////////////////////////////////////////////////////
        // Get a list of all models available in Ollama      //
        ////////////////////////////////////////////////////////
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                headers=self._build_headers(),
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json().get("models", [])
        except requests.RequestException as e:
            logger.error(f"Failed to list models: {str(e)}")
            return []

    async def list_models_async(self) -> List[Dict[str, Any]]:
        """Asynchronous version of list_models."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/tags",
                    headers=self._build_headers(),
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("models", [])
        except aiohttp.ClientError as e:
            logger.error(f"Failed to list models asynchronously: {str(e)}")
            return []

    def generate(
        self, 
        prompt: str, 
        model: Optional[str] = None, 
        parameters: Optional[Dict[str, Any]] = None,
        system_prompt: Optional[str] = None,
        stream: bool = False
    ) -> Union[str, Generator[str, None, None]]:
        """
        ////////////////////////////////////////////////////////
        // Generate a response for the given prompt           //
        //                                                    //
        // Args:                                              //
        //   prompt: Input text                               //
        //   model: Model to use (defaults to config)         //
        //   parameters: Generation parameters                //
        //   system_prompt: System prompt for context         //
        //   stream: Whether to stream the response           //
        //                                                    //
        // Returns:                                           //
        //   Response text or stream generator                //
        ////////////////////////////////////////////////////////
        """
        model = model or self.model
        merged_params = {**self.parameters, **(parameters or {})}
        
        payload = {
            "model": model,
            "prompt": prompt,
            "options": merged_params,
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        if stream:
            return self._stream_generate(payload)
        else:
            return self._complete_generate(payload)

    def _complete_generate(self, payload: Dict[str, Any]) -> str:
        """Send a completion request and return the full response."""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                headers=self._build_headers(),
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except requests.RequestException as e:
            logger.error(f"Generation failed: {str(e)}")
            return f"Error generating response: {str(e)}"

    def _stream_generate(self, payload: Dict[str, Any]) -> Generator[str, None, None]:
        """Stream the response chunks as they're generated."""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                headers=self._build_headers(),
                json=payload,
                stream=True,
                timeout=self.timeout,
            )
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line)
                    if "response" in chunk:
                        yield chunk["response"]
        except requests.RequestException as e:
            logger.error(f"Streaming generation failed: {str(e)}")
            yield f"Error generating response: {str(e)}"

    async def generate_async(
        self, 
        prompt: str, 
        model: Optional[str] = None, 
        parameters: Optional[Dict[str, Any]] = None,
        system_prompt: Optional[str] = None,
        stream: bool = False
    ) -> Union[str, AsyncGenerator[str, None]]:
        """Asynchronous version of generate."""
        model = model or self.model
        merged_params = {**self.parameters, **(parameters or {})}
        
        payload = {
            "model": model,
            "prompt": prompt,
            "options": merged_params,
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        if stream:
            return self._stream_generate_async(payload)
        else:
            return await self._complete_generate_async(payload)

    async def _complete_generate_async(self, payload: Dict[str, Any]) -> str:
        """Async version of _complete_generate."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    headers=self._build_headers(),
                    json=payload,
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("response", "")
        except aiohttp.ClientError as e:
            logger.error(f"Async generation failed: {str(e)}")
            return f"Error generating response: {str(e)}"

    async def _stream_generate_async(self, payload: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """Async version of _stream_generate."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    headers=self._build_headers(),
                    json=payload,
                    timeout=self.timeout,
                ) as response:
                    response.raise_for_status()
                    
                    async for line in response.content:
                        line = line.strip()
                        if line:
                            try:
                                chunk = json.loads(line)
                                if "response" in chunk:
                                    yield chunk["response"]
                            except json.JSONDecodeError:
                                continue
        except aiohttp.ClientError as e:
            logger.error(f"Async streaming generation failed: {str(e)}")
            yield f"Error generating response: {str(e)}"

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        stream: bool = False
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
        //                                                    //
        // Returns:                                           //
        //   Response dict or stream generator                //
        ////////////////////////////////////////////////////////
        """
        model = model or self.model
        merged_params = {**self.parameters, **(parameters or {})}
        
        payload = {
            "model": model,
            "messages": messages,
            "options": merged_params,
        }
        
        if stream:
            return self._stream_chat(payload)
        else:
            return self._complete_chat(payload)

    def _complete_chat(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Send a chat request and return the full response."""
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
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
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                headers=self._build_headers(),
                json=payload,
                stream=True,
                timeout=self.timeout,
            )
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    yield json.loads(line)
        except requests.RequestException as e:
            logger.error(f"Streaming chat failed: {str(e)}")
            yield {"error": str(e)}

    def pull_model(self, model_name: str) -> Dict[str, Any]:
        """
        ////////////////////////////////////////////////////////
        // Pull a model from Ollama library                   //
        ////////////////////////////////////////////////////////
        """
        try:
            response = requests.post(
                f"{self.base_url}/api/pull",
                headers=self._build_headers(),
                json={"name": model_name},
                timeout=None,  # No timeout for model pulling
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to pull model {model_name}: {str(e)}")
            return {"error": str(e)}

    def model_info(self, model_name: str) -> Dict[str, Any]:
        """
        ////////////////////////////////////////////////////////
        // Get information about a specific model              //
        ////////////////////////////////////////////////////////
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/show",
                headers=self._build_headers(),
                params={"name": model_name},
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to get info for model {model_name}: {str(e)}")
            return {"error": str(e)}

# Create a client instance
client = OllamaClient()

if __name__ == "__main__":
    # Simple test when run directly
    models = client.list_models()
    print(f"Available models: {json.dumps(models, indent=2)}")
    
    if models:
        response = client.generate("What is Ollama and how does it work?")
        print(f"Response: {response}")
