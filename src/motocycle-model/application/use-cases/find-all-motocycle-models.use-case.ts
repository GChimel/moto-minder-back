import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';

@Injectable()
export class FindAllMotocycleModelsUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(): Promise<MotocycleModel[]> {
    return this.repository.findAll();
  }
}
