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

    if (!dto.userMotocycleId || dto.userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    const performedAtDate = new Date(dto.performedAt);
    if (performedAtDate > new Date()) {
      throw new InvalidArgumentException(
        'performedAt',
        'Service date cannot be in the future',
      );
    }

    if (dto.odometerAtService < 0) {
      throw new InvalidArgumentException(
        'odometerAtService',
        'Odometer reading cannot be negative',
      );
    }

    const maintenanceRecord = MaintenanceRecord.create(dto);

    return this.repository.save(maintenanceRecord);
  }
}
