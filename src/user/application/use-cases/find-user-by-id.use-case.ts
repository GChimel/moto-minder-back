import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }
}
