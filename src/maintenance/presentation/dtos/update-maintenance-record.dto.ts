import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

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
  nextServiceInterval?: {
    intervalKm?: number;
    intervalMonths?: number;
  };
}
