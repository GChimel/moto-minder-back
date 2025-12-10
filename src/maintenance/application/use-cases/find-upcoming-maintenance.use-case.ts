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
    // Validate inputs
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

    // Find all maintenance records for the motorcycle
    const records =
      await this.repository.findByUserMotocycleId(userMotocycleId);

    // Filter records that have nextServiceInterval and calculate due dates
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
      // Sort by urgency: overdue items first, then by closest due date
      .sort((a, b) => {
        // Overdue items come first
        if (a.isOverdueByOdometer && !b.isOverdueByOdometer) return -1;
        if (!a.isOverdueByOdometer && b.isOverdueByOdometer) return 1;
        if (a.isOverdueByDate && !b.isOverdueByDate) return -1;
        if (!a.isOverdueByDate && b.isOverdueByDate) return 1;

        // Then sort by closest due odometer
        if (a.nextServiceDueOdometer && b.nextServiceDueOdometer) {
          return a.nextServiceDueOdometer - b.nextServiceDueOdometer;
        }

        // Then sort by closest due date
        const aDate = a.nextServiceDueDate || new Date(0);
        const bDate = b.nextServiceDueDate || new Date(0);
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });

    return upcomingMaintenance;
  }
}
