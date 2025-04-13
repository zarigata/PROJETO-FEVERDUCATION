# /////////////////////////////////////////////////////////////////////////////
# //                                                                         //
# //  [FEVERDUCATION] - Dockerfile                                           //
# //  ---------------------------------------------------------------        //
# //  Multi-stage build file for containerizing the FeverEducation           //
# //  application with Next.js frontend and Python AI backend                //
# //                                                                         //
# //  CODEX LEVEL: ALPHA-7                                                   //
# //  VERSION: 1.0.0                                                         //
# //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
# //                                                                         //
# /////////////////////////////////////////////////////////////////////////////

# Stage 1: Build the Next.js application
FROM node:20-alpine AS frontend-builder

# Set working directory for the frontend
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN pnpm build

# Stage 2: Build the Python backend with venv
FROM python:3.11-slim AS backend-builder

# Set working directory for backend
WORKDIR /app/ai-backend

# Install required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Setup Python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install Python dependencies
COPY ai-backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 3: Final runtime image with Ollama
FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    nodejs \
    npm \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama for Linux
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create ollama directory and user
RUN mkdir -p /root/.ollama

# Copy Next.js build from frontend stage
WORKDIR /app
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json

# Copy Python virtual environment
COPY --from=backend-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy AI backend code
COPY --from=backend-builder /app/ai-backend ./ai-backend

# Create a startup script
RUN echo '#!/bin/bash\n\
# Start Ollama in the background\n\
ollama serve &\n\
\n\
# Wait for Ollama to start\n\
echo "Waiting for Ollama service to start..."\n\
sleep 5\n\
\n\
# Pull the default model (llama3.2)\n\
echo "Pulling llama3.2 model, this may take a while..."\n\
ollama pull llama3.2\n\
\n\
# Start the Next.js server\n\
echo "Starting Next.js application..."\n\
cd /app\n\
npm start\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose port for Next.js
EXPOSE 3000

# Expose port for Ollama API
EXPOSE 11434

# Start the application
CMD ["/app/start.sh"]
