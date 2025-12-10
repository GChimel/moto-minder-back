import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateUserMotocycleDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  manufacturingYear?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  currentOdometer?: number;
}
