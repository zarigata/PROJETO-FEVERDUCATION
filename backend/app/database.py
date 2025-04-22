# CODEX: Database configuration and session management
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import yaml

# load config.yaml from project root
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'config.yaml'))
with open(config_path) as f:
    cfg = yaml.safe_load(f)

DATABASE_URL = cfg['database_url']

# SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
