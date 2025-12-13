import {
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StartRideDto {
  @IsString()
  userMotocycleId: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsInt()
  @IsPositive()
  startOdometer: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  endOdometer?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelConsumed?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
