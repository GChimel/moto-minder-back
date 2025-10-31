import { BadRequestException } from '@nestjs/common';

export class InvalidEngineCycleException extends BadRequestException {
  constructor(value: string) {
    super(
      `Invalid engine cycle: ${value}. Valid values are: 2-STROKE, 4-STROKE`,
    );
  }
}
