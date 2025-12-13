import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger/OpenAPI Configuration
 *
 * Organized following Hexagonal Architecture:
 * - Presentation Layer: Controllers handle HTTP requests/responses
 * - Application Layer: Use cases implement business logic
 * - Domain Layer: Entities and value objects define core business rules
 * - Infrastructure Layer: Adapters implement external integrations
 *
 * API is structured around domain-driven feature modules, each implementing:
 * - REST endpoints (Presentation)
 * - Business operations (Application)
 * - Core rules (Domain)
 * - External integrations (Infrastructure)
 */

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Moto-Minder API - Motorcycle Maintenance Tracking System')
  .setDescription(
    `
    # Moto-Minder Backend API

    Complete motorcycle maintenance tracking and management system with:
    - **Ride Tracking**: Log every ride with distance, duration, and fuel consumption
    - **Part Wear Calculation**: Automatic wear tracking with maintenance alerts
    - **Maintenance Planning**: Track service history and predict upcoming maintenance
    - **OAuth Integration**: Connect with Strava, Garmin, and Google for ride/health data
    - **Smart Notifications**: Email alerts when parts need service
    - **Event-Driven Architecture**: Automatic cascading of maintenance alerts

    ## Architecture Overview

    Built with **Hexagonal Architecture (Ports & Adapters)** for maximum flexibility:

    - **Presentation Layer**: REST Controllers with input validation and error handling
    - **Application Layer**: Use Cases implementing business logic independently
    - **Domain Layer**: Core business rules with no framework dependencies
    - **Infrastructure Layer**: Database, OAuth, Email adapters

    Each feature module (User, Ride, MaintenancePart, etc.) independently implements all layers.

    ## Authentication

    All protected endpoints require JWT bearer token in Authorization header:
    \`\`\`
    Authorization: Bearer <your_jwt_token>
    \`\`\`

    Obtain tokens via:
    - **POST /auth/register** - Create account
    - **POST /auth/login** - Login with email/password
    - **POST /auth/oauth-login** - Login via OAuth provider
    `,
  )
  .setVersion('1.0.0')
  .setContact(
    'Moto-Minder Development',
    'https://github.com/chimel/moto-minder',
    'support@motominder.com',
  )
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer('http://localhost:3000', 'Development Server')
  .addServer('https://api.motominder.com', 'Production Server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description:
        'Enter JWT token obtained from /auth/login or /auth/oauth-login',
      in: 'header',
    },
    'JWT-auth',
  )

  // ====================
  // CORE FUNCTIONALITY
  // ====================
  .addTag(
    'auth',
    'User Authentication - Register, login, and OAuth integration for Strava, Garmin, and Google',
  )
  .addTag(
    'users',
    'User Profile Management - View and update user account information',
  )

  // ====================
  // MOTORCYCLE MANAGEMENT
  // ====================
  .addTag(
    'user-motorcycles',
    'Motorcycle Garage - Add, view, and manage motorcycles in user collection',
  )
  .addTag(
    'manufacturers',
    'Manufacturer Reference Data - Browse motorcycle manufacturers (read-only)',
  )
  .addTag(
    'motorcycle-models',
    'Motorcycle Models - View specifications and details of motorcycle models',
  )

  // ====================
  // RIDE TRACKING & ANALYTICS
  // ====================
  .addTag(
    'rides',
    'Ride Management - Start, complete, and track motorcycle rides with distance/duration metrics',
  )

  // ====================
  // PARTS & MAINTENANCE
  // ====================
  .addTag(
    'motorcycle-parts',
    'Motorcycle Parts - Install, update, and replace individual motorcycle parts',
  )
  .addTag(
    'part-wear',
    'Part Wear Status - Track wear percentage and maintenance due status for parts',
  )
  .addTag(
    'maintenance',
    'Maintenance Records - Log service history and predict upcoming maintenance needs',
  )

  // ====================
  // NOTIFICATIONS & ALERTS
  // ====================
  .addTag(
    'notifications',
    'Notifications - Maintenance alerts and system notifications sent to user email',
  )

  .build();
