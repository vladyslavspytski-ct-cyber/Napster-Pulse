# Interu - Voice-Based Interview Platform

## Overview

Interu is a voice-powered interview platform that allows users to create voice-based interviews, share them via links, and collect responses with AI-powered analysis. The application consists of a React/TypeScript frontend and a Go backend service following Clean Architecture principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and dev server
- Tailwind CSS for styling with custom design system
- shadcn/ui component library (Radix UI primitives)
- React Router for client-side routing
- TanStack Query for server state management
- Framer Motion for animations

**Key Design Decisions:**
- Component-based architecture with reusable UI primitives in `src/components/ui/`
- Custom button variants (PrimaryButton, SecondaryButton) for consistent branding
- Glass morphism design with custom CSS variables for theming
- Local storage used for interview data persistence (`src/lib/interviewStorage.ts`)

**Route Structure:**
- `/` - Landing page with marketing content
- `/create-interview` - Interview creation flow
- `/i/:token` - Public interview participation page

### Backend Architecture

**Technology Stack:**
- Go (Golang)
- Clean Architecture pattern
- PostgreSQL database
- HTTP REST API

**Directory Structure:**
```
/cmd/api/main.go          - Application entry point
/internal/
  /entities               - Core business entities
  /usecases               - Business logic layer
  /repositories           - Data access interfaces
    /postgres             - PostgreSQL implementations
  /delivery/http          - HTTP handlers and routing
  /infrastructure         - External service implementations
/migrations               - Database migration files
```

**Key Design Decisions:**
- Clean Architecture separates concerns into layers (entities, use cases, repositories, delivery)
- ElevenLabs API key is kept server-side only for security
- Repository pattern abstracts database operations

### Data Storage

**Frontend:**
- LocalStorage for temporary interview data during creation
- Interview structure includes: id, title, questions array, token, publicUrl, createdAt

**Backend:**
- PostgreSQL database for persistent storage
- Environment-based configuration for database connection

## External Dependencies

### Third-Party Services
- **ElevenLabs API** - Voice AI service for conversation handling (requires `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID`)

### Frontend Dependencies
- React ecosystem (react, react-dom, react-router-dom)
- UI libraries (Radix UI, shadcn/ui components, Lucide icons)
- Build tools (Vite, TypeScript, ESLint)
- Testing (Vitest, @testing-library/jest-dom)

### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key | Required |
| `ELEVENLABS_AGENT_ID` | ElevenLabs Agent ID | default |
| `PGHOST` | PostgreSQL host | localhost |
| `PGPORT` | PostgreSQL port | 5432 |
| `PGUSER` | PostgreSQL user | postgres |
| `PGPASSWORD` | PostgreSQL password | - |
| `PGDATABASE` | PostgreSQL database | postgres |
| `SERVER_PORT` | HTTP server port | 8080 |

### API Endpoints
- `GET /health` - Health check endpoint
- `POST /api/v1/connection` - Get ElevenLabs connection URL