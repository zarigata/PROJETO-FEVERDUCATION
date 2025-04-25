# CODEX: Dockerfile for backend service
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libffi-dev libssl-dev python3-dev \
    && pip install --no-cache-dir -r requirements.txt python-multipart \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Expose application port
EXPOSE 8000

# Ensure stdout/stderr are unbuffered
ENV PYTHONUNBUFFERED=1

# Start the FastAPI app with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
