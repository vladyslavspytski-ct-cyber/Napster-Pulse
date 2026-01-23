# Interu Backend - Go API Service

A Go backend service using Clean Architecture for the Interu voice-based interview platform.

## Architecture

This project follows Clean Architecture principles with the following layers:

```
/cmd/api/main.go          - Application entry point
/internal/
  /entities               - Core business entities
  /usecases               - Business logic and use cases
  /repositories           - Repository interfaces
    /postgres             - PostgreSQL implementations
  /delivery/http          - HTTP handlers and routing
  /infrastructure         - External service implementations
/migrations               - Database migration files
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key (required for connection URL generation) | - |
| `ELEVENLABS_AGENT_ID` | ElevenLabs Agent ID for conversation | default |
| `PGHOST` | PostgreSQL host | localhost |
| `PGPORT` | PostgreSQL port | 5432 |
| `PGUSER` | PostgreSQL user | postgres |
| `PGPASSWORD` | PostgreSQL password | - |
| `PGDATABASE` | PostgreSQL database name | postgres |
| `SERVER_PORT` | HTTP server port | 8080 |

## API Endpoints

### Health Check
```bash
curl http://localhost:8080/health
```

Response:
```json
{"status": "healthy"}
```

### Get Connection URL
```bash
curl -X POST http://localhost:8080/api/connection
```

Response:
```json
{
  "connection_url": "wss://...",
  "identifier": "uuid-here"
}
```

## Running in Replit

1. The Go backend runs automatically via the "Go Backend" workflow
2. Set the `ELEVENLABS_API_KEY` secret in Replit's Secrets tab
3. PostgreSQL is automatically configured via Replit's database integration

## Security

- The `ELEVENLABS_API_KEY` is never exposed to the frontend
- All connection requests are logged to PostgreSQL (without sensitive data)
- The backend generates signed URLs that the frontend uses directly

## Database Schema

```sql
CREATE TABLE connection_requests (
    identifier UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    client_ip TEXT NOT NULL
);
```

## Sample curl Commands

```bash
# Health check
curl http://localhost:8080/health

# Get connection URL
curl -X POST http://localhost:8080/api/connection \
  -H "Content-Type: application/json"

# With verbose output
curl -v -X POST http://localhost:8080/api/connection
```
