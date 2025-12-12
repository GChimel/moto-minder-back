import { BaseDomainException } from '../../../shared/domain/exceptions/base-domain.exception';

export class PartWearNotFoundException extends BaseDomainException {
  constructor(partWearId: string) {
    super(
      `Part wear record with ID "${partWearId}" not found`,
      'PART_WEAR_NOT_FOUND',
    );
  }
}

export class MotorcyclePartNotActiveException extends BaseDomainException {
  constructor(partId: string) {
    super(
      `Motorcycle part with ID "${partId}" is not active`,
      'MOTORCYCLE_PART_NOT_ACTIVE',
    );
  }
}

export class InvalidWearCalculationException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_WEAR_CALCULATION');
  }
}

export class WearCalculationFailedException extends BaseDomainException {
  constructor(partWearId: string, reason: string) {
    super(
      `Failed to calculate wear for part "${partWearId}": ${reason}`,
      'WEAR_CALCULATION_FAILED',
    );
  }
}
