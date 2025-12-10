import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../domain/enums/service-type.enum';

export class CreateMaintenanceRecordDto {
  @IsString()
  userMotocycleId: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType | string;

  @IsDate()
  @Type(() => Date)
  performedAt: Date;

  @IsInt()
  @Min(0)
  odometerAtService: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  partsUsed?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  nextServiceInterval?: {
    intervalKm?: number;
    intervalMonths?: number;
  };
}
