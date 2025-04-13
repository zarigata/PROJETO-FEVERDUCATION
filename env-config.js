/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - Environment Configuration                            //
 * //  ---------------------------------------------------------------        //
 * //  This file provides environment configuration for the application,      //
 * //  including database connection settings and API endpoints.              //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

// Database configuration
const DB_USER = process.env.POSTGRES_USER || 'feverducation';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'fevereducation_pass';
const DB_NAME = process.env.POSTGRES_DB || 'feverducation';
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_PORT = process.env.POSTGRES_PORT || '5432';

// AI Backend configuration
const AI_BACKEND_HOST = process.env.AI_BACKEND_HOST || 'localhost';
const AI_BACKEND_PORT = process.env.AI_BACKEND_PORT || '8000';

// Ollama configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'localhost';
const OLLAMA_PORT = process.env.OLLAMA_PORT || '11434';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Export configuration
module.exports = {
  // Database connection string for Prisma
  DATABASE_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  
  // AI Backend URL
  AI_BACKEND_URL: `http://${AI_BACKEND_HOST}:${AI_BACKEND_PORT}`,
  
  // Ollama API URL
  OLLAMA_API_URL: `http://${OLLAMA_HOST}:${OLLAMA_PORT}`,
  
  // OpenRouter configuration
  OPENROUTER_API_KEY,
  
  // Environment
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
};
