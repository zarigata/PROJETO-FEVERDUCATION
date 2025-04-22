from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import yaml
import os

# Import routers
from app.api.routes import auth, users

# Load configuration
config_path = os.getenv("CONFIG_PATH", "../config/config.yaml")
with open(config_path, "r") as config_file:
    config = yaml.safe_load(config_file)

app = FastAPI(
    title="FeverDucation API",
    description="Backend API for the FeverDucation educational platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config["frontend"]["url"]],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to FeverDucation API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}