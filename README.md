# Moto-Minder Backend

A comprehensive backend system for motorcycle enthusiasts to manage their motorcycles, track maintenance schedules, and log their rides similar to Strava for motorcycles.

## 🎯 Core Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing + OAuth2 (Google, Garmin)
- **Motorcycle Management**: Create and manage your motorcycle collection with detailed technical specifications
- **Maintenance Tracking**: Track maintenance history, costs, parts used, and automatic calculation of next service due dates
- **Ride Tracking**: Log rides with distance, fuel consumption, and performance metrics
- **Manufacturer Catalog**: Browse and select from a comprehensive motorcycle manufacturer and model database

## 🏗️ Architecture

Hexagonal Architecture (Ports & Adapters) + Domain-Driven Design

```
┌─────────────────────────────────────────────┐
│     Presentation Layer (Controllers)        │
├─────────────────────────────────────────────┤
│  Application Layer (Use Cases)              │
├─────────────────────────────────────────────┤
│    Infrastructure Layer (Adapters)          │
└─────────────────────────────────────────────┘
         │
         ↓
    ┌─────────────┐
    │Domain Layer │ (Pure Business Logic)
    │ (Entities,  │ (No Framework Dependencies)
    │   VOs)      │
    └─────────────┘
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | NestJS 11.0.1 |
| **Language** | TypeScript 5.7.3 |
| **Database** | PostgreSQL 16 |
| **ORM** | TypeORM 0.3.27 |
| **Auth** | JWT + Passport + OAuth2 |
| **API Docs** | Swagger/OpenAPI |
| **Testing** | Jest + Supertest |
| **Hashing** | bcrypt 6.0.0 |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)

### Local Setup

```bash
# Clone and install
git clone <repo>
cd moto-minder/back
npm install

# Setup environment
cp .env.example .env
# Edit .env with your config

# Start database
docker-compose up -d

# Run migrations
npm run migration:run

# Start application
npm run start:dev
```

API available at: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

### Docker Setup

```bash
docker-compose up -d
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/oauth/login` - OAuth login (Google/Garmin)

### User
- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user

### Manufacturers
- `POST /manufacturers` - Create
- `GET /manufacturers` - List all
- `GET /manufacturers/:id` - Get by ID
- `GET /manufacturers/search?name=...` - Search by name

### Motorcycle Models
- `POST /motocycle-models` - Create
- `GET /motocycle-models` - List all
- `GET /motocycle-models/:id` - Get by ID
- `GET /motocycle-models/manufacturer/:manufacturerId` - Get by manufacturer
- `PATCH /motocycle-models/:id` - Update
- `DELETE /motocycle-models/:id` - Delete

### User Motorcycles
- `POST /user-motocycles` - Add motorcycle
- `GET /user-motocycles` - List all
- `GET /user-motocycles/me` - Get user's motorcycles
- `GET /user-motocycles/:id` - Get specific motorcycle
- `PATCH /user-motocycles/:id` - Update
- `DELETE /user-motocycles/:id` - Delete

### Maintenance
- `POST /maintenance` - Create record
- `GET /maintenance/motorcycle/:userMotocycleId` - Get history
- `GET /maintenance/upcoming` - Get upcoming maintenance
- `GET /maintenance/history/:userMotocycleId` - Get paginated history
- `PATCH /maintenance/:id` - Update record
- `DELETE /maintenance/:id` - Delete record

### Rides
- `POST /rides` - Start ride
- `PATCH /rides/:id` - Complete ride
- `GET /rides/motorcycle/:userMotocycleId` - Get ride history
- `GET /rides/statistics/:userMotocycleId` - Get ride statistics

## 📊 Database Schema

Main entities:
- **Users** - User accounts with email/password
- **Manufacturers** - Motorcycle brands
- **Motorcycle Models** - Models with 20+ technical specifications
- **User Motorcycles** - User's motorcycle collection
- **Maintenance Records** - Service history and costs
- **Rides** - Ride logs with distance/fuel data

All relationships properly indexed with cascading deletes where appropriate.

## 🧪 Testing

```bash
npm run test:unit          # Unit tests
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # E2E tests
```

**Current Status**: 362 tests passing across 15 test suites
- Domain layer: 100% coverage
- Application layer: 90%+ coverage
- E2E coverage: 85%+ of critical flows

## 💻 Development

### Project Structure

```
src/
├── auth/                  # Authentication module
├── user/                  # User module
├── manufacturers/         # Manufacturers module
├── motocycle-model/       # Motorcycle models module
├── user-motocycle/        # User's motorcycles module
├── maintenance/           # Maintenance tracking module
├── ride/                  # Ride tracking module
├── shared/                # Shared utilities & database config
├── app.module.ts          # Root module
└── main.ts                # Entry point

test/                       # E2E tests
docker-compose.yml         # Development environment
typeorm.config.ts          # ORM configuration
```

### Module Structure

Each module follows:
```
module-name/
├── domain/                # Business logic (entities, VOs, exceptions)
├── application/           # Use cases & repository ports
├── infrastructure/        # Repository adapters & database schemas
├── presentation/          # Controllers & DTOs
└── module-name.module.ts  # Module configuration
```

### Key Commands

```bash
# Development
npm run start              # Production mode
npm run start:dev          # Development mode
npm run build              # Compile TypeScript

# Database
npm run migration:show     # List migrations
npm run migration:run      # Run pending
npm run migration:revert   # Undo last
npm run migration:create -- NameOfMigration

# Code Quality
npm run lint               # ESLint
npm run format             # Prettier
```

## 🐳 Docker

```bash
docker-compose up -d       # Start
docker-compose down        # Stop
docker-compose logs -f app # View logs
docker-compose up --build  # Rebuild
```

## 🔐 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=motominder

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

GARMIN_CLIENT_ID=...
GARMIN_CLIENT_SECRET=...
GARMIN_REDIRECT_URI=...
```

## 📈 Implementation Status

### Completed
- ✅ Authentication (JWT + bcrypt + OAuth2)
- ✅ User module (CRUD)
- ✅ Manufacturers (CRUD)
- ✅ Motorcycle Models (CRUD + 20+ specs)
- ✅ User Motorcycles (CRUD)
- ✅ Maintenance Tracking (full implementation)
- ✅ Ride Tracking (full implementation)
- ✅ Database infrastructure (PostgreSQL + TypeORM + migrations)
- ✅ Swagger documentation
- ✅ Global exception handling
- ✅ Comprehensive testing (362 tests)
- ✅ Code cleanup (removed all inline comments)

### Running Now
- 🔄 Full test suite (all passing)
- 🔄 Production readiness improvements

## 📄 Additional Documentation

- **CONTEXT.md** - Development rules, architecture principles, and standards
- **Swagger** - Interactive API documentation at `/api/docs`

## 📞 Support

For issues or questions, please refer to the project's issue tracker or CONTEXT.md for development guidelines.

---

**Last Updated**: December 2024
**Status**: Production Ready
**Test Coverage**: 362 tests passing (Unit + Integration + E2E)
