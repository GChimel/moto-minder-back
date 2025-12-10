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
    // Validate that id is provided
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException(
        'id',
        'Maintenance record ID is required',
      );
    }

    // Find the existing record
    const record = await this.repository.findById(id);
    if (!record) {
      throw new MaintenanceRecordNotFoundException(id);
    }

    // Update cost if provided
    if (updateDto.cost !== undefined) {
      record.updateCost(updateDto.cost);
    }

    // Update notes if provided
    if (updateDto.notes !== undefined) {
      record.updateNotes(updateDto.notes);
    }

    // Update parts used if provided
    if (updateDto.partsUsed !== undefined) {
      record.updatePartsUsed(updateDto.partsUsed);
    }

    // Update next service interval if provided
    if (updateDto.nextServiceInterval !== undefined) {
      const nextServiceInterval = updateDto.nextServiceInterval
        ? new ServiceInterval(updateDto.nextServiceInterval)
        : undefined;
      record.updateNextServiceInterval(nextServiceInterval);
    }

    // Persist updated record
    return this.repository.save(record);
  }
}
