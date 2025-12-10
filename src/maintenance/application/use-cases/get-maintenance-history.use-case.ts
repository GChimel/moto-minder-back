import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface PaginationDto {
  skip: number;
  limit: number;
}

export interface MaintenanceHistoryResultDto {
  records: MaintenanceRecord[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}

@Injectable()
export class GetMaintenanceHistoryUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(
    userMotocycleId: string,
    pagination?: PaginationDto,
  ): Promise<MaintenanceHistoryResultDto> {
    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    const skip = pagination?.skip ?? 0;
    const limit = pagination?.limit ?? 50;

    if (skip < 0) {
      throw new InvalidArgumentException(
        'skip',
        'Skip parameter must be non-negative',
      );
    }

    if (limit < 1 || limit > 500) {
      throw new InvalidArgumentException(
        'limit',
        'Limit parameter must be between 1 and 500',
      );
    }

    const allRecords =
      await this.repository.findByUserMotocycleId(userMotocycleId);

    const sortedRecords = allRecords.sort(
      (a, b) =>
        new Date(b.getPerformedAt()).getTime() -
        new Date(a.getPerformedAt()).getTime(),
    );

    const records = sortedRecords.slice(skip, skip + limit);
    const total = sortedRecords.length;
    const hasMore = skip + limit < total;

    return {
      records,
      total,
      skip,
      limit,
      hasMore,
    };
  }
}
