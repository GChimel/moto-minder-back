# Authentication Documentation

## Overview

This authentication module implements JWT-based authentication using hexagonal architecture principles.

## Architecture

```
auth/
├── application/
│   ├── ports/
│   │   └── auth-token-generator.port.ts    # Interface for token generation
│   └── use-cases/
│       ├── login.use-case.ts                # Login business logic
│       └── register.use-case.ts             # Registration business logic
├── infrastructure/
│   └── adapters/
│       └── jwt-token-generator.adapter.ts   # JWT implementation
├── presentation/
│   ├── decorators/
│   │   └── get-user.decorator.ts            # Decorator to get authenticated user
│   ├── dtos/
│   │   ├── auth-response.dto.ts
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   └── jwt.guard.ts                     # Guard for protected routes
│   ├── auth.controller.ts                   # HTTP endpoints
│   └── jwt.strategy.ts                      # Passport JWT strategy
└── auth.module.ts
```

## Endpoints

### Register
**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Protecting Routes

### Using the JWT Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt.guard';
import { GetUser } from '../auth/presentation/decorators/get-user.decorator';
import { User } from '../user/domain/entities/user.entity';

@Controller('protected')
export class ProtectedController {

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
    };
  }
}
```