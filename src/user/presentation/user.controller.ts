import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { User } from '../domain/entities/user.entity';
import { CreateUserModelDto } from './dtos/create-user-model.dto';
import { UpdateUserModelDto } from './dtos/update-user-model.dto';
import { UserModelResponseDto } from './dtos/user-model-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUserUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserModelDto): Promise<UserModelResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return this.mapUserToResponse(user);
  }

  @Get()
  async findAll(): Promise<UserModelResponseDto[]> {
    const users = await this.findAllUserUseCase.execute();
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserModelResponseDto> {
    const user = await this.findUserByIdUseCase.execute(id);
    return this.mapUserToResponse(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserModelDto,
  ): Promise<UserModelResponseDto> {
    const user = await this.updateUserUseCase.execute(id, dto);
    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      password: user.getPassword(),
    };
  }
}
