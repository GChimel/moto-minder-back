import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseDomainException } from '../../domain/exceptions/base-domain.exception';

// Exception code to HTTP status mapping
const EXCEPTION_CODE_TO_STATUS_MAP: Record<string, number> = {
  // Not Found exceptions
  RIDE_NOT_FOUND: HttpStatus.NOT_FOUND,
  PART_WEAR_NOT_FOUND: HttpStatus.NOT_FOUND,
  MAINTENANCE_RECORD_NOT_FOUND: HttpStatus.NOT_FOUND,
  MOTORCYCLE_PART_NOT_FOUND: HttpStatus.NOT_FOUND,
  USER_MOTOCYCLE_NOT_FOUND: HttpStatus.NOT_FOUND,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,

  // Unprocessable Entity exceptions (invalid state/operations)
  INVALID_RIDE_STATE: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_PART_TYPE: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_PART_LIFESPAN: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_WEAR_RATE: HttpStatus.UNPROCESSABLE_ENTITY,
  MOTORCYCLE_PART_NOT_ACTIVE: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_WEAR_CALCULATION: HttpStatus.UNPROCESSABLE_ENTITY,
  WEAR_CALCULATION_FAILED: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_SERVICE_TYPE: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_ODOMETER: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_NOTIFICATION_STATE: HttpStatus.UNPROCESSABLE_ENTITY,

  // Bad Request exceptions (validation/input errors)
  INVALID_EMAIL: HttpStatus.BAD_REQUEST,
  NOTIFICATION_SEND_FAILED: HttpStatus.BAD_REQUEST,
};

/**
 * Exception filter for domain exceptions
 * Catches all BaseDomainException instances and maps them to appropriate HTTP status codes
 * Eliminates the need for repeated try-catch blocks in controllers
 */
@Catch(BaseDomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: BaseDomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get status code from mapping, default to BAD_REQUEST
    const status =
      EXCEPTION_CODE_TO_STATUS_MAP[exception.code] ?? HttpStatus.BAD_REQUEST;

    // Log exception in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Domain Exception caught:', {
        code: exception.code,
        message: exception.message,
        timestamp: exception.timestamp,
      });
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      code: exception.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception.stack,
      }),
    };

    response.status(status).json(errorResponse);
  }
}
