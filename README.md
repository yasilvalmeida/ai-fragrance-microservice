# 🌸 AI Fragrance Match System

A full-stack AI-powered application that recommends personalized fragrances based on user preferences using OpenAI's GPT models. Built with **Next.js**, **NestJS**, and fully containerized with **Docker** for streamlined development and deployment.

---

## 🧱 Architecture Overview

- **Frontend**: Next.js 14 — dynamic form, recommendation UI, and checkout mock
- **Backend**: NestJS microservice — OpenAI integration, validation, retry logic, health checks
- **Infrastructure**: Docker Compose orchestration with separate containers for each service

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ai-fragrance-match.git
cd ai-fragrance-match
```

### 2. Set up environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit the backend `.env` file and add your OpenAI key:

```env
OPENAI_API_KEY=your-openai-api-key
```

### 3. Start the application (Docker)

```bash
docker-compose up --build
```

### 4. Access the services

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

---

## 🖥️ Services Breakdown

### Frontend (Next.js)
- 🌟 User preference form
- 🤖 AI-generated fragrance recommendations
- 🛒 Mock checkout process
- 📱 Responsive & mobile-friendly design

### Backend (NestJS)
- 🔌 OpenAI GPT integration
- 🛡️ Request schema validation
- ♻️ Retry logic for resilience
- 📈 Logging & observability
- ❤️ Health check endpoint

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)

```env
OPENAI_API_KEY=your-openai-api-key
PORT=3001
NODE_ENV=development
```

### Frontend (`/frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🧪 API Endpoints

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/fragrance/match`     | Returns recommended fragrances     |
| GET    | `/health`              | Health check for monitoring        |

---

## 👩‍💻 Local Development

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker-Based Development

To spin up the full stack in containers:

```bash
docker-compose up --build
```

---

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: NestJS 10, OpenAI SDK
- **Dev Tools**: Docker, Docker Compose, ESLint, Prettier
- **AI**: OpenAI GPT for text-based recommendations

---

## ✅ Future Improvements (Optional Ideas)

- User authentication (JWT)
- Persistent storage with PostgreSQL or MongoDB
- Admin panel for managing fragrance data
- Stripe integration for real checkout
- Advanced analytics and usage tracking

---

## 🧠 License & Contributions

This project is MIT-licensed. Feel free to fork, contribute, or raise issues for suggestions and improvements. PRs are welcome!

---

**Built with ❤️ using OpenAI, NestJS, and Next.js**
