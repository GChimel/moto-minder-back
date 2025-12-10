import { Injectable, Inject } from '@nestjs/common';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';

@Injectable()
export class FindActivePartsByMotorcycleUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<MotorcyclePart[]> {
    const parts =
      await this.repository.findActiveByUserMotocycleId(userMotocycleId);

    return parts.sort((a, b) => {
      const categoryComparison = a
        .getPartCategory()
        .localeCompare(b.getPartCategory());
      if (categoryComparison !== 0) {
        return categoryComparison;
      }
      return a.getPartType().localeCompare(b.getPartType());
    });
  }
}
