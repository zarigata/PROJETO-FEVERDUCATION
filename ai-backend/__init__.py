#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - AI Backend Package Initialization                    //
//  ---------------------------------------------------------------        //
//  This module initializes the AI backend package for FeverEducation.     //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
"""

from .config import config
from .ollama_client import client as ollama_client
from .openrouter_client import client as openrouter_client
from .ai_manager import manager

__all__ = ['config', 'ollama_client', 'openrouter_client', 'manager']
