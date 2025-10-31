import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CoolingSystem } from '../../domain/enums/cooling-system.enum';
import { EngineCycle } from '../../domain/enums/engine-cycle.enum';

export class UpdateMotocycleModelDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearStart?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearEnd?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  displacementCc?: number;

  @IsOptional()
  @IsEnum(EngineCycle)
  engineCycle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  engineType?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  valvesPerCylinder?: number;

  @IsOptional()
  @IsEnum(CoolingSystem)
  coolingSystem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fuelSystem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sparkPlugDefault?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  batteryDefault?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  finalDrive?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  gears?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  clutchType?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  engineOilCapacityL?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  recommendedOilViscosity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  recommendedOilSpec?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  fuelTankCapacityL?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  coolantCapacityL?: number | null;
}
