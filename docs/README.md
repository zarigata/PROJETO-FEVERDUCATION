# FeverDucation Documentation

## Project Overview

FeverDucation is a modern, scalable educational platform composed of:

- **Backend**: Python, FastAPI, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Ollama for AI-driven tutoring and lesson generation
- **Containerization**: Docker & Docker Compose for easy setup

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo_url>
   cd PROJETO-FEVERDUCATION
   ```

2. Backend Setup

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Linux/macOS
   .\venv\Scripts\activate  # Windows
   pip install --no-cache-dir -r requirements.txt

   # Create a config file:
   cp ../config/config.yaml.example ../config/config.yaml
   # Edit ../config/config.yaml to add database credentials, JWT secret, Ollama settings

   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. Docker Compose

   ```bash
   cd ..
   docker-compose up --build
   ```

4. Frontend Setup

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the App

   - Backend API: http://localhost:8000
   - Frontend UI: http://localhost:3000
