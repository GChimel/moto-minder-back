import { BadRequestException } from '@nestjs/common';

export class InvalidCoolingSystemException extends BadRequestException {
  constructor(value: string) {
    super(
      `Invalid cooling system: ${value}. Valid values are: AIR, LIQUID, LIQUID_AND_AIR`,
    );
  }
}
