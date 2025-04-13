# FeverDucation

/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - AI-Powered Educational Platform                      //
 * //  ---------------------------------------------------------------        //
 * //  A comprehensive containerized platform for revolutionizing             //
 * //  education through AI-powered insights and content generation.          //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

FeverDucation is an AI-powered teaching platform that revolutionizes education for both teachers and students, featuring a containerized architecture with Next.js, Python, and PostgreSQL.

## Features

- **Teacher Dashboard**: Analytics, class management, and student tracking
- **AI Class Generator**: Create engaging lessons in seconds
- **AI Homework Builder**: Generate personalized assignments
- **Student Portal**: Access classes, quizzes, and learning materials
- **AI Tutor**: 24/7 learning assistance for students
- **Dual AI Backend**: Supports both local (Ollama) and cloud (OpenRouter) AI services with fallback mechanisms

## Tech Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Python 3.11, FastAPI
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **AI Services**: Ollama (local), OpenRouter (cloud)
- **Containerization**: Docker, Docker Compose
- **Development Tools**: pgAdmin

## Containerized Architecture

The application is fully containerized with Docker, providing a consistent environment across development and production:

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                         │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Next.js   │    │   Python    │    │   Ollama    │     │
│  │  Frontend   │◄──►│  AI Backend │◄──►│  AI Service │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         ▲                  ▲                               │
│         │                  │                               │
│         ▼                  ▼                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  PostgreSQL │    │   pgAdmin   │    │ OpenRouter  │     │
│  │  Database   │◄──►│  DB Admin   │    │ (External)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Options

### Docker Deployment (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fevereducation.git
   cd fevereducation
   ```

2. Copy the environment variables example file:
   ```bash
   cp env.local.example .env
   ```

3. Edit the `.env` file to configure your environment (API keys, database credentials, etc.)

4. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

5. Initialize the database (first time only):
   ```bash
   docker-compose exec nextjs npx prisma migrate dev --name init
   docker-compose exec nextjs npx prisma db seed
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - pgAdmin: http://localhost:5050 (login with credentials from .env)
   - AI Backend API: http://localhost:8000/docs

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fevereducation.git
   cd fevereducation
   ```

2. Copy the environment variables example file:
   ```bash
   cp env.local.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Start the Python AI backend:
   ```bash
   cd ai-backend
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Linux/Mac
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Pages Deployment

This project is also configured for automatic deployment to GitHub Pages:

1. Push your changes to the main branch:
   ```bash
   git push origin main
   ```

2. The GitHub Actions workflow will automatically build and deploy the site.

3. Your site will be available at `https://yourusername.github.io/fevereducation/`

## Configuration

### Docker Configuration

The `docker-compose.yml` file defines all services required for the application:

- **nextjs**: Frontend service running Next.js
- **postgres**: PostgreSQL database
- **pgadmin**: Web-based PostgreSQL administration tool
- **ai-backend**: Python FastAPI service for AI processing
- **ollama**: Local AI model service

You can customize service configurations by editing the `docker-compose.yml` file or by setting environment variables in the `.env` file.

### AI Backend Configuration

The AI backend supports two modes:

1. **Local Mode (Ollama)**: Uses locally hosted models for privacy and no API costs
   - Default model: llama3.2
   - No internet connection required
   - GPU acceleration supported (if available)

2. **Cloud Mode (OpenRouter)**: Uses cloud-based models for higher quality
   - Requires API key
   - Internet connection required
   - Fallback to local mode if unavailable

Configure AI settings in the `.env` file:

```
# Ollama Configuration
OLLAMA_HOST=localhost
OLLAMA_PORT=11434

# OpenRouter Configuration (Optional)
# OPENROUTER_API_KEY=your_api_key_here
```

## Database Schema

The application uses a comprehensive PostgreSQL schema managed by Prisma ORM, including models for:

- Users (Teachers/Students)
- Classes
- Lessons
- Assignments
- Grades
- Attendance tracking

## Demo Credentials

- **Email**: demo@fevereducation.com
- **Password**: password

## License

MIT
