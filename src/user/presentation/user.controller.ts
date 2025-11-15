import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { User } from '../domain/entities/user.entity';
import { CreateUserModelDto } from './dtos/create-user-model.dto';
import { UpdateUserModelDto } from './dtos/update-user-model.dto';
import { UserModelResponseDto } from './dtos/user-model-response.dto';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';
import { GetUser } from '../../auth/presentation/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserModelResponseDto[]> {
    const users = await this.findAllUserUseCase.execute();
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@GetUser() user: User): UserModelResponseDto {
    return this.mapUserToResponse(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<UserModelResponseDto> {
    const user = await this.findUserByIdUseCase.execute(id);
    return this.mapUserToResponse(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
    };
  }
}
