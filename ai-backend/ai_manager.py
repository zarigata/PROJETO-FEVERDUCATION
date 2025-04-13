#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - AI Manager                                           //
//  ---------------------------------------------------------------        //
//  This module provides a unified interface for AI operations,            //
//  managing both Ollama (local) and OpenRouter (cloud) backends.          //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
"""

import json
import logging
import asyncio
import requests
from typing import Dict, Any, List, Optional, Union, Generator, AsyncGenerator

from .config import config
from .ollama_client import client as ollama_client
from .openrouter_client import client as openrouter_client

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.get_config()["system"]["log_level"]),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("ai_manager")


class AIManager:
    """
    ////////////////////////////////////////////////////////
    // Unified interface for AI operations, managing      //
    // both Ollama (local) and OpenRouter (cloud) backends//
    ////////////////////////////////////////////////////////
    """

    def __init__(self):
        """Initialize the AI Manager with configuration."""
        self.config = config.get_config()
        self.ollama_enabled = self.config["ollama"]["enabled"]
        self.openrouter_enabled = self.config["openrouter"]["enabled"]
        
        # Initialize clients
        self.ollama = ollama_client
        self.openrouter = openrouter_client
        
        logger.info(f"Initialized AI Manager with Ollama enabled: {self.ollama_enabled}, OpenRouter enabled: {self.openrouter_enabled}")

    def is_ollama_available(self) -> bool:
        """
        ////////////////////////////////////////////////////////
        // Check if Ollama service is available and responsive//
        ////////////////////////////////////////////////////////
        """
        if not self.ollama_enabled:
            return False
            
        try:
            response = requests.get(
                f"{self.ollama.base_url}/api/version",
                timeout=2,  # Short timeout for availability check
            )
            return response.status_code == 200
        except requests.RequestException:
            return False

    async def is_ollama_available_async(self) -> bool:
        """Async version of is_ollama_available."""
        if not self.ollama_enabled:
            return False
            
        try:
            async with asyncio.timeout(2):  # Short timeout for availability check
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.ollama.base_url}/api/version") as response:
                        return response.status == 200
        except (asyncio.TimeoutError, aiohttp.ClientError):
            return False

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        stream: bool = False,
        use_fallback: bool = True
    ) -> Union[Dict[str, Any], Generator[Dict[str, Any], None, None]]:
        """
        ////////////////////////////////////////////////////////
        // Send a chat completion request to the preferred    //
        // backend, with fallback if primary fails            //
        //                                                    //
        // Args:                                              //
        //   messages: List of message dicts with role/content//
        //   model: Model to use (defaults to config)         //
        //   parameters: Generation parameters                //
        //   stream: Whether to stream the response           //
        //   use_fallback: Whether to try fallback if primary //
        //                 backend fails                      //
        //                                                    //
        // Returns:                                           //
        //   Response dict or stream generator                //
        ////////////////////////////////////////////////////////
        """
        # Try Ollama first if enabled and available
        if self.ollama_enabled and self.is_ollama_available():
            logger.info(f"Using Ollama backend for chat with model: {model or self.ollama.model}")
            try:
                result = self.ollama.chat(
                    messages=messages,
                    model=model or self.ollama.model,
                    parameters=parameters,
                    stream=stream
                )
                
                # Check if error in result (non-streamed)
                if not stream and isinstance(result, dict) and "error" in result:
                    if not use_fallback or not self.openrouter_enabled:
                        return result
                    logger.warning(f"Ollama chat failed: {result['error']}, trying OpenRouter fallback")
                else:
                    return result
                    
            except Exception as e:
                if not use_fallback or not self.openrouter_enabled:
                    return {"error": str(e)}
                logger.warning(f"Ollama chat error: {str(e)}, trying OpenRouter fallback")
        
        # Use OpenRouter as fallback or if Ollama is disabled
        if self.openrouter_enabled:
            logger.info(f"Using OpenRouter backend for chat with model: {model or self.openrouter.model}")
            return self.openrouter.chat(
                messages=messages,
                model=model or self.openrouter.model,
                parameters=parameters,
                stream=stream
            )
        
        return {"error": "No available AI backends"}

    async def chat_async(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        stream: bool = False,
        use_fallback: bool = True
    ) -> Union[Dict[str, Any], AsyncGenerator[Dict[str, Any], None]]:
        """Async version of chat with fallback support."""
        # Try Ollama first if enabled and available
        if self.ollama_enabled and await self.is_ollama_available_async():
            logger.info(f"Using Ollama backend for async chat with model: {model or self.ollama.model}")
            try:
                if stream:
                    # For streaming, we need to handle differently since we can't easily
                    # switch to a fallback in the middle of a stream
                    return self.ollama._stream_chat_async({
                        "model": model or self.ollama.model,
                        "messages": messages,
                        "options": {**self.ollama.parameters, **(parameters or {})}
                    })
                else:
                    result = await self.ollama._complete_chat_async({
                        "model": model or self.ollama.model,
                        "messages": messages,
                        "options": {**self.ollama.parameters, **(parameters or {})}
                    })
                    
                    # Check if error in result
                    if isinstance(result, dict) and "error" in result:
                        if not use_fallback or not self.openrouter_enabled:
                            return result
                        logger.warning(f"Ollama async chat failed: {result['error']}, trying OpenRouter fallback")
                    else:
                        return result
                        
            except Exception as e:
                if not use_fallback or not self.openrouter_enabled:
                    return {"error": str(e)}
                logger.warning(f"Ollama async chat error: {str(e)}, trying OpenRouter fallback")
        
        # Use OpenRouter as fallback or if Ollama is disabled
        if self.openrouter_enabled:
            logger.info(f"Using OpenRouter backend for async chat with model: {model or self.openrouter.model}")
            if stream:
                return self.openrouter._stream_chat_async({
                    "model": model or self.openrouter.model,
                    "messages": messages,
                    **(parameters or {})
                })
            else:
                return await self.openrouter._complete_chat_async({
                    "model": model or self.openrouter.model,
                    "messages": messages,
                    **(parameters or {})
                })
        
        return {"error": "No available AI backends"}

    def get_available_models(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        ////////////////////////////////////////////////////////
        // Get available models from all configured backends  //
        ////////////////////////////////////////////////////////
        """
        results = {}
        
        if self.ollama_enabled and self.is_ollama_available():
            results["ollama"] = self.ollama.list_models()
        
        if self.openrouter_enabled and self.openrouter.api_key:
            results["openrouter"] = self.openrouter.list_models()
            
        return results

# Create a manager instance
manager = AIManager()

if __name__ == "__main__":
    # Simple test when run directly
    available_models = manager.get_available_models()
    print(f"Available models: {json.dumps(available_models, indent=2)}")
    
    # Test chat
    response = manager.chat([
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Hello! How are you today?"}
    ])
    
    if isinstance(response, dict) and "error" not in response:
        print(f"Response: {json.dumps(response, indent=2)}")
    elif isinstance(response, dict):
        print(f"Error: {response.get('error', 'Unknown error')}")
    else:
        print("Received streaming response (generator object)")
