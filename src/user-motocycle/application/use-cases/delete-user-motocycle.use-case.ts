import { Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';

@Injectable()
export class DeleteUserMotocycleUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const userMotocycle = await this.userMotocycleRepository.findById(id);
    if (!userMotocycle) {
      throw new EntityNotFoundException('UserMotocycle', id);
    }

    await this.userMotocycleRepository.delete(id);
  }
}
