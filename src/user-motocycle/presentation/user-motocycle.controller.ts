import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserMotocycleUseCase } from '../application/use-cases/create-user-motocycle.use-case';
import { FindUserMotocyclesUseCase } from '../application/use-cases/find-user-motocycles.use-case';
import { FindUserMotocycleByIdUseCase } from '../application/use-cases/find-user-motocycle-by-id.use-case';
import { FindMotocyclesByUserUseCase } from '../application/use-cases/find-motocycles-by-user.use-case';
import { UpdateUserMotocycleUseCase } from '../application/use-cases/update-user-motocycle.use-case';
import { DeleteUserMotocycleUseCase } from '../application/use-cases/delete-user-motocycle.use-case';
import { CreateUserMotocycleDto } from './dtos/create-user-motocycle.dto';
import { UpdateUserMotocycleDto } from './dtos/update-user-motocycle.dto';
import { UserMotocycleResponseDto } from './dtos/user-motocycle-response.dto';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';
import { GetUser } from '../../auth/presentation/decorators/get-user.decorator';
import { User } from '../../user/domain/entities/user.entity';

@Controller('user-motocycles')
@UseGuards(JwtAuthGuard)
export class UserMotocycleController {
  constructor(
    private readonly createUserMotocycleUseCase: CreateUserMotocycleUseCase,
    private readonly findUserMotocyclesUseCase: FindUserMotocyclesUseCase,
    private readonly findUserMotocycleByIdUseCase: FindUserMotocycleByIdUseCase,
    private readonly findMotocyclesByUserUseCase: FindMotocyclesByUserUseCase,
    private readonly updateUserMotocycleUseCase: UpdateUserMotocycleUseCase,
    private readonly deleteUserMotocycleUseCase: DeleteUserMotocycleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: CreateUserMotocycleDto,
  ): Promise<UserMotocycleResponseDto> {
    const userMotocycle = await this.createUserMotocycleUseCase.execute({
      userId: user.getId().getValue(),
      motocycleModelId: dto.motocycleModelId,
      nickname: dto.nickname,
      manufacturingYear: dto.manufacturingYear,
      currentOdometer: dto.currentOdometer,
    });
    return this.mapToResponse(userMotocycle);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserMotocycleResponseDto[]> {
    const userMotocycles = await this.findUserMotocyclesUseCase.execute();
    return userMotocycles.map((m) => this.mapToResponse(m));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async findMyMotocycles(
    @GetUser() user: User,
  ): Promise<UserMotocycleResponseDto[]> {
    const userMotocycles = await this.findMotocyclesByUserUseCase.execute(
      user.getId().getValue(),
    );
    return userMotocycles.map((m) => this.mapToResponse(m));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<UserMotocycleResponseDto> {
    const userMotocycle = await this.findUserMotocycleByIdUseCase.execute(id);
    return this.mapToResponse(userMotocycle);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserMotocycleDto,
  ): Promise<UserMotocycleResponseDto> {
    const userMotocycle = await this.updateUserMotocycleUseCase.execute(
      id,
      dto,
    );
    return this.mapToResponse(userMotocycle);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserMotocycleUseCase.execute(id);
  }

  private mapToResponse(userMotocycle): UserMotocycleResponseDto {
    return {
      id: userMotocycle.getId().getValue(),
      userId: userMotocycle.getUserId().getValue(),
      motocycleModelId: userMotocycle.getMotocycleModelId().getValue(),
      nickname: userMotocycle.getNickname().getValue(),
      manufacturingYear: userMotocycle.getManufacturingYear().getValue(),
      currentOdometer: userMotocycle.getCurrentOdometer().getValue(),
      createdAt: userMotocycle.getCreatedAt(),
      updatedAt: userMotocycle.getUpdatedAt(),
    };
  }
}
