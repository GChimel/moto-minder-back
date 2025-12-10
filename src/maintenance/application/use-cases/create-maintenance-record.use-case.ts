import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { CreateMaintenanceRecordDto } from '../../domain/entities/maintenance-record.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class CreateMaintenanceRecordUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(dto: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    // Validate that userMotocycleId is provided
    if (!dto.userMotocycleId || dto.userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    // Validate that performedAt is in the past
    const performedAtDate = new Date(dto.performedAt);
    if (performedAtDate > new Date()) {
      throw new InvalidArgumentException(
        'performedAt',
        'Service date cannot be in the future',
      );
    }

    // Validate that odometerAtService is non-negative
    if (dto.odometerAtService < 0) {
      throw new InvalidArgumentException(
        'odometerAtService',
        'Odometer reading cannot be negative',
      );
    }

    // Create the maintenance record entity
    const maintenanceRecord = MaintenanceRecord.create(dto);

    // Persist to repository
    return this.repository.save(maintenanceRecord);
  }
}
