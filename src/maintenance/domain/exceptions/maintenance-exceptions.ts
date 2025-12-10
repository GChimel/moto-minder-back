import { BaseDomainException } from '../../../shared/domain/exceptions/base-domain.exception';

export class InvalidServiceTypeException extends BaseDomainException {
  constructor(serviceType: string) {
    super(
      `Invalid service type: ${serviceType}. Valid values are defined in ServiceType enum`,
      'INVALID_SERVICE_TYPE',
    );
  }
}

export class MaintenanceRecordNotFoundException extends BaseDomainException {
  constructor(recordId: string) {
    super(
      `Maintenance record with id ${recordId} was not found`,
      'MAINTENANCE_RECORD_NOT_FOUND',
    );
  }
}

export class InvalidOdometerException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_ODOMETER');
  }
}
