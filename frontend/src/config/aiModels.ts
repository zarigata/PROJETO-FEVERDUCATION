// CODEX: AI model configuration
// Allows toggling Ollama model without code changes

export const AI_MODELS = {
  default: process.env.REACT_APP_OLLAMA_MODEL || 'llama3.2',
};
