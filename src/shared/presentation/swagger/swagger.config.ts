import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Moto Minder API')
  .setDescription(
    'Motorcycle maintenance tracking system with ride logging and maintenance predictions',
  )
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management')
  .addTag('manufacturers', 'Motorcycle manufacturers')
  .addTag('motorcycle-models', 'Motorcycle model specifications')
  .addTag('user-motorcycles', 'User garage - owned motorcycles')
  .addTag('service-types', 'Maintenance service catalog')
  .addTag('activity-types', 'Riding activity types with wear factors')
  .addTag('maintenance-log', 'Maintenance history and tracking')
  .addTag('riding-log', 'Ride sessions and statistics')
  .addTag('user-connections', 'OAuth integrations (Garmin/Strava)')
  .addTag('integrations', 'External API integrations')
  .addTag('analytics', 'Statistics and analytics')
  .addTag('health', 'Health check endpoints')
  .build();
