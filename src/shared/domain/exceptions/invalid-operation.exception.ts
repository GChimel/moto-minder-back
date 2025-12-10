import { BaseDomainException } from './base-domain.exception';

export class InvalidOperationException extends BaseDomainException {
  constructor(message: string) {
    super(message, 'INVALID_OPERATION');
  }
}
