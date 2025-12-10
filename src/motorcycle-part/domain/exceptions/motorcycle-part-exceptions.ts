import { BaseDomainException } from '../../../shared/domain/exceptions/base-domain.exception';

export class InvalidPartTypeException extends BaseDomainException {
  constructor(partType: string) {
    super(
      `Invalid part type: ${partType}. Valid values are defined in PartType enum`,
      'INVALID_PART_TYPE',
    );
  }
}

export class InvalidPartLifespanException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_PART_LIFESPAN');
  }
}

export class InvalidWearRateException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_WEAR_RATE');
  }
}

export class MotorcyclePartNotFoundException extends BaseDomainException {
  constructor(partId: string) {
    super(
      `Motorcycle part with id ${partId} was not found`,
      'MOTORCYCLE_PART_NOT_FOUND',
    );
  }
}
