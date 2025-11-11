import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.repository.findAll();
  }
}
