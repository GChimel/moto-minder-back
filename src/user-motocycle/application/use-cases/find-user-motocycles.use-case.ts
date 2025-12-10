import { Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';

@Injectable()
export class FindUserMotocyclesUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
  ) {}

  async execute(): Promise<UserMotocycle[]> {
    return this.userMotocycleRepository.findAll();
  }
}
