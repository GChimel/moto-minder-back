import {
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class SendMaintenanceAlertDto {
  @IsString()
  @IsNotEmpty()
  motorcycleName!: string;

  @IsString()
  @IsNotEmpty()
  partName!: string;

  @IsNumber()
  @IsPositive()
  wearPercentage!: number;

  @IsInt()
  @IsPositive()
  replacementThreshold!: number;

  @IsInt()
  @IsPositive()
  projectedReplacementKm!: number;

  @IsString()
  @IsNotEmpty()
  partId!: string;
}
