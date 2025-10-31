import { NotFoundException } from '@nestjs/common';

export class MotocycleModelNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Motorcycle model with id ${id} not found`);
  }
}
