# Team Issue Tracker

A mini Jira-style team issue tracker built as a simulated internship project.

## Tech Stack
- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL + JWT
- **Frontend**: React + Redux Toolkit + RTK Query

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)

### Backend
```bash
cd backend
npm install
docker compose up -d   # starts PostgreSQL
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
Available at `http://localhost:3000/api-docs` when backend is running.
