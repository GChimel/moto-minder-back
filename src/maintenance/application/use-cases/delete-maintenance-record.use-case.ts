import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { MaintenanceRecordNotFoundException } from '../../domain/exceptions/maintenance-exceptions';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class DeleteMaintenanceRecordUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
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

    await this.repository.delete(id);
  }
}
