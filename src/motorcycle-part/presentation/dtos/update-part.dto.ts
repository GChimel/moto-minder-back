import {
  IsOptional,
  IsString,
  IsNumber,
  Max,
  IsInt,
  Min,
} from 'class-validator';

export class UpdatePartDto {
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in km must be a number' })
  @IsInt({ message: 'Expected lifespan in km must be an integer' })
  @Min(1, { message: 'Expected lifespan in km must be at least 1' })
  @Max(1000000, { message: 'Expected lifespan in km cannot exceed 1,000,000' })
  expectedLifespanKm?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Expected lifespan in months must be a number' })
  @IsInt({ message: 'Expected lifespan in months must be an integer' })
  @Min(1, { message: 'Expected lifespan in months must be at least 1' })
  @Max(120, { message: 'Expected lifespan in months cannot exceed 120' })
  expectedLifespanMonths?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Replacement threshold must be a number' })
  @IsInt({ message: 'Replacement threshold must be an integer' })
  @Min(0, { message: 'Replacement threshold cannot be less than 0' })
  @Max(100, { message: 'Replacement threshold cannot exceed 100' })
  replacementThreshold?: number;
}
