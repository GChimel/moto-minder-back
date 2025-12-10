import { Inject, Injectable } from '@nestjs/common';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../ports/user-motocycle.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';

export interface UpdateUserMotocycleDto {
  nickname?: string;
  manufacturingYear?: number;
  currentOdometer?: number;
}

@Injectable()
export class UpdateUserMotocycleUseCase {
  constructor(
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
  ) {}

  async execute(
    id: string,
    dto: UpdateUserMotocycleDto,
  ): Promise<UserMotocycle> {
    const userMotocycle = await this.userMotocycleRepository.findById(id);
    if (!userMotocycle) {
      throw new EntityNotFoundException('UserMotocycle', id);
    }

    if (dto.nickname) {
      userMotocycle.updateNickname(dto.nickname);
    }

    if (dto.manufacturingYear !== undefined) {
      userMotocycle.updateManufacturingYear(dto.manufacturingYear);
    }

    if (dto.currentOdometer !== undefined) {
      userMotocycle.updateOdometer(dto.currentOdometer);
    }

    return this.userMotocycleRepository.save(userMotocycle);
  }
}
