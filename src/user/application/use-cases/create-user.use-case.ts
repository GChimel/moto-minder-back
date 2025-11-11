import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const exisitingUser = await this.userRepository.findByEmail(dto.email);

    if (exisitingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({ ...dto });
    return this.userRepository.save(user);
  }
}
