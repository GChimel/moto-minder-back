import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserUseCase,
} from '../application/use-cases/create-user.user-case';
import { User } from '../domain/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() request: CreateUserDto) {
    const user = await this.createUserUseCase.execute(request);
    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
