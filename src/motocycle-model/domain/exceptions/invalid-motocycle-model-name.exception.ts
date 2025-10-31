import { BadRequestException } from '@nestjs/common';

export class InvalidMotocycleModelNameException extends BadRequestException {
  constructor() {
    super('Motorcycle model name must be at least 3 characters long');
  }
}
