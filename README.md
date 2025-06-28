# AI Fragrance Match System

A full-stack application that uses AI to recommend fragrances based on user preferences.

## Architecture

- **Frontend**: Next.js application with user preference forms and checkout
- **Backend**: NestJS microservice with OpenAI integration
- **Infrastructure**: Docker containers for both services

## Quick Start

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
3. Add your OpenAI API key to `backend/.env`
4. Start the services:
   ```bash
   docker-compose up --build
   ```

## Services

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Features

### Frontend (Next.js)

- User preference form
- AI fragrance recommendations
- Mock checkout system
- Responsive design

### Backend (NestJS)

- OpenAI API integration
- Request validation
- Retry logic for external API calls
- Comprehensive logging
- Health checks

## Environment Variables

### Backend

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### Frontend

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)

## Development

### Running Locally

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker Development

```bash
docker-compose up --build
```

## API Endpoints

- `POST /fragrance/match` - Get AI fragrance recommendations
- `GET /health` - Health check endpoint
