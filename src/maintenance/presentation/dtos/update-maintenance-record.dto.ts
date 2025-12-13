import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class UpdateMaintenanceRecordDto {
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
