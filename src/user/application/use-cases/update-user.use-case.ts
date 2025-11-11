import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserPassword } from '../../domain/value-objects/user-password.vo';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    if (dto.email && dto.email !== existingUser.getEmail().getValue()) {
      const userWithEmail = await this.userRepository.findByEmail(dto.email);
      if (userWithEmail) {
        throw new Error('Email already in use');
      }
    }

    if (dto.name) {
      existingUser.updateName(dto.name);
    }

    if (dto.email) {
      existingUser.updateEmail(dto.email);
    }

    if (dto.password) {
      const hashedPassword = await UserPassword.create(dto.password);
      if (hashedPassword) {
        existingUser.updatePassword(hashedPassword.getValue());
      }
    }

    return this.userRepository.save(existingUser);
  }
}
