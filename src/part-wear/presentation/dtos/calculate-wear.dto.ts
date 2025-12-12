import { IsNumber, IsPositive, IsInt } from 'class-validator';

export class CalculateWearDto {
  @IsNumber({}, { message: 'currentOdometer must be a number' })
  @IsInt({ message: 'currentOdometer must be an integer' })
  @IsPositive({ message: 'currentOdometer must be positive' })
  currentOdometer: number;
}
