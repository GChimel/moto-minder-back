import { Injectable, Inject } from '@nestjs/common';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';
import { PartLifespan } from '../../domain/value-objects/part-lifespan.vo';
import { MotorcyclePartNotFoundException } from '../../domain/exceptions/motorcycle-part-exceptions';

export interface UpdatePartDto {
  notes?: string;
  expectedLifespanKm?: number;
  expectedLifespanMonths?: number;
}

@Injectable()
export class UpdatePartUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(partId: string, dto: UpdatePartDto): Promise<MotorcyclePart> {
    const part = await this.repository.findById(partId);

    if (!part) {
      throw new MotorcyclePartNotFoundException(partId);
    }

    if (dto.notes !== undefined) {
      part.updateNotes(dto.notes);
    }

    if (
      dto.expectedLifespanKm !== undefined ||
      dto.expectedLifespanMonths !== undefined
    ) {
      const lifespan = new PartLifespan({
        lifespanKm: dto.expectedLifespanKm,
        lifespanMonths: dto.expectedLifespanMonths,
      });
      part.updateExpectedLifespan(lifespan);
    }

    return this.repository.save(part);
  }
}
