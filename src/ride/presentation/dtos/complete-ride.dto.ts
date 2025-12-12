import { IsInt, IsPositive, IsOptional, IsNumber } from 'class-validator';

export class CompleteRideDto {
  @IsInt()
  @IsPositive()
  endOdometer: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelConsumed?: number;
}
