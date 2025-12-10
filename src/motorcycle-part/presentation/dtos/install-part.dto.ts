import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsPositive,
  IsInt,
} from 'class-validator';
import { PartType } from '../../domain/enums/part-type.enum';
import { PartCategory } from '../../domain/enums/part-category.enum';

export class InstallPartDto {
  @IsNotEmpty({ message: 'User motorcycle ID is required' })
  @IsUUID('4', { message: 'User motorcycle ID must be a valid UUID' })
  userMotocycleId: string;

  @IsNotEmpty({ message: 'Part type is required' })
  @IsEnum(PartType, { message: 'Invalid part type' })
  partType: PartType;

  @IsNotEmpty({ message: 'Part category is required' })
  @IsEnum(PartCategory, { message: 'Invalid part category' })
  partCategory: PartCategory;

  @IsNotEmpty({ message: 'Part name is required' })
  @IsString({ message: 'Part name must be a string' })
  @MinLength(1, { message: 'Part name cannot be empty' })
  @MaxLength(200, { message: 'Part name cannot exceed 200 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Manufacturer must be a string' })
  @MaxLength(100, { message: 'Manufacturer cannot exceed 100 characters' })
  manufacturer?: string;

  @IsOptional()
  @IsString({ message: 'Model must be a string' })
  @MaxLength(100, { message: 'Model cannot exceed 100 characters' })
  model?: string;

  @IsNotEmpty({ message: 'Installation date is required' })
  @IsDateString({}, { message: 'Installation date must be a valid date' })
  installationDate: string;

  @IsNotEmpty({ message: 'Installation odometer is required' })
  @IsNumber({}, { message: 'Installation odometer must be a number' })
  @IsInt({ message: 'Installation odometer must be an integer' })
  @Min(0, { message: 'Installation odometer cannot be negative' })
  installationOdometer: number;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in km must be a number' })
  @IsInt({ message: 'Expected lifespan in km must be an integer' })
  @IsPositive({ message: 'Expected lifespan in km must be positive' })
  @Max(1000000, { message: 'Expected lifespan in km cannot exceed 1,000,000' })
  expectedLifespanKm?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in months must be a number' })
  @IsInt({ message: 'Expected lifespan in months must be an integer' })
  @IsPositive({ message: 'Expected lifespan in months must be positive' })
  @Max(120, { message: 'Expected lifespan in months cannot exceed 120' })
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
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
