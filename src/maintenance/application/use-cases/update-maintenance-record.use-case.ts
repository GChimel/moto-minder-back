import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { MaintenanceRecordNotFoundException } from '../../domain/exceptions/maintenance-exceptions';
import { ServiceInterval } from '../../domain/value-objects/service-interval.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface UpdateMaintenanceRecordDto {
  cost?: number;
  notes?: string;
  partsUsed?: string;
  nextServiceInterval?: { intervalKm?: number; intervalMonths?: number };
}

@Injectable()
export class UpdateMaintenanceRecordUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(
    id: string,
    updateDto: UpdateMaintenanceRecordDto,
  ): Promise<MaintenanceRecord> {
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException(
        'id',
        'Maintenance record ID is required',
      );
    }

    const record = await this.repository.findById(id);
    if (!record) {
      throw new MaintenanceRecordNotFoundException(id);
    }

    if (updateDto.cost !== undefined) {
      record.updateCost(updateDto.cost);
    }

    if (updateDto.notes !== undefined) {
      record.updateNotes(updateDto.notes);
    }

    if (updateDto.partsUsed !== undefined) {
      record.updatePartsUsed(updateDto.partsUsed);
    }

    if (updateDto.nextServiceInterval !== undefined) {
      const nextServiceInterval = updateDto.nextServiceInterval
        ? new ServiceInterval(updateDto.nextServiceInterval)
        : undefined;
      record.updateNextServiceInterval(nextServiceInterval);
    }

    return this.repository.save(record);
  }
}
