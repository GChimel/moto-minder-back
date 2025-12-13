import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RideCompletedEvent } from '../../../ride/domain/events/ride-completed.event';
import { CalculatePartWearUseCase } from '../use-cases/calculate-part-wear.use-case';
import { Inject } from '@nestjs/common';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../../../motorcycle-part/application/ports/motorcycle-part.repository.port';
import {
  PartWearRepositoryPort,
  PART_WEAR_REPOSITORY,
} from '../ports/part-wear.repository.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaintenanceThresholdCrossedEvent } from '../../domain/events/maintenance-threshold-crossed.event';

@Injectable()
export class OnRideCompletedListener {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly partRepository: MotorcyclePartRepositoryPort,
    @Inject(PART_WEAR_REPOSITORY)
    private readonly wearRepository: PartWearRepositoryPort,
    private readonly calculatePartWearUseCase: CalculatePartWearUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('ride.completed', { async: true })
  async handleRideCompleted(event: RideCompletedEvent): Promise<void> {
    const userMotocycleId = event.userMotocycleId;

    const activeParts =
      await this.partRepository.findActiveByUserMotocycleId(userMotocycleId);

    for (const part of activeParts) {
      const partWear = await this.wearRepository.findByMotorcyclePartId(
        part.getId().getValue(),
      );

      if (!partWear) {
        continue;
      }

      const previousWear = partWear.getCurrentWearPercentage().getValue();
      const result = await this.calculatePartWearUseCase.execute(
        partWear.getId().getValue(),
        event.endOdometer,
      );

      const previousDue = previousWear >= part.getReplacementThreshold();
      const nowDue =
        result.currentWearPercentage >= part.getReplacementThreshold();

      if (!previousDue && nowDue) {
        this.eventEmitter.emit(
          'maintenance-threshold.crossed',
          new MaintenanceThresholdCrossedEvent(
            result.partWear.getId().getValue(),
            part.getId().getValue(),
            userMotocycleId,
            result.currentWearPercentage,
            part.getReplacementThreshold(),
          ),
        );
      }
    }
  }
}
