import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CoolingSystem } from '../../domain/enums/cooling-system.enum';
import { EngineCycle } from '../../domain/enums/engine-cycle.enum';

export class CreateMotocycleModelDto {
  @IsNotEmpty()
  @IsUUID()
  manufacturerId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearStart: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearEnd: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  displacementCc: number;

  @IsNotEmpty()
  @IsEnum(EngineCycle)
  engineCycle: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  engineType: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  valvesPerCylinder: number;

  @IsNotEmpty()
  @IsEnum(CoolingSystem)
  coolingSystem: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  fuelSystem: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  sparkPlugDefault: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  batteryDefault: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  finalDrive: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  gears: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  clutchType: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  engineOilCapacityL: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  recommendedOilViscosity: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  recommendedOilSpec: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  fuelTankCapacityL: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  coolantCapacityL?: number | null;
}
