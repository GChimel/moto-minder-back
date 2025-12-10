import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class FindMaintenanceByMotorcycleUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<MaintenanceRecord[]> {
    // Validate that userMotocycleId is provided
    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    // Find all maintenance records for the motorcycle
    const records =
      await this.repository.findByUserMotocycleId(userMotocycleId);

    // Sort by performedAt in descending order (newest first)
    return records.sort(
      (a, b) =>
        new Date(b.getPerformedAt()).getTime() -
        new Date(a.getPerformedAt()).getTime(),
    );
  }
}
