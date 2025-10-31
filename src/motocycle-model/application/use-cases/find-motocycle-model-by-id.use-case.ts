import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';
import { MotocycleModelNotFoundException } from '../../domain/exceptions/motocycle-model-not-found.exception';

@Injectable()
export class FindMotocycleModelByIdUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(id: string): Promise<MotocycleModel> {
    const motocycleModel = await this.repository.findById(id);

    if (!motocycleModel) {
      throw new MotocycleModelNotFoundException(id);
    }

    return motocycleModel;
  }
}
