import { Injectable, Inject } from '@nestjs/common';
import {
  PART_WEAR_REPOSITORY,
  PartWearRepositoryPort,
} from '../ports/part-wear.repository.port';
import { PartWear } from '../../domain/entities/part-wear.entity';

@Injectable()
export class GetPartsDueForMaintenanceUseCase {
  constructor(
    @Inject(PART_WEAR_REPOSITORY)
    private readonly partWearRepository: PartWearRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<PartWear[]> {
    const partsDue =
      await this.partWearRepository.findPartsDueForMaintenance(userMotocycleId);

    return partsDue.sort(
      (a, b) =>
        b.getCurrentWearPercentage().getValue() -
        a.getCurrentWearPercentage().getValue(),
    );
  }
}
