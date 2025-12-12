import { Injectable, Inject } from '@nestjs/common';
import {
  PART_WEAR_REPOSITORY,
  PartWearRepositoryPort,
} from '../ports/part-wear.repository.port';
import { PartWear } from '../../domain/entities/part-wear.entity';

@Injectable()
export class GetMotorcyclePartsWearUseCase {
  constructor(
    @Inject(PART_WEAR_REPOSITORY)
    private readonly partWearRepository: PartWearRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<PartWear[]> {
    return this.partWearRepository.findByUserMotocycleId(userMotocycleId);
  }
}
