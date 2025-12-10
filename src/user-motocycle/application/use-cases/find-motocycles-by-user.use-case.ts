import { Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../user/application/ports/user.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';

@Injectable()
export class FindMotocyclesByUserUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserMotocycle[]> {

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    return this.userMotocycleRepository.findByUserId(userId);
  }
}
