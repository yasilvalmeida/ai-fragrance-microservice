#!/bin/bash

# AI Fragrance Microservice - Development Startup Script

echo "🌟 Starting AI Fragrance Microservice Development Environment"
echo "============================================================"

# Check if Docker is running
if ! docker --version >/dev/null 2>&1; then
    echo "❌ Error: Docker is not installed or not running"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Error: Docker Compose is not available"
    exit 1
fi

# Create environment files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please add your OpenAI API key to backend/.env"
fi

if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend/.env.local from example..."
    cp frontend/.env.example frontend/.env.local
fi

# Build and start the services
echo "🔨 Building and starting services..."
docker compose up --build -d

echo ""
echo "🚀 Services are starting up..."
echo ""
echo "📋 Service URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   API Docs:  http://localhost:3001/api"
echo ""
echo "📊 Monitor logs with:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Stop services with:"
echo "   docker compose down"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend may still be starting up"
fi

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend may still be starting up"
fi

echo ""
echo "🎉 Development environment is ready!"
echo "💡 Don't forget to add your OpenAI API key to backend/.env" 