#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - AI Backend Configuration                             //
//  ---------------------------------------------------------------        //
//  This module provides configuration settings for AI model access         //
//  through both Ollama (local) and OpenRouter (cloud) endpoints.          //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
"""

import os
import json
import platform
from pathlib import Path
from typing import Dict, Any, Optional, List

# Default configuration values
DEFAULT_CONFIG = {
    # Ollama configuration
    "ollama": {
        "enabled": True,
        "host": "127.0.0.1",
        "port": 11434,
        "model": "llama3.2",  # Default model as per requirements
        "context_window": 8192,
        "parameters": {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 1024
        }
    },
    
    # OpenRouter configuration
    "openrouter": {
        "enabled": False,  # Disabled by default, enabled as fallback
        "api_key": "",  # Must be set by user
        "model": "anthropic/claude-3-7-sonnet",
        "parameters": {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 1024
        }
    },
    
    # System configuration
    "system": {
        "cache_enabled": True,
        "cache_dir": "./cache",
        "log_level": "INFO",
        "timeout": 30,
        "proxy": None
    }
}

class AIConfig:
    """Configuration manager for AI backends."""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        ///////////////////////////////////////////////////////
        // Initialize configuration with either provided path //
        // or default location based on operating system     //
        ///////////////////////////////////////////////////////
        """
        self.config_dir = self._get_config_dir()
        self.config_path = config_path or os.path.join(self.config_dir, "ai_config.json")
        self.config = self._load_config()
    
    def _get_config_dir(self) -> str:
        """
        ////////////////////////////////////////////////////////
        // Determine appropriate config directory based on OS  //
        // Windows: %APPDATA%/FeverEducation                  //
        // Linux/Mac: ~/.config/feverducation                 //
        ////////////////////////////////////////////////////////
        """
        system = platform.system()
        
        if system == "Windows":
            base_dir = os.environ.get("APPDATA", "")
            return os.path.join(base_dir, "FeverEducation")
        else:  # Linux, Darwin, etc.
            return os.path.expanduser("~/.config/feverducation")
    
    def _load_config(self) -> Dict[str, Any]:
        """
        ///////////////////////////////////////////////////////
        // Load configuration from file or create default    //
        // if file doesn't exist                            //
        ///////////////////////////////////////////////////////
        """
        os.makedirs(self.config_dir, exist_ok=True)
        
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    user_config = json.load(f)
                
                # Merge with defaults, preserving user settings
                return self._deep_merge(DEFAULT_CONFIG, user_config)
            except (json.JSONDecodeError, IOError) as e:
                print(f"[WARNING] Failed to load config: {e}. Using defaults.")
                return DEFAULT_CONFIG.copy()
        else:
            # Create default config
            self.save_config(DEFAULT_CONFIG)
            return DEFAULT_CONFIG.copy()
    
    def _deep_merge(self, default: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
        """
        ///////////////////////////////////////////////////////
        // Recursively merge dictionaries, giving priority   //
        // to override values                               //
        ///////////////////////////////////////////////////////
        """
        result = default.copy()
        
        for key, value in override.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value
                
        return result
    
    def get_config(self) -> Dict[str, Any]:
        """Get full configuration dictionary."""
        return self.config
    
    def get_ollama_config(self) -> Dict[str, Any]:
        """Get Ollama-specific configuration."""
        return self.config.get("ollama", {})
    
    def get_openrouter_config(self) -> Dict[str, Any]:
        """Get OpenRouter-specific configuration."""
        return self.config.get("openrouter", {})
    
    def save_config(self, config: Optional[Dict[str, Any]] = None) -> None:
        """
        ////////////////////////////////////////////////////////
        // Save configuration to file, creating dirs if needed //
        ////////////////////////////////////////////////////////
        """
        if config:
            self.config = config
            
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
            
    def update_config(self, section: str, key: str, value: Any) -> None:
        """
        ////////////////////////////////////////////////////////
        // Update a specific configuration value and save     //
        ////////////////////////////////////////////////////////
        """
        if section in self.config:
            if isinstance(self.config[section], dict) and key in self.config[section]:
                self.config[section][key] = value
                self.save_config()
            elif isinstance(self.config[section], dict):
                # Add new key
                self.config[section][key] = value
                self.save_config()
        
    def get_api_base_url(self, backend: str = "ollama") -> str:
        """
        ////////////////////////////////////////////////////////
        // Get formatted base URL for API requests            //
        ////////////////////////////////////////////////////////
        """
        if backend.lower() == "ollama":
            config = self.get_ollama_config()
            host = config.get("host", "127.0.0.1")
            port = config.get("port", 11434)
            return f"http://{host}:{port}"
        elif backend.lower() == "openrouter":
            return "https://openrouter.ai/api/v1"
        else:
            raise ValueError(f"Unknown backend: {backend}")

# Create singleton instance
config = AIConfig()

if __name__ == "__main__":
    # Display current configuration when run directly
    print(json.dumps(config.get_config(), indent=2))
