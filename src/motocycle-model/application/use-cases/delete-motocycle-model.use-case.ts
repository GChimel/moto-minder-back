import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModelNotFoundException } from '../../domain/exceptions/motocycle-model-not-found.exception';

@Injectable()
export class DeleteMotocycleModelUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const motocycleModel = await this.repository.findById(id);

    if (!motocycleModel) {
      throw new MotocycleModelNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
