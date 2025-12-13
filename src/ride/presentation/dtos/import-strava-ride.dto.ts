import { IsString, IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class ImportStravaRideDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsInt()
  @IsPositive()
  stravaActivityId!: number;

  @IsString()
  @IsNotEmpty()
  userMotocycleId!: string;

  @IsInt()
  @IsPositive()
  startOdometer!: number;

  @IsInt()
  @IsPositive()
  endOdometer!: number;
}
