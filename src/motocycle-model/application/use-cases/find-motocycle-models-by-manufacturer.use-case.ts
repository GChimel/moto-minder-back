import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';

@Injectable()
export class FindMotocycleModelsByManufacturerUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(manufacturerId: string): Promise<MotocycleModel[]> {
    return this.repository.findByManufacturerId(manufacturerId);
  }
}
