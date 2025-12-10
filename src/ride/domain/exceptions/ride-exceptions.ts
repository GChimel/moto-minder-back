import { BaseDomainException } from '../../../shared/domain/exceptions/base-domain.exception';

export class RideNotFoundException extends BaseDomainException {
  constructor(rideId: string) {
    super(`Ride with id ${rideId} was not found`, 'RIDE_NOT_FOUND');
  }
}

export class InvalidRideStateException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_RIDE_STATE');
  }
}

export class InvalidOdometerRangeException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_ODOMETER_RANGE');
  }
}
