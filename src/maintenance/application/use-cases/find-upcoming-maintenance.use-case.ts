import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import {
  MAINTENANCE_RECORD_REPOSITORY,
  MaintenanceRecordRepositoryPort,
} from '../ports/maintenance-record.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface UpcomingMaintenanceDto {
  record: MaintenanceRecord;
  nextServiceDueOdometer?: number;
  nextServiceDueDate?: Date;
  isOverdueByOdometer: boolean;
  isOverdueByDate: boolean;
}

@Injectable()
export class FindUpcomingMaintenanceUseCase {
  constructor(
    @Inject(MAINTENANCE_RECORD_REPOSITORY)
    private readonly repository: MaintenanceRecordRepositoryPort,
  ) {}

  async execute(
    userMotocycleId: string,
    currentOdometer: number,
  ): Promise<UpcomingMaintenanceDto[]> {
    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    if (currentOdometer < 0) {
      throw new InvalidArgumentException(
        'currentOdometer',
        'Current odometer cannot be negative',
      );
    }

    const records =
      await this.repository.findByUserMotocycleId(userMotocycleId);

    const upcomingMaintenance: UpcomingMaintenanceDto[] = records
      .filter((record) => record.getNextServiceInterval() !== undefined)
      .map((record) => {
        const nextServiceDueOdometer = record.calculateNextServiceDueOdometer();
        const nextServiceDueDate = record.calculateNextServiceDueDate();

        const isOverdueByOdometer =
          nextServiceDueOdometer !== undefined &&
          currentOdometer >= nextServiceDueOdometer;

        const isOverdueByDate =
          nextServiceDueDate !== undefined && new Date() >= nextServiceDueDate;

        return {
          record,
          nextServiceDueOdometer,
          nextServiceDueDate,
          isOverdueByOdometer,
          isOverdueByDate,
        };
      })

      .sort((a, b) => {
        if (a.isOverdueByOdometer && !b.isOverdueByOdometer) return -1;
        if (!a.isOverdueByOdometer && b.isOverdueByOdometer) return 1;
        if (a.isOverdueByDate && !b.isOverdueByDate) return -1;
        if (!a.isOverdueByDate && b.isOverdueByDate) return 1;

        if (a.nextServiceDueOdometer && b.nextServiceDueOdometer) {
          return a.nextServiceDueOdometer - b.nextServiceDueOdometer;
        }

        const aDate = a.nextServiceDueDate || new Date(0);
        const bDate = b.nextServiceDueDate || new Date(0);
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });

    return upcomingMaintenance;
  }
}
