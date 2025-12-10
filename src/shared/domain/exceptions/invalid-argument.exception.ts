import { BaseDomainException } from './base-domain.exception';

export class InvalidArgumentException extends BaseDomainException {
  constructor(argumentName: string, reason: string) {
    super(`Invalid argument '${argumentName}': ${reason}`, 'INVALID_ARGUMENT');
  }
}
