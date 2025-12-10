import { BaseDomainException } from './base-domain.exception';

export class EntityNotFoundException extends BaseDomainException {
  constructor(entityName: string, identifier: string) {
    super(
      `${entityName} with identifier '${identifier}' not found`,
      'ENTITY_NOT_FOUND',
    );
  }
}
