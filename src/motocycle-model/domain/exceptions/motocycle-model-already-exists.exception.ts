import { ConflictException } from '@nestjs/common';

export class MotocycleModelAlreadyExistsException extends ConflictException {
  constructor(name: string, manufacturerId: string) {
    super(
      `Motorcycle model '${name}' already exists for manufacturer ${manufacturerId}`,
    );
  }
}
