# AI Fragrance Microservice Architecture

## System Overview

The AI Fragrance Microservice is a modern full-stack application that leverages artificial intelligence to provide personalized fragrance recommendations. The system is designed with microservices architecture principles, emphasizing scalability, maintainability, and developer experience.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Next.js       │    │   NestJS        │    │   OpenAI        │
│   Frontend      │◄──►│   Backend       │◄──►│   API           │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │
│   Browser       │    │   Docker        │
│   localStorage  │    │   Containers    │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with validation
- **State Management**: React useState/useEffect
- **HTTP Client**: Axios with interceptors
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Backend (NestJS)

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAI
- **Logging**: Winston with custom transports
- **Rate Limiting**: @nestjs/throttler
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Testing**: Jest with comprehensive coverage

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx (production)
- **SSL/TLS**: Let's Encrypt ready configuration

## Design Principles

### 1. Microservices Architecture

- **Separation of Concerns**: Frontend and backend are completely decoupled
- **Independent Deployment**: Each service can be deployed independently
- **Technology Agnostic**: Services communicate via REST API
- **Scalability**: Each service can be scaled independently

### 2. Domain-Driven Design

- **Fragrance Domain**: Core business logic encapsulated in dedicated modules
- **Health Monitoring**: Separate module for system health checks
- **Common Utilities**: Shared utilities for cross-cutting concerns

### 3. Clean Architecture

- **Layers**: Clear separation between presentation, business logic, and data access
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Single Responsibility**: Each class/module has a single reason to change

## Core Components

### Frontend Architecture

#### Pages

- `/` - Main application with form and results
- `/checkout` - Shopping cart and payment flow
- `/not-found` - Custom 404 error page

#### Components

- `FragranceForm` - User preference collection
- `FragranceResults` - AI recommendation display
- `LoadingSpinner` - Reusable loading indicator

#### Services

- `api.ts` - HTTP client with error handling and retry logic
- Request/response interceptors for logging and error handling

#### Types

- Strong TypeScript interfaces for all data structures
- Enum definitions for consistent value validation

### Backend Architecture

#### Modules

```
src/
├── app.module.ts                 # Root module with global configuration
├── main.ts                       # Application bootstrap
├── fragrance/                    # Core business domain
│   ├── fragrance.module.ts
│   ├── fragrance.controller.ts   # REST API endpoints
│   ├── fragrance.service.ts      # Business logic and OpenAI integration
│   └── dto/                      # Data transfer objects
├── health/                       # System monitoring
│   ├── health.module.ts
│   ├── health.controller.ts
│   └── health.service.ts
└── common/                       # Shared utilities
    ├── filters/                  # Global exception handling
    ├── middleware/               # Request logging
    ├── guards/                   # Rate limiting and security
    └── decorators/               # Custom metadata decorators
```

#### Data Flow

1. **Request**: Client sends fragrance preferences
2. **Validation**: DTO validation with class-validator
3. **Processing**: Service processes request and calls OpenAI
4. **Retry Logic**: Exponential backoff for failed API calls
5. **Response**: Structured response with recommendations

### AI Integration

#### OpenAI Strategy

- **Model**: GPT-3.5-turbo for cost-effectiveness and speed
- **Prompt Engineering**: Structured prompts for consistent responses
- **Response Parsing**: Robust JSON parsing with fallback handling
- **Error Handling**: Graceful degradation with curated recommendations

#### Retry Mechanism

```typescript
// Exponential backoff with jitter
const delay = baseDelay * Math.pow(2, attempt - 1) + randomJitter;
```

## Security Implementation

### Authentication & Authorization

- **No Authentication**: Simplified for demo purposes
- **Rate Limiting**: IP-based throttling to prevent abuse
- **Input Validation**: Comprehensive request validation

### Security Headers

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Data Protection

- **Environment Variables**: Sensitive data in environment files
- **Request Logging**: Sanitized logging without sensitive data
- **Error Handling**: No sensitive information in error responses

## Performance Optimizations

### Frontend

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Static Generation**: Pre-built static assets
- **Caching**: Browser caching for static assets

### Backend

- **Connection Pooling**: HTTP keep-alive connections
- **Response Compression**: Gzip compression
- **Memory Management**: Efficient object lifecycle management
- **Async Processing**: Non-blocking I/O operations

### Infrastructure

- **Container Optimization**: Multi-stage Docker builds
- **Asset Caching**: Nginx static file caching
- **Compression**: Gzip compression at proxy level

## Monitoring & Observability

### Logging Strategy

- **Structured Logging**: JSON format for machine readability
- **Log Levels**: Appropriate levels (info, warn, error)
- **Request Tracking**: Complete request lifecycle logging
- **Error Context**: Rich error context for debugging

### Health Checks

- **Application Health**: Service availability and dependencies
- **Resource Monitoring**: Memory usage and system resources
- **External Dependencies**: OpenAI API connectivity status

### Metrics Collection

- **Request Metrics**: Response times and success rates
- **Error Tracking**: Error frequency and types
- **Resource Usage**: CPU and memory utilization

## Testing Strategy

### Frontend Testing

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Testing**: User workflow testing (planned)

### Backend Testing

- **Unit Tests**: Service and controller testing
- **Integration Tests**: Database and external API testing
- **E2E Tests**: Complete API workflow testing

### Test Coverage

- Target: 80%+ code coverage
- Critical paths: 100% coverage for core business logic

## Deployment Architecture

### Development

- Docker Compose with hot reload
- Environment file management
- Local SSL certificates for HTTPS testing

### Production

- Multi-container deployment
- Nginx reverse proxy and load balancer
- SSL termination at proxy level
- Health check integration

### CI/CD Pipeline (Recommended)

```yaml
Build → Test → Security Scan → Deploy → Monitor
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless Services**: No server-side session state
- **Load Balancing**: Nginx round-robin distribution
- **Container Orchestration**: Kubernetes ready

### Vertical Scaling

- **Resource Limits**: Configurable container resources
- **Performance Monitoring**: Resource usage tracking
- **Optimization**: Query and response optimization

### Database Scaling (Future)

- **Read Replicas**: Separate read/write operations
- **Caching Layer**: Redis for session and data caching
- **Sharding**: Data partitioning for large datasets

## Future Enhancements

### Planned Features

1. **User Authentication**: JWT-based authentication
2. **Favorites System**: User fragrance favorites
3. **Recommendation History**: Past recommendation tracking
4. **Advanced Analytics**: User behavior analysis
5. **Real Payment Integration**: Stripe/PayPal integration

### Technical Improvements

1. **Caching Layer**: Redis for OpenAI response caching
2. **Message Queue**: Async processing with Redis/RabbitMQ
3. **Database Integration**: PostgreSQL for data persistence
4. **Monitoring Dashboard**: Real-time metrics visualization
5. **API Versioning**: Backward compatibility support

## Troubleshooting Guide

### Common Issues

1. **OpenAI Rate Limits**: Implement exponential backoff
2. **Memory Leaks**: Monitor container memory usage
3. **Network Timeouts**: Adjust timeout configurations
4. **SSL Certificate Issues**: Verify certificate chain

### Debug Tools

- Docker logs and health checks
- Application performance monitoring
- Network connectivity testing
- Configuration validation

This architecture supports the current requirements while providing a solid foundation for future growth and enhancement.
