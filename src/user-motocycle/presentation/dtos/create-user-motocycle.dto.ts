import { IsString, IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateUserMotocycleDto {
  @IsUUID()
  motocycleModelId: string;

  @IsString()
  nickname: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  manufacturingYear: number;

  @IsInt()
  @Min(0)
  @Max(1000000)
  currentOdometer: number;
}
