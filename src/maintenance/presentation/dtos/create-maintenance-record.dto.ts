import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../domain/enums/service-type.enum';

export class NextServiceIntervalDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  intervalKm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  intervalMonths?: number;
}

export class CreateMaintenanceRecordDto {
  @IsNotEmpty()
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
  @ValidateNested()
  @Type(() => NextServiceIntervalDto)
  nextServiceInterval?: NextServiceIntervalDto;
}
