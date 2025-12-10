import { BaseDomainException } from '../../../shared/domain/exceptions/base-domain.exception';

export class InvalidManufacturerNameException extends BaseDomainException {
  constructor(
    message: string = 'Name is required and must be at least 2 characters long',
  ) {
    super(message, 'INVALID_MANUFACTURER_NAME');
  }
}
