import { Injectable, Inject } from '@nestjs/common';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class DeletePartUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException('id', 'Part ID is required');
    }

    const existingPart = await this.repository.findById(id);
    if (!existingPart) {
      throw new InvalidArgumentException('id', 'Part not found');
    }

    await this.repository.delete(id);
  }
}
