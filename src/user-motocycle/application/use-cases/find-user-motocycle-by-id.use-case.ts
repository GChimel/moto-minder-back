import { Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';

@Injectable()
export class FindUserMotocycleByIdUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
  ) {}

  async execute(id: string): Promise<UserMotocycle> {
    const userMotocycle = await this.userMotocycleRepository.findById(id);
    if (!userMotocycle) {
      throw new EntityNotFoundException('UserMotocycle', id);
    }
    return userMotocycle;
  }
}
