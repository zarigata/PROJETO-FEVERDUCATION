# /////////////////////////////////////////////////////////////////////////////
# //                                                                         //
# //  [FEVERDUCATION] - AI Backend Dockerfile                                //
# //  ---------------------------------------------------------------        //
# //  This Dockerfile builds the Python AI backend service that connects     //
# //  the Next.js frontend with Ollama and database services.                //
# //                                                                         //
# //  CODEX LEVEL: ALPHA-7                                                   //
# //  VERSION: 1.0.0                                                         //
# //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
# //                                                                         //
# /////////////////////////////////////////////////////////////////////////////

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Setup Python virtual environment as per requirement
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY ai-backend/requirements.txt /app/requirements.txt

# Install Python dependencies within virtual environment
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy AI backend code
COPY ai-backend /app/ai-backend

# Install the package in development mode
RUN pip install -e /app

# Expose the FastAPI port
EXPOSE 8000

# Start the FastAPI server
CMD ["python", "-m", "ai_backend.server"]
