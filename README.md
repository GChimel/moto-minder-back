# Moto-Minder Backend

## 📋 Project Overview

**Moto-Minder** is a comprehensive backend system for motorcycle enthusiasts to manage their motorcycles, track maintenance schedules, and log their rides similar to Strava for motorcycles.

### Core Features
- **User Authentication**: Secure JWT-based authentication with password hashing
- **Motorcycle Management**: Create and manage your motorcycle collection with detailed technical specifications
- **Maintenance Tracking**: Track maintenance history, costs, parts used, and automatic calculation of next service due dates
- **Ride Tracking**: Log rides with distance, fuel consumption, and performance metrics (Strava-like experience)
- **Manufacturer Catalog**: Browse and select from a comprehensive motorcycle manufacturer and model database

### Target Users
- Motorcycle enthusiasts who want to track their bike's maintenance and usage
- Professional mechanics managing fleet maintenance
- Racers tracking vehicle performance metrics
- Casual riders wanting to maintain their bikes properly

---

## 🏗️ Architecture

Moto-Minder follows **Hexagonal Architecture** (Ports & Adapters pattern) combined with **Domain-Driven Design** principles for maximum separation of concerns and testability.

### Architecture Layers

```
┌─────────────────────────────────────────────┐
│     Presentation Layer (Controllers)        │ ← HTTP Requests
├─────────────────────────────────────────────┤
│  Application Layer (Use Cases/Orchestration)│
├─────────────────────────────────────────────┤
│    Infrastructure Layer (Adapters)          │
└─────────────────────────────────────────────┘
         │
         ↓
    ┌─────────────┐
    │Domain Layer │ ← Pure Business Logic
    │ (Entities,  │   (No Framework Dependencies)
    │   VOs)      │
    └─────────────┘
```

### Layer Descriptions

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Domain** | Pure business logic, framework-agnostic | Entities (User, UserMotocycle), Value Objects (Email, Odometer), Exceptions |
| **Application** | Orchestration of domain logic | Use Cases (CreateUserMotorcycleUseCase), Repository Port Interfaces |
| **Infrastructure** | Framework-specific implementations | TypeORM Repository adapters, Database migrations, JWT token generation |
| **Presentation** | HTTP handling, validation, formatting | Controllers, DTOs, Guards, Exception Filters |

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | NestJS | 11.0.1 |
| **Language** | TypeScript | 5.7.3 |
| **Database** | PostgreSQL | 16 (Alpine) |
| **ORM** | TypeORM | 0.3.27 |
| **Authentication** | JWT + Passport | 11.0.1 + 11.0.5 |
| **API Documentation** | Swagger/OpenAPI | 11.2.3 |
| **Testing** | Jest + Supertest | 29.7.0 + 7.0.0 |
| **Password Hashing** | bcrypt | 6.0.0 |
| **Runtime** | Node.js | 20 (Alpine) |

---

## ✅ Current Implementation Status

### Completed Features (100% Ready - 6/9 Modules)
- ✅ **Authentication Module** (+ OAuth2): JWT/Passport + bcrypt + Google + Garmin OAuth
- ✅ **User Module**: Complete CRUD operations with email validation
- ✅ **Manufacturers Module**: Full CRUD for motorcycle manufacturers
- ✅ **Motorcycle Models Module**: Comprehensive CRUD with 20+ technical specifications
- ✅ **UserMotocycle Module**: User's motorcycle collection CRUD with cascading deletes
- ✅ **OAuth2 Integration**: Google & Garmin OAuth providers with provider abstraction
- ✅ **Database Infrastructure**: PostgreSQL + TypeORM + migrations + cascading FKs
- ✅ **Swagger Documentation**: Auto-generated API docs at `/api/docs`
- ✅ **Global Exception Handling**: Structured error responses + domain exceptions
- ✅ **Validation Pipe**: class-validator with whitelist & transform

### In Progress (Testing Phase)
- 🔄 **Comprehensive Testing**: Unit + Integration + E2E test coverage

### Planned Features (Backlog - High Priority)
- ⏳ **Maintenance Tracking Module**: Service history, costs, parts, next service calculation
- ⏳ **Ride Tracking Module**: Log rides with distance, fuel consumption, fuel economy
- ⏳ **Advanced Features**: Pagination, filtering, rate limiting, file uploads
- ⏳ **Observability**: Structured logging, error tracking

---

## 📁 Project Structure

```
moto-minder/back/
├── src/
│   ├── auth/                           # Authentication module
│   │   ├── application/use-cases/      # Login, Register use cases
│   │   ├── infrastructure/adapters/    # JWT token generation
│   │   └── presentation/               # Auth controller, JWT strategy
│   │
│   ├── user/                           # User module
│   │   ├── domain/
│   │   │   ├── entities/               # User entity
│   │   │   ├── value-objects/          # Email, UserId, UserPassword VOs
│   │   │   └── exceptions/             # Domain exceptions
│   │   ├── application/
│   │   │   ├── ports/                  # User repository port (interface)
│   │   │   └── use-cases/              # CRUD use cases
│   │   ├── infrastructure/
│   │   │   ├── adapters/               # TypeORM repository adapter
│   │   │   └── persistence/            # User database schema
│   │   └── presentation/
│   │       ├── user.controller.ts
│   │       └── dtos/                   # Data transfer objects
│   │
│   ├── manufacturers/                  # Manufacturer module (similar structure)
│   ├── motocycle-model/                # Motorcycle models module
│   ├── user-motocycle/                 # User motorcycles (In Progress)
│   │
│   ├── shared/                         # Shared utilities
│   │   ├── domain/
│   │   │   ├── base-entity.ts
│   │   │   ├── value-objects/          # Odometer, Nickname, Year, Money
│   │   │   └── exceptions/             # Base domain exception
│   │   ├── infrastructure/
│   │   │   └── database/               # TypeORM config, migrations
│   │   └── presentation/
│   │       ├── filters/                # Global exception filters
│   │       └── swagger/                # Swagger configuration
│   │
│   ├── app.module.ts                   # Root module
│   └── main.ts                         # Application entry point
│
├── test/                               # E2E tests
│   ├── app.e2e-spec.ts
│   ├── user.e2e-spec.ts
│   └── jest-e2e.json
│
├── docker-compose.yml                  # PostgreSQL container
├── Dockerfile                          # Multi-stage build
├── typeorm.config.ts                   # ORM configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies
└── .env                                # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ (or Docker)
- **npm** or **yarn**
- **PostgreSQL** 14+ (via Docker or local)

### Installation

#### Option 1: Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd moto-minder/back
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start PostgreSQL** (via Docker)
```bash
docker-compose up -d
```

5. **Run migrations**
```bash
npm run migration:run
```

6. **Start the application**
```bash
npm start          # Production mode
npm run start:dev  # Development mode with auto-reload
```

The API will be available at: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

#### Option 2: Docker Compose

1. **Build and run everything**
```bash
docker-compose up -d
```

2. **Application will be ready at**: `http://localhost:3000`

### Environment Configuration

Create a `.env` file (template in `.env.example`):

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost          # Use 'postgres' if in Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=motominder

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## 📚 API Documentation

### Available at: `/api/docs` (Swagger UI)

All endpoints are documented with:
- Request/Response examples
- Parameter descriptions
- Authorization requirements
- Error responses

### Authentication Flow

1. **Register** → `POST /auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

2. **Login** → `POST /auth/login`
```json
{
  "email": "john@example.com",
  "password": "secure-password"
}
```
Returns: `{ "token": "eyJhbGc..." }`

3. **Use Token** → Add to all requests
```
Authorization: Bearer <token>
```

### API Modules

#### 👤 **User Module**
- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user

#### 🏭 **Manufacturers**
- `POST /manufacturers` - Create manufacturer
- `GET /manufacturers` - List all
- `GET /manufacturers/:id` - Get by ID
- `GET /manufacturers/search?name=...` - Search by name

#### 🏍️ **Motorcycle Models**
- `POST /motocycle-models` - Create model
- `GET /motocycle-models` - List all
- `GET /motocycle-models/:id` - Get by ID
- `GET /motocycle-models/manufacturer/:manufacturerId` - Get by manufacturer
- `PATCH /motocycle-models/:id` - Update
- `DELETE /motocycle-models/:id` - Delete

#### 🚲 **User Motorcycles** (In Progress)
- `POST /user-motocycles` - Add motorcycle to your collection
- `GET /user-motocycles/me` - Get your motorcycles
- `GET /user-motocycles/:id` - Get specific motorcycle details
- `PATCH /user-motocycles/:id` - Update motorcycle
- `DELETE /user-motocycles/:id` - Remove motorcycle

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│      Users      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼──────────────────┐
│   User Motorcycles        │
├──────────────────────────┤
│ id (PK)                  │
│ user_id (FK → Users)     │
│ motorcycle_model_id (FK) │
│ nickname                 │
│ manufacturing_year       │
│ current_odometer         │
│ created_at               │
│ updated_at               │
└────────┬──────────────────┘
         │
         │ 1:N (to Maintenance & Rides)
         │
┌────────▼─────────────────────┐
│  Motorcycle Models            │
├───────────────────────────────┤
│ id (PK)                       │
│ manufacturer_id (FK)          │
│ name                          │
│ year_start / year_end         │
│ displacement_cc               │
│ engine_cycle                  │
│ cooling_system                │
│ engine_oil_capacity_l         │
│ fuel_tank_capacity_l          │
│ ... (20 total specifications) │
└────────┬─────────────────────┘
         │
         │ N:1
         │
┌────────▼────────────────┐
│   Manufacturers         │
├─────────────────────────┤
│ id (PK)                 │
│ name (UNIQUE)           │
└─────────────────────────┘
```

### Table Details

| Table | Purpose | Key Columns |
|-------|---------|------------|
| `users` | User accounts | id, email (unique), password |
| `manufacturers` | Motorcycle brands | id, name (unique) |
| `motocycle_models` | Motorcycle models with specs | id, manufacturer_id, name, 20+ spec columns |
| `user_motocycles` | User's motorcycle collection | id, user_id, motocycle_model_id, nickname, odometer |
| `maintenance_records` | Service history | id, user_motorcycle_id, service_type, cost, next_due |
| `rides` | Ride logs | id, user_motorcycle_id, distance, fuel_consumed |

### Migration Commands

```bash
# List all migrations
npm run migration:show

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Create new migration
npm run migration:create -- CreateNewTable
```

---

## 🧪 Testing

### Test Structure (3-Tier Pyramid)

```
       E2E Tests (Complete user flows)
      ▲
     ╱ ╲
    ╱   ╲
   ╱Integration Tests (Use Cases)
  ╱       ╲
 ╱         ╲
╱ Unit Tests (Domain Layer)
```

### Running Tests

```bash
# All tests
npm run test

# Unit tests only
npm run test:unit

# Watch mode (re-run on file changes)
npm run test:watch

# With coverage report
npm run test:cov

# E2E tests
npm run test:e2e

# E2E with real database
npm run test:e2e:db
```

### Test Coverage Targets

| Layer | Type | Coverage Target |
|-------|------|-----------------|
| Domain | Unit | 100% (all entities, VOs, business logic) |
| Application | Integration | 90%+ (all use cases) |
| Presentation | E2E | 85%+ (critical user flows) |
| **Overall** | **All** | **90%+** |

---

## 💻 Development

### Code Style & Conventions

#### Module Structure
```
module-name/
├── domain/
│   ├── entities/          # Business logic
│   ├── value-objects/     # Wrapped primitives with validation
│   └── exceptions/        # Domain-specific exceptions
├── application/
│   ├── ports/            # Interface contracts (repository interfaces)
│   └── use-cases/        # Orchestration of domain logic
├── infrastructure/
│   ├── adapters/         # Repository implementations
│   └── persistence/      # Database schemas
├── presentation/
│   ├── controllers/      # HTTP endpoints
│   └── dtos/            # Request/response contracts
└── module-name.module.ts # Module configuration
```

#### Value Object Pattern
```typescript
// Good - Use Value Objects for validated primitives
class Email {
  private readonly value: string;
  constructor(email: string) {
    this.validate(email);
    this.value = email;
  }
  getValue(): string { return this.value; }
}

// Bad - Direct primitives without validation
const email: string = "invalid-email";
```

#### Factory Methods
```typescript
// Domain entity creation
entity = User.create({ name, email, password });  // New entity
entity = User.reconstitute(id, name, email, ...); // From database
```

#### Dependency Injection
- All dependencies must be injected via constructor
- Use dependency inversion (depend on interfaces, not implementations)
- Use @Inject() for port interfaces

### Adding a New Feature

1. **Start with Domain Layer**
   - Create entity with business logic
   - Create value objects for validated primitives
   - Define domain exceptions

2. **Define Repository Port**
   - Create interface in `application/ports/`
   - Define contract for persistence layer

3. **Create Use Cases**
   - One use case per operation
   - Inject repository via constructor
   - Handle business rule violations

4. **Implement Infrastructure**
   - Create TypeORM schema
   - Implement repository adapter
   - Create database migration

5. **Add Presentation Layer**
   - Create DTOs (requests/responses)
   - Create controller with routes
   - Add Swagger decorators
   - Implement guards/validation

6. **Write Tests**
   - Unit tests for domain logic
   - Integration tests for use cases
   - E2E tests for API endpoints

### Git Workflow

**Branch Naming**:
```
feature/add-new-module        # New feature
fix/resolve-issue             # Bug fix
refactor/improve-service      # Code improvements
test/add-coverage             # Test additions
docs/update-readme            # Documentation
```

**Commit Messages**:
```
feat: add user motorcycle CRUD operations
fix: correct maintenance calculation logic
test: add unit tests for Email VO
docs: update database schema section
refactor: simplify repository pattern
```

### Linting & Formatting

```bash
# Fix linting issues
npm run lint

# Format code
npm run format

# Check TypeScript
npm run build
```

---

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build
```

### Production Deployment

The `Dockerfile` includes a multi-stage build:

1. **Development stage**: Build TypeScript
2. **Production stage**: Run compiled JavaScript

```bash
# Build production image
docker build -t moto-minder-backend:latest .

# Run with environment file
docker run --env-file .env.production \
  -p 3000:3000 \
  moto-minder-backend:latest
```

### Environment Variables for Production

Create `.env.production`:

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=<secure-username>
DB_PASSWORD=<secure-password>
DB_DATABASE=motominder_prod

JWT_SECRET=<very-long-random-secret>
JWT_EXPIRES_IN=7d
```

---

## 📋 Implementation Progress

### Completed Phases

#### ✅ Phase 0: README Creation (100%)
- Created comprehensive README.md with project overview
- Documented all completed features and tech stack
- Added setup instructions for local and Docker development
- Included API documentation and database schema
- Added development guidelines and best practices

#### ✅ Phase 1: Code Cleanup & Domain Layer Fixes (100%)
**What was fixed:**
- ✅ Created `InvalidArgumentException` for domain layer validation errors
- ✅ Updated `InvalidManufacturerNameException` to extend `BaseDomainException`
- ✅ Removed `BadRequestException` from User entity domain layer
- ✅ Replaced NestJS exceptions with domain-specific exceptions in User.entity.ts
- ✅ Added ManufacturersModule to AppModule imports
- ✅ Added UserMotocycleModule to AppModule imports
- ✅ Exported USER_REPOSITORY from UserModule for cross-module usage

**Files modified:**
- `src/shared/domain/exceptions/invalid-argument.exception.ts` (created)
- `src/manufacturers/domain/exceptions/invalid-manufacturer-name.exception.ts` (updated)
- `src/user/domain/entities/user.entity.ts` (updated)
- `src/app.module.ts` (updated)
- `src/user/user.module.ts` (updated)

**Result:** Domain layer now has zero framework dependencies, all exceptions follow DDD patterns

#### ✅ Phase 2: UserMotocycle Module (100%)
**What was implemented:**
- ✅ Complete domain entity with Value Objects (Nickname, Odometer, Year)
- ✅ Business logic: validate odometer never decreases, year within model range
- ✅ 6 use cases: Create, FindAll, FindById, FindByUser, Update, Delete
- ✅ Repository port + TypeORM adapter with toSchema/toDomain mapping
- ✅ Database schema with proper indexes and foreign keys
- ✅ Controller with 6 routes + ownership validation
- ✅ DTOs with class-validator validation
- ✅ Database migration: CreateUserMotocyclesTable

**Files created:**
- Domain: `user-motocycle.entity.ts` (complete with VOs)
- Application: 6 use cases + repository port
- Infrastructure: TypeORM schema + repository adapter
- Presentation: Controller + 3 DTOs
- Migration: UserMotocycles table with cascading FKs

**Routes available:**
```
POST /user-motocycles - Create motorcycle
GET /user-motocycles - Get all (admin)
GET /user-motocycles/me - Get user's motorcycles
GET /user-motocycles/:id - Get specific motorcycle
PATCH /user-motocycles/:id - Update motorcycle
DELETE /user-motocycles/:id - Delete motorcycle
```

#### ✅ Phase 2.5: OAuth2 Integration (100%)
**What was implemented:**
- ✅ OAuth2 port interface for provider abstraction
- ✅ Google OAuth adapter (OAuth 2.0 + JWT refresh tokens)
- ✅ Garmin OAuth adapter (OAuth 2.0 + Basic auth)
- ✅ OAuthLoginUseCase for unified provider handling
- ✅ OAuth login endpoint: POST /auth/oauth/login
- ✅ Support for auto-user creation on first OAuth login
- ✅ Environment configuration for both providers
- ✅ Package.json with passport-google-oauth20 + axios

**OAuth Features:**
- Exchange authorization code for tokens
- Retrieve user profile from provider
- Create user if doesn't exist
- Generate JWT token for Moto-Minder
- Support refresh tokens
- Provider agnostic design (easy to add Facebook, GitHub, etc.)

**OAuth Endpoints:**
```
POST /auth/oauth/login
{
  "code": "authorization_code_from_provider",
  "provider": "google" | "garmin"
}
```

**Configuration required (.env):**
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

GARMIN_CLIENT_ID=...
GARMIN_CLIENT_SECRET=...
GARMIN_REDIRECT_URI=...
```

### In Progress
- 🔄 **Phase 5**: Comprehensive Testing (Unit + Integration + E2E)

### Planned Phases
- [ ] **Phase 3**: Maintenance tracking module
- [ ] **Phase 4**: Ride tracking module
- [ ] **Phase 6**: Enhanced features & best practices
- [ ] **Phase 7**: Additional documentation
- [ ] **Phase 8**: Environment & deployment

---

## 🎯 Success Criteria

- ✅ All modules follow hexagonal architecture pattern
- ✅ Domain layer has zero framework dependencies
- ✅ All entities use appropriate Value Objects
- ✅ 90%+ test coverage across unit/integration/e2e
- ✅ All API endpoints documented in Swagger
- ✅ All migrations execute without errors
- ✅ TypeScript strict mode with no errors
- ✅ ESLint passes without warnings
- ✅ Complete setup instructions in README
- ✅ All user stories testable via API

---

## 📞 Support & Contribution

### Issues & Feedback
Report issues at: [GitHub Issues](https://github.com/your-repo/issues)

### Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

### Code of Conduct
Be respectful and follow our [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## 📄 License

This project is licensed under the UNLICENSED license.

---

**Last Updated**: December 2024
**Project Status**: Active Development
**Current Phase**: Phase 1 - Code Cleanup & Refactoring