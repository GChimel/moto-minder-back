import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserMotocycleDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Nickname must be at least 1 character long' })
  @MaxLength(100, { message: 'Nickname must be at most 100 characters long' })
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
