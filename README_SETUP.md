# Moto-Minder Backend - Setup & Configuration Guide

## Project Overview

Moto-Minder is a comprehensive motorcycle maintenance tracking and management system built with NestJS, TypeORM, and PostgreSQL. The system tracks motorcycle parts, maintenance records, rides, and automatically calculates part wear to notify users when maintenance is needed.

**Architecture**: Hexagonal (Ports & Adapters) with Domain-Driven Design

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: Latest version
- **IDE**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - REST Client (optional, for API testing)

Verify installations:
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
psql --version    # Should be v14+
git --version
```

---

## Project Structure (Hexagonal Architecture)

The project follows hexagonal architecture with clear separation of concerns:

```
src/
├── shared/                          # Cross-cutting concerns
│   ├── domain/
│   │   ├── exceptions/              # Base exception classes
│   │   ├── events/                  # Domain events
│   │   └── value-objects/           # Shared value objects
│   ├── application/
│   │   └── ports/                   # Shared port interfaces
│   ├── infrastructure/
│   │   └── database/                # Database configuration & migrations
│   └── presentation/
│       ├── filters/                 # Global exception filters
│       ├── guards/                  # JWT & auth guards
│       └── swagger/                 # Swagger configuration
│
├── [feature-module]/                # Feature-specific modules (User, Ride, MaintenancePart, etc.)
│   ├── domain/
│   │   ├── entities/                # Business entities
│   │   ├── exceptions/              # Domain exceptions
│   │   ├── events/                  # Domain events
│   │   └── value-objects/           # Feature-specific value objects
│   ├── application/
│   │   ├── use-cases/               # Business logic
│   │   ├── ports/                   # Repository interfaces
│   │   └── listeners/               # Event handlers
│   ├── infrastructure/
│   │   ├── persistence/             # TypeORM schemas & repositories
│   │   └── adapters/                # External service adapters
│   ├── presentation/
│   │   ├── controllers/             # REST API endpoints
│   │   └── dtos/                    # Request/Response DTOs
│   └── [feature].module.ts          # Feature module declaration
│
├── app.module.ts                    # Root module
└── main.ts                          # Application entry point
```

Each feature module independently implements:
- **Domain Layer**: Business rules & entities (no framework dependencies)
- **Application Layer**: Use cases & port definitions (NestJS independent)
- **Infrastructure Layer**: Implementations of ports (TypeORM, external APIs)
- **Presentation Layer**: REST controllers & data transfer objects

---

## Step 1: Environment Configuration

### 1.1 Create `.env` file

In the project root directory, create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password_here
DATABASE_NAME=moto_minder
DATABASE_LOGGING=true
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_chars
JWT_EXPIRATION=24h

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@motominder.com
SENDGRID_FROM_NAME=Moto-Minder

# Strava OAuth Integration
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_CALLBACK_URL=http://localhost:3000/auth/callback/strava

# Google OAuth Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/callback/google

# Garmin OAuth Integration (optional)
GARMIN_CLIENT_ID=your_garmin_client_id
GARMIN_CLIENT_SECRET=your_garmin_client_secret
GARMIN_CALLBACK_URL=http://localhost:3000/auth/callback/garmin

# Application
PORT=3000
APP_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=debug
```

### 1.2 Environment Variable Descriptions

#### Database Variables
- `DATABASE_HOST`: PostgreSQL server hostname (default: localhost)
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_USERNAME`: PostgreSQL user (create a dedicated user for safety)
- `DATABASE_PASSWORD`: PostgreSQL password (use a strong, secure password)
- `DATABASE_NAME`: Database name for Moto-Minder
- `DATABASE_LOGGING`: Enable SQL query logging in development (true/false)
- `NODE_ENV`: Environment mode (development, production, test)

#### Authentication Variables
- `JWT_SECRET`: 32+ character secret for signing JWTs (generate with: `openssl rand -base64 32`)
- `JWT_EXPIRATION`: Token expiration time (e.g., 24h, 7d)

#### Email Service (SendGrid)
- `SENDGRID_API_KEY`: Obtain from https://sendgrid.com/
- `SENDGRID_FROM_EMAIL`: Sender email address (must be verified in SendGrid)
- `SENDGRID_FROM_NAME`: Display name for emails

#### OAuth Providers
- Obtain credentials from respective provider dashboards:
  - **Strava**: https://www.strava.com/settings/api
  - **Google**: https://console.cloud.google.com/
  - **Garmin**: https://developer.garmin.com/

#### Application Variables
- `PORT`: Application port (default: 3000)
- `APP_URL`: Full application URL for callbacks
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins
- `LOG_LEVEL`: Logging verbosity (debug, log, warn, error)

---

## Step 2: PostgreSQL Database Setup

### 2.1 Create PostgreSQL User and Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# In PostgreSQL CLI:
-- Create a dedicated database user
CREATE USER moto_minder WITH PASSWORD 'your_secure_password_here';

-- Create the database
CREATE DATABASE moto_minder OWNER moto_minder;

-- Grant privileges
GRANT CONNECT ON DATABASE moto_minder TO moto_minder;
GRANT USAGE ON SCHEMA public TO moto_minder;
GRANT CREATE ON SCHEMA public TO moto_minder;

-- Exit
\q
```

### 2.2 Verify Database Connection

```bash
psql -U moto_minder -d moto_minder -h localhost
```

You should see the PostgreSQL prompt if the connection is successful.

---

## Step 3: Project Setup

### 3.1 Clone and Install Dependencies

```bash
# Clone repository (if not already done)
git clone <repository-url>
cd moto-minder/back

# Install dependencies
npm install

# Verify installation
npm list
```

### 3.2 Run Database Migrations

Migrations automatically create all required tables and indexes:

```bash
# Run all pending migrations
npm run typeorm migration:run -- -d src/shared/infrastructure/database/database.ts

# Verify migrations (list all executed migrations)
npm run typeorm migration:show -- -d src/shared/infrastructure/database/database.ts
```

**What migrations do**:
- Create all database tables (users, rides, motorcycle_parts, notifications, etc.)
- Add foreign key constraints between related tables
- Create indexes on frequently queried columns for performance
- Ensure referential integrity

### 3.3 Verify Database Schema

```bash
# Connect to your database and verify tables exist
psql -U moto_minder -d moto_minder

# In PostgreSQL CLI:
\dt                    # List all tables
\di                    # List all indexes
SELECT * FROM information_schema.tables WHERE table_schema='public';
\q
```

---

## Step 4: Running the Application

### 4.1 Development Mode

```bash
# Start the application in development mode with auto-reload
npm run start:dev

# Output should show:
# [Nest] ... LOG [NestFactory] Starting Nest application...
# [Nest] ... LOG Application is running on: http://localhost:3000
# [Nest] ... LOG Swagger docs available at: http://localhost:3000/api/docs
```

### 4.2 Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### 4.3 Available Commands

```bash
# Testing
npm run test:unit              # Run all unit tests
npm run test:unit -- --watch   # Run tests in watch mode

# Code Quality
npm run lint                   # Run ESLint and fix issues
npm run format                 # Format code with Prettier

# Database
npm run typeorm migration:generate -- -n MigrationName  # Generate new migration
npm run typeorm migration:revert -- -d src/shared/infrastructure/database/database.ts  # Revert last migration

# Building
npm run build                  # Build for production
npm run build:debug            # Build with debug info
```

---

## Step 5: API Documentation

### 5.1 Access Swagger UI

Once the application is running, open your browser and navigate to:

```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- **Interactive API exploration**: Try requests directly from the browser
- **Schema documentation**: Request/response structures for all endpoints
- **Authentication**: Test endpoints with JWT tokens
- **Example values**: See sample request bodies

### 5.2 Swagger Organization

The API is organized by feature areas:

#### Authentication Endpoints
- **POST** `/auth/register` - Create a new user account
- **POST** `/auth/login` - Login and receive JWT token
- **POST** `/auth/oauth-login` - Login via OAuth provider (Google, Garmin, Strava)

#### User Management
- **GET** `/users/{id}` - Get user profile
- **PATCH** `/users/{id}` - Update user information

#### Motorcycle Management
- **POST** `/user-motocycles` - Add a new motorcycle to user account
- **GET** `/user-motocycles/me` - List user's motorcycles
- **GET** `/user-motocycles/{id}` - Get specific motorcycle details
- **PATCH** `/user-motocycles/{id}` - Update motorcycle information
- **DELETE** `/user-motocycles/{id}` - Remove motorcycle

#### Ride Tracking
- **POST** `/rides` - Start a new ride
- **GET** `/rides/{id}` - Get ride details
- **POST** `/rides/{id}/complete` - Mark ride as completed
- **POST** `/rides/{id}/cancel` - Cancel an active ride
- **PATCH** `/rides/{id}/notes` - Update ride notes
- **GET** `/rides/motorcycle/{userMotocycleId}` - List rides for a motorcycle
- **GET** `/rides/motorcycle/{userMotocycleId}/statistics` - Get ride statistics
- **DELETE** `/rides/{id}` - Delete a ride
- **POST** `/rides/import/strava` - Import rides from Strava

#### Motorcycle Parts Management
- **POST** `/motorcycle-parts` - Install a new part on motorcycle
- **GET** `/motorcycle-parts/motorcycle/{userMotocycleId}` - List parts for a motorcycle
- **PATCH** `/motorcycle-parts/{id}` - Update part details
- **POST** `/motorcycle-parts/{id}/replace` - Mark part as replaced and install new one
- **DELETE** `/motorcycle-parts/{id}` - Remove a part

#### Part Wear & Maintenance
- **GET** `/part-wear/{id}` - Get wear status for a specific part
- **GET** `/part-wear/motorcycle/{userMotocycleId}` - List wear status for all parts
- **POST** `/part-wear/{id}/calculate` - Manually trigger wear calculation
- **GET** `/part-wear/motorcycle/{userMotocycleId}/due` - List parts due for maintenance

#### Maintenance Records
- **POST** `/maintenance` - Record a maintenance service
- **GET** `/maintenance/motorcycle/{userMotocycleId}` - View maintenance history
- **PATCH** `/maintenance/{id}` - Update maintenance record
- **DELETE** `/maintenance/{id}` - Delete maintenance record
- **GET** `/maintenance/motorcycle/{userMotocycleId}/upcoming` - List upcoming maintenance

#### Notifications
- **GET** `/notifications` - List user's notifications
- **GET** `/notifications/{id}` - Get notification details

---

## Step 6: Testing the API

### 6.1 Using REST Client Extension (VS Code)

Create a `requests.http` file in the project root:

```http
### Register a new user
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "John Motorcycle",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

### Add a motorcycle (replace {token} with actual JWT token)
POST http://localhost:3000/user-motocycles
Content-Type: application/json
Authorization: Bearer {token}

{
  "motocycleModelId": "model-uuid-here",
  "nickname": "My Harley",
  "manufacturingYear": 2020,
  "currentOdometer": 15000
}

### Start a ride
POST http://localhost:3000/rides
Content-Type: application/json
Authorization: Bearer {token}

{
  "userMotocycleId": "motorcycle-uuid-here",
  "startDate": "2024-12-13T10:00:00Z",
  "startOdometer": 15000
}
```

### 6.2 Using cURL

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'

# Get user profile (with token)
curl -X GET http://localhost:3000/users/user-id \
  -H "Authorization: Bearer your_jwt_token_here"
```

### 6.3 Running Unit Tests

```bash
# Run all tests
npm run test:unit

# Run specific test file
npm run test:unit -- complete-ride.use-case.spec.ts

# Run tests with coverage
npm run test:unit -- --coverage

# Watch mode (re-run on file changes)
npm run test:unit -- --watch
```

Expected output: `532 passed, 31 test suites`

---

## Step 7: Code Quality & Linting

### 7.1 ESLint

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint

# The linter will report:
# - Unused variables
# - Type safety issues
# - Code style violations
# - Import sorting
```

### 7.2 Code Style

The project uses Prettier for code formatting:

```bash
# Format all files (run automatically with npm run lint)
npx prettier --write "src/**/*.ts"
```

### 7.3 Type Safety

The project uses strict TypeScript settings:

```bash
# Check types
npm run build

# This verifies:
# - No implicit `any` types
# - All function parameters typed
# - Return types specified
# - No type errors
```

---

## Step 8: Monitoring & Debugging

### 8.1 Application Logs

Logs appear in the console during development:

```
[Nest] 12345  - 12/13/2025, 10:15:30 AM    LOG [LoginUseCase] Login attempt for email: user@example.com
[Nest] 12345  - 12/13/2025, 10:15:31 AM    LOG [LoginUseCase] Login successful for user: user-id-123
[Nest] 12345  - 12/13/2025, 10:15:32 AM    LOG [StartRideUseCase] Starting ride for motorcycle: moto-id-456, odometer: 15000
```

### 8.2 Database Logging

Set `DATABASE_LOGGING=true` in `.env` to see SQL queries:

```sql
SELECT "User"."id", "User"."name", "User"."email" FROM "users" "User" WHERE "User"."id" = $1
```

### 8.3 Debugging with VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Moto-Minder",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/main.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

Then press F5 to start debugging.

---

## Step 9: Deployment Preparation

### 9.1 Build for Production

```bash
# Build the application
npm run build

# Output should be in `dist/` directory
# Build time: ~5-10 seconds
# Build size: ~2-3 MB
```

### 9.2 Environment Variables for Production

Update `.env` with production values:

```env
NODE_ENV=production
JWT_EXPIRATION=168h
DATABASE_LOGGING=false
LOG_LEVEL=warn
PORT=3000
```

### 9.3 Security Checklist

- [ ] JWT_SECRET is at least 32 random characters
- [ ] DATABASE_PASSWORD is strong (16+ characters, mixed case, numbers, symbols)
- [ ] SENDGRID_API_KEY is from a restricted API key (not master key)
- [ ] OAuth credentials are for correct environment (production URLs)
- [ ] CORS_ORIGINS only includes your frontend domains
- [ ] DATABASE_LOGGING is false in production
- [ ] All environment variables are set on production server

---

## Troubleshooting

### Issue: "Cannot connect to PostgreSQL"

```bash
# Check PostgreSQL is running
psql -U postgres -l

# Verify DATABASE_HOST and DATABASE_PORT in .env
# Try with explicit connection:
psql -h localhost -U moto_minder -d moto_minder
```

### Issue: "JWT_SECRET not found"

```bash
# Ensure .env file exists in project root
ls -la .env

# Add the missing variable to .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Issue: "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist
npm run build
```

### Issue: "Database migration failed"

```bash
# Check migration status
npm run typeorm migration:show -- -d src/shared/infrastructure/database/database.ts

# Revert last migration if needed
npm run typeorm migration:revert -- -d src/shared/infrastructure/database/database.ts

# Then re-run
npm run typeorm migration:run -- -d src/shared/infrastructure/database/database.ts
```

### Issue: Tests failing

```bash
# Clear Jest cache
npm run test:unit -- --clearCache

# Run with verbose output
npm run test:unit -- --verbose

# Run specific test
npm run test:unit -- complete-ride.use-case.spec.ts
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | NestJS | 11.0+ |
| **Language** | TypeScript | 5.0+ |
| **Database** | PostgreSQL | 14+ |
| **ORM** | TypeORM | 0.3.27+ |
| **Testing** | Jest | Latest |
| **Validation** | class-validator | Latest |
| **Email** | SendGrid | Latest |
| **Authentication** | JWT (jsonwebtoken) | Latest |
| **API Docs** | Swagger (OpenAPI) | Latest |
| **Code Quality** | ESLint, Prettier | Latest |

---

## Project Statistics

- **Lines of Code**: ~8,000
- **Test Coverage**: 100+ test cases across 31 test suites
- **Database Tables**: 9 with proper indexing
- **API Endpoints**: 40+ REST endpoints
- **Domain Exceptions**: 20+ specific exception types
- **Use Cases**: 49 business logic implementations
- **Domain Events**: 2 event types with cascading handlers

---

## Key Features

✅ **Event-Driven Architecture** - Ride completion automatically triggers wear calculation
✅ **OAuth Integration** - Login via Google, Garmin, Strava
✅ **Email Notifications** - Automatic maintenance alerts via SendGrid
✅ **Wear Tracking** - Automatic calculation based on motorcycle odometer
✅ **Part Lifecycle** - Track part installation, usage, and replacement
✅ **Ride Statistics** - Aggregate metrics: total distance, duration, average speed
✅ **Data Validation** - Comprehensive input validation at all API boundaries
✅ **Database Indexes** - Performance optimized with strategic indexes
✅ **Error Handling** - Centralized exception filter with proper HTTP status codes
✅ **Logging** - Structured logging for critical operations
✅ **JWT Authentication** - Secure stateless authentication
✅ **Hexagonal Architecture** - Clean separation of concerns and testability

---

## Support & Documentation

- **Swagger API Docs**: http://localhost:3000/api/docs
- **GitHub Repository**: Link to repository
- **Issues & Questions**: Create an issue on GitHub
- **Code Architecture**: See structure above (hexagonal layers)

---

## Next Steps

1. ✅ Set up environment variables (.env)
2. ✅ Create PostgreSQL database and user
3. ✅ Install dependencies (npm install)
4. ✅ Run migrations
5. ✅ Start development server (npm run start:dev)
6. ✅ Access Swagger: http://localhost:3000/api/docs
7. ✅ Run tests (npm run test:unit)
8. ✅ Deploy to production

---

**Happy Coding! 🏍️**
