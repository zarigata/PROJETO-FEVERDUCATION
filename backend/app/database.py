# CODEX: Database configuration and session management
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import yaml
from dotenv import load_dotenv

# load config.yaml from project root
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'config.yaml'))
with open(config_path) as f:
    cfg = yaml.safe_load(f)

# CODEX: load .env variables to allow overriding config settings
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', cfg['database_url'])

# SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():  # CODEX: Dependency that provides a database session and closes it
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
