import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class ReplacePartDto {
  @IsNotEmpty({ message: 'Replacement date is required' })
  @IsDateString({}, { message: 'Replacement date must be a valid date' })
  replacementDate: string;

  @IsNotEmpty({ message: 'Replacement odometer is required' })
  @IsNumber({}, { message: 'Replacement odometer must be a number' })
  @IsInt({ message: 'Replacement odometer must be an integer' })
  @Min(0, { message: 'Replacement odometer cannot be negative' })
  replacementOdometer: number;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in km must be a number' })
  @IsInt({ message: 'Expected lifespan in km must be an integer' })
  @Min(1, { message: 'Expected lifespan in km must be at least 1' })
  expectedLifespanKm?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in months must be a number' })
  @IsInt({ message: 'Expected lifespan in months must be an integer' })
  @Min(1, { message: 'Expected lifespan in months must be at least 1' })
  expectedLifespanMonths?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Wear rate per km must be a number' })
  @Min(0.00001, { message: 'Wear rate per km must be at least 0.00001' })
  @Max(1, { message: 'Wear rate per km cannot exceed 1' })
  wearRatePerKm?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Replacement threshold must be a number' })
  @IsInt({ message: 'Replacement threshold must be an integer' })
  @Min(0, { message: 'Replacement threshold cannot be less than 0' })
  @Max(100, { message: 'Replacement threshold cannot exceed 100' })
  replacementThreshold?: number;

  @IsOptional()
  @MaxLength(200, { message: 'Notes cannot exceed 200 characters' })
  notes?: string;
}
