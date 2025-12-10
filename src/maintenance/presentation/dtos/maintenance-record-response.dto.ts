import { ServiceType } from '../../domain/enums/service-type.enum';

export class ServiceIntervalResponseDto {
  intervalKm?: number;
  intervalMonths?: number;
}

export class MaintenanceRecordResponseDto {
  id: string;
  userMotocycleId: string;
  serviceType: ServiceType | string;
  performedAt: Date;
  odometerAtService: number;
  cost?: number;
  partsUsed?: string;
  notes?: string;
  nextServiceInterval?: ServiceIntervalResponseDto;
  nextServiceDueOdometer?: number;
  nextServiceDueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
