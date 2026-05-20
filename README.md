

```markdown
# Microservices Practice

A backend project built to practice microservices architecture using Node.js, TypeScript, Prisma, and Docker.

## Architecture

```
Client
  ↓
API Gateway (port 3000)
  ↙              ↘
User Service    Job Service
(port 3001)     (port 3002)
    ↓                ↓
 users DB        jobs DB
```

## Services

### API Gateway
- Single entry point for all client requests
- Routes `/api/auth/*` to User Service
- Routes `/api/jobs/*` to Job Service
- No business logic, no database

### User Service
- Handles registration, login, JWT token generation
- Verifies tokens for other services
- Own PostgreSQL database

### Job Service
- Handles job CRUD operations
- Calls User Service to verify JWT before any protected route
- Own PostgreSQL database

## Tech Stack
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker + Docker Compose
- JWT authentication
- Axios for inter-service communication

## How to Run

### Prerequisites
- Docker Desktop
- Node.js 18+

### Start all databases
```bash
docker-compose up
```

### Start gateway locally
```bash
cd gateway
npm install
npx ts-node src/index.ts
```

## API Endpoints

### Auth (via Gateway)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/auth/verify | Verify a JWT token |

### Jobs (via Gateway)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/jobs/create | Create a job (protected) |
| GET | /api/jobs | Get all jobs |
| GET | /api/jobs/:id | Get job by ID |

## Key Concepts Learned
- Microservices architecture and service boundaries
- Inter-service communication via HTTP
- Each service owns its own database — no shared databases
- JWT passed between services for authentication
- Docker Compose for running multiple services locally
- API Gateway pattern as single entry point

## Author
Niamul — [@NiamulNotizj](https://x.com/NiamulNotizj)
```
