import { Injectable, Inject } from '@nestjs/common';
import {
  PART_WEAR_REPOSITORY,
  PartWearRepositoryPort,
} from '../ports/part-wear.repository.port';
import { PartWear } from '../../domain/entities/part-wear.entity';
import { PartWearNotFoundException } from '../../domain/exceptions/part-wear.exceptions';

@Injectable()
export class GetPartWearUseCase {
  constructor(
    @Inject(PART_WEAR_REPOSITORY)
    private readonly partWearRepository: PartWearRepositoryPort,
  ) {}

  async execute(partWearId: string): Promise<PartWear> {
    const partWear = await this.partWearRepository.findById(partWearId);
    if (!partWear) {
      throw new PartWearNotFoundException(partWearId);
    }
    return partWear;
  }
}
