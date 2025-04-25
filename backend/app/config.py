# CODEX: Load application configuration from config.yaml and environment
import os
import yaml
from dotenv import load_dotenv

load_dotenv()

config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'config.yaml'))
with open(config_path) as f:
    cfg = yaml.safe_load(f)

OLLAMA_HOST = cfg.get("ollama_host")
OLLAMA_PORT = cfg.get("ollama_port")
OLLAMA_MODEL = cfg.get("ollama_model")
OLLAMA_STYLE = cfg.get("ollama_style")
OLLAMA_PRE_PROMPT = cfg.get("ollama_pre_prompt")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", cfg.get("jwt_secret_key"))
JWT_ALGORITHM = cfg.get("jwt_algorithm")
ACCESS_TOKEN_EXPIRE_MINUTES = cfg.get("access_token_expires_minutes")
REFRESH_TOKEN_EXPIRE_MINUTES = cfg.get("refresh_token_expires_minutes")

DATABASE_URL = os.getenv("DATABASE_URL", cfg.get("database_url"))
