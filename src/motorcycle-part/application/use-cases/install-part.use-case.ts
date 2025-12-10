import { Injectable, Inject } from '@nestjs/common';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';
import { CreateMotorcyclePartDto } from '../../domain/entities/motorcycle-part.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class InstallPartUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(dto: CreateMotorcyclePartDto): Promise<MotorcyclePart> {
    if (!dto.userMotocycleId || dto.userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    if (dto.installationOdometer < 0) {
      throw new InvalidArgumentException(
        'installationOdometer',
        'Installation odometer cannot be negative',
      );
    }

    const part = MotorcyclePart.create(dto);

    return this.repository.save(part);
  }
}
