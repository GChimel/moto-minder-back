import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../user/application/ports/user.repository.port';
import { MOTOCYCLE_MODEL_REPOSITORY } from '../../../motocycle-model/application/ports/motocycle-model.repository.port';
import { MotocycleModelRepositoryPort } from '../../../motocycle-model/application/ports/motocycle-model.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';

export interface CreateUserMotocycleDto {
  userId: string;
  motocycleModelId: string;
  nickname: string;
  manufacturingYear: number;
  currentOdometer: number;
}

@Injectable()
export class CreateUserMotocycleUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly motocycleModelRepository: MotocycleModelRepositoryPort,
  ) {}

  async execute(dto: CreateUserMotocycleDto): Promise<UserMotocycle> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new EntityNotFoundException('User', dto.userId);
    }

    const motocycleModel = await this.motocycleModelRepository.findById(
      dto.motocycleModelId,
    );
    if (!motocycleModel) {
      throw new EntityNotFoundException('MotocycleModel', dto.motocycleModelId);
    }

    const modelYearStart = motocycleModel.getYearStart();
    const modelYearEnd = motocycleModel.getYearEnd();

    if (
      dto.manufacturingYear < modelYearStart ||
      dto.manufacturingYear > modelYearEnd
    ) {
      throw new ConflictException(
        `Manufacturing year ${dto.manufacturingYear} is outside the model's production range (${modelYearStart}-${modelYearEnd})`,
      );
    }

    const userMotocycle = UserMotocycle.create(dto);
    return this.userMotocycleRepository.save(userMotocycle);
  }
}
