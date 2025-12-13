import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MaintenanceThresholdCrossedEvent } from '../../../part-wear/domain/events/maintenance-threshold-crossed.event';
import { Inject } from '@nestjs/common';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../../../motorcycle-part/application/ports/motorcycle-part.repository.port';
import {
  USER_MOTOCYCLE_REPOSITORY,
  UserMotocycleRepositoryPort,
} from '../../../user-motocycle/application/ports/user-motocycle.repository.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../../user/application/ports/user.repository.port';
import { SendMaintenanceAlertUseCase } from '../use-cases/send-maintenance-alert.use-case';

@Injectable()
export class OnMaintenanceThresholdCrossedListener {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly partRepository: MotorcyclePartRepositoryPort,
    @Inject(USER_MOTOCYCLE_REPOSITORY)
    private readonly userMotocycleRepository: UserMotocycleRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly sendMaintenanceAlertUseCase: SendMaintenanceAlertUseCase,
  ) {}

  @OnEvent('maintenance-threshold.crossed', { async: true })
  async handleThresholdCrossed(
    event: MaintenanceThresholdCrossedEvent,
  ): Promise<void> {
    const part = await this.partRepository.findById(event.motorcyclePartId);
    if (!part) {
      return;
    }

    const motorcycle = await this.userMotocycleRepository.findById(
      event.userMotocycleId,
    );
    if (!motorcycle) {
      return;
    }

    const user = await this.userRepository.findById(
      motorcycle.getUserId().getValue(),
    );
    if (!user) {
      return;
    }

    await this.sendMaintenanceAlertUseCase.execute({
      userId: user.getId().getValue(),
      userEmail: user.getEmail().getValue(),
      motorcycleName: motorcycle.getNickname().getValue(),
      partName: part.getName(),
      wearPercentage: event.wearPercentage,
      replacementThreshold: event.replacementThreshold,
      projectedReplacementKm: 0,
      partId: part.getId().getValue(),
    });
  }
}
