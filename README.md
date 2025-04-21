# FeverDucation - Educational Platform

## Overview
FeverDucation is a comprehensive educational platform designed for teachers, students, and administrators. The platform features role-based dashboards, AI-powered learning assistance, and a modular architecture for easy customization.

## Features

### Student Dashboard
- Performance analytics and progress tracking
- Classroom enrollment management
- Grade visualization
- AI tutor powered by Ollama for homework assistance

### Teacher Dashboard
- Advanced student performance analytics with AI insights
- Classroom management tools
- Time zone configuration for scheduling
- AI-powered lesson generator using Ollama

### Administrator Dashboard (Hidden)
- Complete user management (create, delete, modify accounts)
- System health monitoring and troubleshooting
- Data management tools (backup, restore, migrate)
- User activity auditing

## Technology Stack

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **AI Integration**: Ollama
- **Authentication**: JWT with role-based access control

### Frontend
- **Framework**: React
- **UI Library**: Material-UI (following Google's Material Design)
- **State Management**: Redux
- **Styling**: CSS Modules with Tailwind CSS
- **Internationalization**: react-i18next

### Deployment
- **Containerization**: Docker & Docker Compose
- **Services**: Backend API, Frontend, Database, Ollama

## Project Structure

```
feverducation/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models and migrations
│   │   ├── services/       # Business logic
│   │   │   └── ai/         # Ollama AI integration
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   └── Dockerfile          # Backend container definition
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── student/    # Student dashboard
│   │   │   └── teacher/    # Teacher dashboard
│   │   ├── services/       # API client services
│   │   ├── styles/         # CSS modules and themes
│   │   │   └── themes/     # Customizable themes
│   │   └── i18n/           # Internationalization
│   ├── tests/              # Frontend tests
│   └── Dockerfile          # Frontend container definition
├── config/
│   └── config.yaml         # Central configuration file
├── docker-compose.yml      # Container orchestration
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Git

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/feverducation.git
   cd feverducation
   ```

2. Configure the application
   - Edit `config/config.yaml` to set your database, Ollama, and admin credentials

3. Start the application
   ```bash
   docker-compose up -d
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Configuration

All configuration is centralized in the `config.yaml` file:

```yaml
# Database Configuration
database:
  host: postgres
  port: 5432
  username: postgres
  password: your_password
  database: feverducation

# Ollama Configuration
ollama:
  host: ollama
  port: 11434
  model: llama2
  api_key: your_api_key

# Admin Configuration
admin:
  username: admin
  password: your_admin_password
  email: admin@example.com

# Security Configuration
security:
  secret_key: your_secret_key
  algorithm: HS256
  access_token_expire_minutes: 30

# Internationalization
i18n:
  default_language: en
  available_languages: [en, es]
```

## Customization

### Styling
- Custom CSS themes can be added to `frontend/src/styles/themes/`
- Users can publish custom CSS files to modify colors, themes, and layouts

### Languages
- Language files are stored in `frontend/src/i18n/locales/`
- New languages can be added by creating additional locale files
- User language preferences are stored in their profile

## Security
- All communication uses HTTPS
- Passwords are hashed using bcrypt
- JWT tokens with role-based permissions
- Protection against common vulnerabilities (SQL injection, XSS, CSRF)

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## License
MIT

## Contributors
- Your Name <your.email@example.com>