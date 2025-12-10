import { Injectable, Inject } from '@nestjs/common';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';

@Injectable()
export class FindPartsByMotorcycleUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<MotorcyclePart[]> {
    const parts = await this.repository.findByUserMotocycleId(userMotocycleId);

    return parts.sort((a, b) => {
      return (
        b.getInstallationDate().getTime() - a.getInstallationDate().getTime()
      );
    });
  }
}
